import { Request, Response } from "express";
import { databaseService } from "../services/database";
import { ThirdPartyIntegration } from "@shared/workflows";
import { z } from "zod";

// Validation schemas
const ConnectIntegrationSchema = z.object({
  service: z.string(),
  credentials: z.record(z.any()),
  settings: z.record(z.any()).optional(),
});

const UpdateIntegrationSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["connected", "disconnected", "error"]).optional(),
  credentials: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
});

// In-memory storage for when database is not available
let inMemoryIntegrations: ThirdPartyIntegration[] = [
  {
    id: "1",
    name: "Google Search Console",
    type: "google_search_console",
    status: "connected",
    credentials: { clientId: "mock", clientSecret: "mock" },
    settings: { autoSync: true, syncInterval: 24 },
    lastSync: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    name: "Google Analytics 4",
    type: "google_analytics",
    status: "connected",
    credentials: { clientId: "mock", clientSecret: "mock" },
    settings: { autoSync: true, syncInterval: 12 },
    lastSync: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "3",
    name: "SEMrush",
    type: "semrush",
    status: "disconnected",
    credentials: {},
    settings: { autoSync: false, syncInterval: 168 },
  },
  {
    id: "4",
    name: "Ahrefs",
    type: "ahrefs",
    status: "error",
    credentials: { apiKey: "invalid" },
    settings: { autoSync: false, syncInterval: 168 },
    lastSync: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Get all integrations
export const getIntegrations = async (req: Request, res: Response) => {
  try {
    if (databaseService.isConnected()) {
      const integrations = await databaseService.query(
        "SELECT * FROM third_party_integrations ORDER BY created_at DESC"
      );
      
      // Parse JSON fields
      const parsedIntegrations = integrations.map((integration: any) => ({
        ...integration,
        credentials: integration.credentials ? JSON.parse(integration.credentials) : {},
        settings: integration.settings ? JSON.parse(integration.settings) : {},
      }));
      
      res.json(parsedIntegrations);
    } else {
      // Return in-memory data
      res.json(inMemoryIntegrations);
    }
  } catch (error) {
    console.error("Error fetching integrations:", error);
    res.status(500).json({ error: "Failed to fetch integrations" });
  }
};

// Connect a new service
export const connectService = async (req: Request, res: Response) => {
  try {
    const validatedData = ConnectIntegrationSchema.parse(req.body);
    const { service, credentials, settings = {} } = validatedData;

    // Generate a new integration
    const newIntegration: ThirdPartyIntegration = {
      id: `integration-${Date.now()}`,
      name: getServiceDisplayName(service),
      type: service as any,
      status: "connected",
      credentials,
      settings: {
        autoSync: true,
        syncInterval: 24,
        ...settings,
      },
      lastSync: new Date().toISOString(),
    };

    if (databaseService.isConnected()) {
      // Save to database
      await databaseService.query(
        `INSERT INTO third_party_integrations 
         (id, name, type, status, credentials, settings, last_sync, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newIntegration.id,
          newIntegration.name,
          newIntegration.type,
          newIntegration.status,
          JSON.stringify(newIntegration.credentials),
          JSON.stringify(newIntegration.settings),
          newIntegration.lastSync,
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );
    } else {
      // Add to in-memory storage
      inMemoryIntegrations.push(newIntegration);
    }

    // Test the connection
    const testResult = await testConnection(newIntegration);
    if (!testResult.success) {
      newIntegration.status = "error";
      if (databaseService.isConnected()) {
        await databaseService.query(
          "UPDATE third_party_integrations SET status = ? WHERE id = ?",
          ["error", newIntegration.id]
        );
      }
    }

    res.status(201).json({
      integration: newIntegration,
      testResult,
    });
  } catch (error) {
    console.error("Error connecting service:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request data", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to connect service" });
    }
  }
};

// Update an integration
export const updateIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateIntegrationSchema.parse(req.body);

    if (databaseService.isConnected()) {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      Object.entries(validatedData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "credentials" || key === "settings") {
            updateFields.push(`${key} = ?`);
            updateValues.push(JSON.stringify(value));
          } else {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
          }
        }
      });

      if (updateFields.length > 0) {
        updateFields.push("updated_at = ?");
        updateValues.push(new Date().toISOString());
        updateValues.push(id);

        await databaseService.query(
          `UPDATE third_party_integrations SET ${updateFields.join(", ")} WHERE id = ?`,
          updateValues
        );
      }

      // Fetch updated integration
      const updated = await databaseService.query(
        "SELECT * FROM third_party_integrations WHERE id = ?",
        [id]
      );

      if (updated.length === 0) {
        return res.status(404).json({ error: "Integration not found" });
      }

      const integration = {
        ...updated[0],
        credentials: updated[0].credentials ? JSON.parse(updated[0].credentials) : {},
        settings: updated[0].settings ? JSON.parse(updated[0].settings) : {},
      };

      res.json(integration);
    } else {
      // Update in-memory storage
      const integrationIndex = inMemoryIntegrations.findIndex(i => i.id === id);
      if (integrationIndex === -1) {
        return res.status(404).json({ error: "Integration not found" });
      }

      inMemoryIntegrations[integrationIndex] = {
        ...inMemoryIntegrations[integrationIndex],
        ...validatedData,
      };

      res.json(inMemoryIntegrations[integrationIndex]);
    }
  } catch (error) {
    console.error("Error updating integration:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request data", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to update integration" });
    }
  }
};

// Disconnect/delete an integration
export const disconnectIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (databaseService.isConnected()) {
      const result = await databaseService.query(
        "DELETE FROM third_party_integrations WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Integration not found" });
      }
    } else {
      // Remove from in-memory storage
      const integrationIndex = inMemoryIntegrations.findIndex(i => i.id === id);
      if (integrationIndex === -1) {
        return res.status(404).json({ error: "Integration not found" });
      }

      inMemoryIntegrations.splice(integrationIndex, 1);
    }

    res.json({ success: true, message: "Integration disconnected successfully" });
  } catch (error) {
    console.error("Error disconnecting integration:", error);
    res.status(500).json({ error: "Failed to disconnect integration" });
  }
};

// Test an integration connection
export const testIntegrationConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let integration: ThirdPartyIntegration | undefined;

    if (databaseService.isConnected()) {
      const result = await databaseService.query(
        "SELECT * FROM third_party_integrations WHERE id = ?",
        [id]
      );

      if (result.length === 0) {
        return res.status(404).json({ error: "Integration not found" });
      }

      integration = {
        ...result[0],
        credentials: result[0].credentials ? JSON.parse(result[0].credentials) : {},
        settings: result[0].settings ? JSON.parse(result[0].settings) : {},
      };
    } else {
      integration = inMemoryIntegrations.find(i => i.id === id);
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
    }

    const testResult = await testConnection(integration);
    
    // Update integration status based on test result
    const newStatus = testResult.success ? "connected" : "error";
    if (integration.status !== newStatus) {
      await updateIntegrationStatus(id, newStatus);
    }

    res.json(testResult);
  } catch (error) {
    console.error("Error testing integration:", error);
    res.status(500).json({ error: "Failed to test integration" });
  }
};

// Sync data from an integration
export const syncIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let integration: ThirdPartyIntegration | undefined;

    if (databaseService.isConnected()) {
      const result = await databaseService.query(
        "SELECT * FROM third_party_integrations WHERE id = ?",
        [id]
      );

      if (result.length === 0) {
        return res.status(404).json({ error: "Integration not found" });
      }

      integration = {
        ...result[0],
        credentials: result[0].credentials ? JSON.parse(result[0].credentials) : {},
        settings: result[0].settings ? JSON.parse(result[0].settings) : {},
      };
    } else {
      integration = inMemoryIntegrations.find(i => i.id === id);
      if (!integration) {
        return res.status(404).json({ error: "Integration not found" });
      }
    }

    if (integration.status !== "connected") {
      return res.status(400).json({ error: "Integration is not connected" });
    }

    // Simulate data sync
    const syncResult = await performDataSync(integration);
    
    // Update last sync time
    const now = new Date().toISOString();
    if (databaseService.isConnected()) {
      await databaseService.query(
        "UPDATE third_party_integrations SET last_sync = ?, updated_at = ? WHERE id = ?",
        [now, now, id]
      );
    } else {
      const integrationIndex = inMemoryIntegrations.findIndex(i => i.id === id);
      if (integrationIndex !== -1) {
        inMemoryIntegrations[integrationIndex].lastSync = now;
      }
    }

    res.json({
      success: true,
      message: "Data synced successfully",
      lastSync: now,
      ...syncResult,
    });
  } catch (error) {
    console.error("Error syncing integration:", error);
    res.status(500).json({ error: "Failed to sync integration data" });
  }
};

// Helper functions
function getServiceDisplayName(serviceType: string): string {
  const serviceNames: { [key: string]: string } = {
    google_search_console: "Google Search Console",
    google_analytics: "Google Analytics 4",
    microsoft_clarity: "Microsoft Clarity",
    microsoft_ads: "Microsoft Advertising",
    azure_insights: "Azure Application Insights",
    linkedin_ads: "LinkedIn Ads",
    semrush: "SEMrush",
    ahrefs: "Ahrefs",
    pagespeed: "PageSpeed Insights",
    facebook: "Facebook/Meta",
    twitter: "Twitter/X",
  };

  return serviceNames[serviceType] || serviceType;
}

async function testConnection(integration: ThirdPartyIntegration): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    // Simulate connection testing based on integration type
    switch (integration.type) {
      case "google_search_console":
      case "google_analytics":
        return {
          success: true,
          message: "Google OAuth connection verified",
          data: { propertiesCount: 3 },
        };

      case "semrush":
        if (!integration.credentials.apiKey) {
          return {
            success: false,
            message: "API key is required for SEMrush integration",
          };
        }
        return {
          success: true,
          message: "SEMrush API key validated",
          data: { creditsRemaining: 8500 },
        };

      case "ahrefs":
        if (!integration.credentials.apiKey) {
          return {
            success: false,
            message: "API key is required for Ahrefs integration",
          };
        }
        return {
          success: true,
          message: "Ahrefs API key validated",
          data: { unitsRemaining: 450 },
        };

      case "microsoft_clarity":
      case "microsoft_ads":
      case "azure_insights":
        return {
          success: true,
          message: "Microsoft OAuth connection verified",
          data: { accountsCount: 2 },
        };

      case "linkedin_ads":
        if (!integration.credentials.accessToken) {
          return {
            success: false,
            message: "Access token is required for LinkedIn Ads",
          };
        }
        return {
          success: true,
          message: "LinkedIn access token validated",
          data: { adAccountsCount: 1 },
        };

      case "facebook":
        if (!integration.credentials.accessToken) {
          return {
            success: false,
            message: "Access token is required for Facebook integration",
          };
        }
        return {
          success: true,
          message: "Facebook access token validated",
          data: { pagesCount: 2 },
        };

      case "pagespeed":
        return {
          success: true,
          message: "PageSpeed Insights API available",
          data: { quotaRemaining: 1000 },
        };

      default:
        return {
          success: true,
          message: "Connection test completed",
        };
    }
  } catch (error) {
    console.error("Connection test failed:", error);
    return {
      success: false,
      message: "Connection test failed: " + (error instanceof Error ? error.message : "Unknown error"),
    };
  }
}

async function performDataSync(integration: ThirdPartyIntegration): Promise<{
  recordsProcessed: number;
  errors: string[];
}> {
  // Simulate data synchronization
  const recordsProcessed = Math.floor(Math.random() * 1000) + 100;
  const errors: string[] = [];

  // Simulate some potential errors
  if (Math.random() < 0.1) {
    errors.push("Rate limit exceeded for some requests");
  }

  return {
    recordsProcessed,
    errors,
  };
}

async function updateIntegrationStatus(id: string, status: string): Promise<void> {
  if (databaseService.isConnected()) {
    await databaseService.query(
      "UPDATE third_party_integrations SET status = ?, updated_at = ? WHERE id = ?",
      [status, new Date().toISOString(), id]
    );
  } else {
    const integrationIndex = inMemoryIntegrations.findIndex(i => i.id === id);
    if (integrationIndex !== -1) {
      inMemoryIntegrations[integrationIndex].status = status as any;
    }
  }
}

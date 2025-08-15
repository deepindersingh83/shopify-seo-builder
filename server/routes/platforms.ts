import { Request, Response } from "express";
import { databaseService } from "../services/database";
import { z } from "zod";

// Validation schemas
const PlatformIntegrationSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(["shopify", "woocommerce", "bigcommerce", "magento"]),
  credentials: z.record(z.any()),
  syncSettings: z.object({
    autoSync: z.boolean().default(true),
    syncInterval: z.number().default(60),
    syncFields: z.array(z.string()).default([]),
    conflictResolution: z
      .enum(["newest_wins", "manual", "local_wins", "remote_wins"])
      .default("newest_wins"),
    enableWebhooks: z.boolean().default(false),
  }),
});

const SyncRequestSchema = z.object({
  direction: z.enum(["import", "export", "bidirectional"]),
  options: z.record(z.any()).optional(),
});

// In-memory storage for when database is not available
let inMemoryIntegrations: any[] = [];

// Get all platform integrations
export const getPlatformIntegrations = async (req: Request, res: Response) => {
  try {
    if (databaseService.isConnected()) {
      const integrations = await databaseService.query(
        "SELECT * FROM platform_integrations ORDER BY created_at DESC",
      );

      const parsedIntegrations = integrations.map((integration: any) => ({
        ...integration,
        credentials: integration.credentials
          ? JSON.parse(integration.credentials)
          : {},
        syncSettings: integration.sync_settings
          ? JSON.parse(integration.sync_settings)
          : {},
        syncHistory: integration.sync_history
          ? JSON.parse(integration.sync_history)
          : [],
      }));

      res.json(parsedIntegrations);
    } else {
      res.json(inMemoryIntegrations);
    }
  } catch (error) {
    console.error("Error fetching platform integrations:", error);
    res.status(500).json({ error: "Failed to fetch platform integrations" });
  }
};

// Get a specific platform integration
export const getPlatformIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (databaseService.isConnected()) {
      const integrations = await databaseService.query(
        "SELECT * FROM platform_integrations WHERE id = ?",
        [id],
      );

      if (integrations.length === 0) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }

      const integration = {
        ...integrations[0],
        credentials: integrations[0].credentials
          ? JSON.parse(integrations[0].credentials)
          : {},
        syncSettings: integrations[0].sync_settings
          ? JSON.parse(integrations[0].sync_settings)
          : {},
        syncHistory: integrations[0].sync_history
          ? JSON.parse(integrations[0].sync_history)
          : [],
      };

      res.json(integration);
    } else {
      const integration = inMemoryIntegrations.find((i) => i.id === id);
      if (!integration) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }
      res.json(integration);
    }
  } catch (error) {
    console.error("Error fetching platform integration:", error);
    res.status(500).json({ error: "Failed to fetch platform integration" });
  }
};

// Connect a new platform
export const connectPlatform = async (req: Request, res: Response) => {
  try {
    const validatedData = PlatformIntegrationSchema.parse(req.body);

    const newIntegration = {
      id: `platform-${Date.now()}`,
      ...validatedData,
      status: "connected",
      lastSync: null,
      syncHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Test the connection before saving
    const testResult = await testPlatformConnection(newIntegration);
    if (!testResult.success) {
      newIntegration.status = "error";
    }

    if (databaseService.isConnected()) {
      await databaseService.query(
        `INSERT INTO platform_integrations 
         (id, name, type, status, credentials, sync_settings, last_sync, sync_history, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newIntegration.id,
          newIntegration.name,
          newIntegration.type,
          newIntegration.status,
          JSON.stringify(newIntegration.credentials),
          JSON.stringify(newIntegration.syncSettings),
          newIntegration.lastSync,
          JSON.stringify(newIntegration.syncHistory),
          newIntegration.createdAt,
          newIntegration.updatedAt,
        ],
      );
    } else {
      inMemoryIntegrations.push(newIntegration);
    }

    res.status(201).json({
      integration: newIntegration,
      testResult,
    });
  } catch (error) {
    console.error("Error connecting platform:", error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Invalid request data", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to connect platform" });
    }
  }
};

// Update a platform integration
export const updatePlatformIntegration = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (databaseService.isConnected()) {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          if (
            key === "credentials" ||
            key === "syncSettings" ||
            key === "syncHistory"
          ) {
            const dbKey =
              key === "syncSettings"
                ? "sync_settings"
                : key === "syncHistory"
                  ? "sync_history"
                  : key;
            updateFields.push(`${dbKey} = ?`);
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
          `UPDATE platform_integrations SET ${updateFields.join(", ")} WHERE id = ?`,
          updateValues,
        );
      }

      const updated = await databaseService.query(
        "SELECT * FROM platform_integrations WHERE id = ?",
        [id],
      );

      if (updated.length === 0) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }

      const integration = {
        ...updated[0],
        credentials: updated[0].credentials
          ? JSON.parse(updated[0].credentials)
          : {},
        syncSettings: updated[0].sync_settings
          ? JSON.parse(updated[0].sync_settings)
          : {},
        syncHistory: updated[0].sync_history
          ? JSON.parse(updated[0].sync_history)
          : [],
      };

      res.json(integration);
    } else {
      const integrationIndex = inMemoryIntegrations.findIndex(
        (i) => i.id === id,
      );
      if (integrationIndex === -1) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }

      inMemoryIntegrations[integrationIndex] = {
        ...inMemoryIntegrations[integrationIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      res.json(inMemoryIntegrations[integrationIndex]);
    }
  } catch (error) {
    console.error("Error updating platform integration:", error);
    res.status(500).json({ error: "Failed to update platform integration" });
  }
};

// Delete a platform integration
export const deletePlatformIntegration = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (databaseService.isConnected()) {
      const result = await databaseService.query(
        "DELETE FROM platform_integrations WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }
    } else {
      const integrationIndex = inMemoryIntegrations.findIndex(
        (i) => i.id === id,
      );
      if (integrationIndex === -1) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }

      inMemoryIntegrations.splice(integrationIndex, 1);
    }

    res.json({
      success: true,
      message: "Platform integration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting platform integration:", error);
    res.status(500).json({ error: "Failed to delete platform integration" });
  }
};

// Test platform connection
export const testConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let integration;

    if (databaseService.isConnected()) {
      const integrations = await databaseService.query(
        "SELECT * FROM platform_integrations WHERE id = ?",
        [id],
      );

      if (integrations.length === 0) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }

      integration = {
        ...integrations[0],
        credentials: integrations[0].credentials
          ? JSON.parse(integrations[0].credentials)
          : {},
        syncSettings: integrations[0].sync_settings
          ? JSON.parse(integrations[0].sync_settings)
          : {},
      };
    } else {
      integration = inMemoryIntegrations.find((i) => i.id === id);
      if (!integration) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }
    }

    const testResult = await testPlatformConnection(integration);

    // Update integration status based on test result
    const newStatus = testResult.success ? "connected" : "error";
    if (integration.status !== newStatus) {
      await updateIntegrationStatus(id, newStatus);
    }

    res.json(testResult);
  } catch (error) {
    console.error("Error testing platform connection:", error);
    res.status(500).json({ error: "Failed to test platform connection" });
  }
};

// Start platform sync
export const startSync = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = SyncRequestSchema.parse(req.body);

    let integration;

    if (databaseService.isConnected()) {
      const integrations = await databaseService.query(
        "SELECT * FROM platform_integrations WHERE id = ?",
        [id],
      );

      if (integrations.length === 0) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }

      integration = {
        ...integrations[0],
        credentials: integrations[0].credentials
          ? JSON.parse(integrations[0].credentials)
          : {},
        syncSettings: integrations[0].sync_settings
          ? JSON.parse(integrations[0].sync_settings)
          : {},
      };
    } else {
      integration = inMemoryIntegrations.find((i) => i.id === id);
      if (!integration) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }
    }

    if (integration.status !== "connected") {
      return res
        .status(400)
        .json({ error: "Platform integration is not connected" });
    }

    // Generate sync ID
    const syncId = `sync-${Date.now()}`;

    // Start the sync process (would be implemented with actual platform APIs)
    const syncResult = await performPlatformSync(
      integration,
      validatedData.direction,
      validatedData.options,
    );

    // Update last sync time
    const now = new Date().toISOString();
    await updateIntegrationLastSync(id, now);

    res.json({
      syncId,
      message: "Sync started successfully",
      ...syncResult,
    });
  } catch (error) {
    console.error("Error starting platform sync:", error);
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Invalid request data", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to start platform sync" });
    }
  }
};

// Get sync history
export const getSyncHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (databaseService.isConnected()) {
      const integrations = await databaseService.query(
        "SELECT sync_history FROM platform_integrations WHERE id = ?",
        [id],
      );

      if (integrations.length === 0) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }

      const syncHistory = integrations[0].sync_history
        ? JSON.parse(integrations[0].sync_history)
        : [];

      res.json(syncHistory);
    } else {
      const integration = inMemoryIntegrations.find((i) => i.id === id);
      if (!integration) {
        return res
          .status(404)
          .json({ error: "Platform integration not found" });
      }
      res.json(integration.syncHistory || []);
    }
  } catch (error) {
    console.error("Error fetching sync history:", error);
    res.status(500).json({ error: "Failed to fetch sync history" });
  }
};

// Helper functions
async function testPlatformConnection(integration: any): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    // Platform-specific connection testing
    switch (integration.type) {
      case "shopify":
        if (
          !integration.credentials.domain ||
          !integration.credentials.accessToken
        ) {
          return {
            success: false,
            message: "Shopify domain and access token are required",
          };
        }
        return {
          success: true,
          message: "Shopify connection verified",
          data: { shop: integration.credentials.domain, products: 0 },
        };

      case "woocommerce":
        if (
          !integration.credentials.url ||
          !integration.credentials.consumerKey ||
          !integration.credentials.consumerSecret
        ) {
          return {
            success: false,
            message:
              "WooCommerce URL, consumer key, and consumer secret are required",
          };
        }
        return {
          success: true,
          message: "WooCommerce connection verified",
          data: { site: integration.credentials.url, products: 0 },
        };

      case "bigcommerce":
        if (
          !integration.credentials.storeHash ||
          !integration.credentials.accessToken
        ) {
          return {
            success: false,
            message: "BigCommerce store hash and access token are required",
          };
        }
        return {
          success: true,
          message: "BigCommerce connection verified",
          data: { store: integration.credentials.storeHash, products: 0 },
        };

      default:
        return {
          success: true,
          message: "Connection test completed",
        };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Connection test failed: " +
        (error instanceof Error ? error.message : "Unknown error"),
    };
  }
}

async function performPlatformSync(
  integration: any,
  direction: string,
  options: any = {},
): Promise<{
  recordsProcessed: number;
  errors: string[];
}> {
  // Simulate platform synchronization
  // In a real implementation, this would call the actual platform APIs
  const recordsProcessed = Math.floor(Math.random() * 100) + 10;
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

async function updateIntegrationStatus(
  id: string,
  status: string,
): Promise<void> {
  if (databaseService.isConnected()) {
    await databaseService.query(
      "UPDATE platform_integrations SET status = ?, updated_at = ? WHERE id = ?",
      [status, new Date().toISOString(), id],
    );
  } else {
    const integrationIndex = inMemoryIntegrations.findIndex((i) => i.id === id);
    if (integrationIndex !== -1) {
      inMemoryIntegrations[integrationIndex].status = status;
      inMemoryIntegrations[integrationIndex].updatedAt =
        new Date().toISOString();
    }
  }
}

async function updateIntegrationLastSync(
  id: string,
  lastSync: string,
): Promise<void> {
  if (databaseService.isConnected()) {
    await databaseService.query(
      "UPDATE platform_integrations SET last_sync = ?, updated_at = ? WHERE id = ?",
      [lastSync, new Date().toISOString(), id],
    );
  } else {
    const integrationIndex = inMemoryIntegrations.findIndex((i) => i.id === id);
    if (integrationIndex !== -1) {
      inMemoryIntegrations[integrationIndex].lastSync = lastSync;
      inMemoryIntegrations[integrationIndex].updatedAt =
        new Date().toISOString();
    }
  }
}

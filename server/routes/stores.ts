import { Request, Response } from "express";
import { z } from "zod";
import { databaseService } from "../services/database";

// In-memory store for when database is not available
const connectedStores = new Map<string, any>();

// Helper functions for store management
async function saveConnectedStore(storeData: any): Promise<void> {
  if (databaseService.isConnected()) {
    try {
      await databaseService.query(
        `INSERT INTO stores (
          id, name, domain, plan, status, seo_score, monthly_revenue,
          monthly_traffic, access_token, settings
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          plan = VALUES(plan),
          status = VALUES(status),
          seo_score = VALUES(seo_score),
          monthly_revenue = VALUES(monthly_revenue),
          monthly_traffic = VALUES(monthly_traffic),
          access_token = VALUES(access_token),
          settings = VALUES(settings),
          updated_at = CURRENT_TIMESTAMP`,
        [
          storeData.id,
          storeData.name,
          storeData.domain,
          storeData.plan,
          storeData.status,
          storeData.seoScore,
          storeData.monthlyRevenue,
          storeData.monthlyTraffic,
          storeData.accessToken,
          JSON.stringify({
            currency: storeData.currency,
            timezone: storeData.timezone,
            country: storeData.country,
            productsCount: storeData.productsCount,
            ordersCount: storeData.ordersCount,
            conversionRate: storeData.conversionRate,
            avgOrderValue: storeData.avgOrderValue,
            topKeywords: storeData.topKeywords,
            connectedAt: storeData.connectedAt,
          }),
        ]
      );
    } catch (error) {
      console.error("Database store save failed, using memory fallback:", error);
      connectedStores.set(storeData.id, storeData);
    }
  } else {
    // Use in-memory storage when database is not available
    connectedStores.set(storeData.id, storeData);
  }
}

async function getAllConnectedStores(): Promise<any[]> {
  if (databaseService.isConnected()) {
    try {
      const stores = await databaseService.query(`
        SELECT
          id, name, domain, plan, status, seo_score as seoScore,
          monthly_revenue as monthlyRevenue, monthly_traffic as monthlyTraffic,
          settings, created_at as connectedAt, updated_at as lastSync
        FROM stores
        ORDER BY created_at DESC
      `);

      return stores.map((store: any) => {
        const settings = store.settings ? JSON.parse(store.settings) : {};
        return {
          ...store,
          isConnected: true,
          country: settings.country || "Unknown",
          currency: settings.currency || "USD",
          timezone: settings.timezone || "UTC",
          productsCount: settings.productsCount || 0,
          ordersCount: settings.ordersCount || 0,
          conversionRate: settings.conversionRate || 0,
          avgOrderValue: settings.avgOrderValue || 0,
          topKeywords: settings.topKeywords || [],
          lastSync: store.lastSync ? new Date(store.lastSync).toISOString().slice(0, 19).replace("T", " ") : "Never",
          connectedAt: store.connectedAt ? new Date(store.connectedAt).toISOString().slice(0, 10) : "Unknown",
        };
      });
    } catch (error) {
      console.error("Database fetch failed, using memory fallback:", error);
      return Array.from(connectedStores.values());
    }
  } else {
    // Use in-memory storage when database is not available
    return Array.from(connectedStores.values());
  }
}

async function removeConnectedStore(storeId: string): Promise<void> {
  if (databaseService.isConnected()) {
    try {
      await databaseService.query("DELETE FROM stores WHERE id = ?", [storeId]);
    } catch (error) {
      console.error("Database store removal failed, using memory fallback:", error);
      connectedStores.delete(storeId);
    }
  } else {
    // Use in-memory storage when database is not available
    connectedStores.delete(storeId);
  }
}

// Schema for store connection request
const ConnectStoreSchema = z.object({
  storeUrl: z.string().min(1, "Store URL is required"),
  accessToken: z.string().min(1, "Access token is required"),
});

// Connect a new Shopify store
export const connectStore = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = ConnectStoreSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: validation.error.errors,
      });
    }

    const { storeUrl, accessToken } = validation.data;

    // Clean up the store URL
    let cleanUrl = storeUrl.trim().toLowerCase();
    if (!cleanUrl.includes(".myshopify.com")) {
      if (!cleanUrl.endsWith(".myshopify.com")) {
        cleanUrl = `${cleanUrl}.myshopify.com`;
      }
    }

    // Remove protocol if present
    cleanUrl = cleanUrl.replace(/^https?:\/\//, "");

    // Mock validation of the store connection
    // In a real implementation, you would:
    // 1. Validate the access token by making a test API call to Shopify
    // 2. Fetch store information
    // 3. Save the store to the database

    console.log(`Attempting to connect to Shopify store: ${cleanUrl}`);
    console.log(`Using access token: ${accessToken.substring(0, 10)}...`);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock store data that would be fetched from Shopify API
    const mockStoreData = {
      id: `store-${Date.now()}`,
      name:
        cleanUrl.split(".")[0].charAt(0).toUpperCase() +
        cleanUrl.split(".")[0].slice(1),
      domain: cleanUrl,
      plan: "basic",
      status: "active",
      country: "Unknown",
      currency: "USD",
      timezone: "UTC",
      lastSync: new Date().toISOString().slice(0, 19).replace("T", " "),
      seoScore: Math.floor(Math.random() * 40) + 40, // Random score 40-80
      monthlyRevenue: Math.floor(Math.random() * 50000) + 10000,
      monthlyTraffic: Math.floor(Math.random() * 20000) + 5000,
      productsCount: Math.floor(Math.random() * 500) + 50,
      ordersCount: Math.floor(Math.random() * 300) + 50,
      conversionRate: +(Math.random() * 3 + 1).toFixed(1),
      avgOrderValue: +(Math.random() * 100 + 50).toFixed(2),
      topKeywords: ["product keyword", "brand name", "category term"],
      connectedAt: new Date().toISOString().slice(0, 10),
      isConnected: true,
      accessToken: accessToken, // In production, encrypt this
    };

    // Save store to storage (database or in-memory for now)
    try {
      await saveConnectedStore(mockStoreData);
      console.log("Store connected and saved successfully:", mockStoreData);
    } catch (error) {
      console.error("Failed to save store:", error);
      // Continue with response even if save fails
    }

    res.status(200).json({
      success: true,
      message: "Store connected successfully",
      store: mockStoreData,
    });
  } catch (error) {
    console.error("Error connecting store:", error);
    res.status(500).json({
      error: "Failed to connect store",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all connected stores
export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await getAllConnectedStores();
    res.json({ stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      error: "Failed to fetch stores",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Disconnect a store
export const disconnectStore = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json({
        error: "Store ID is required",
      });
    }

    // Remove store from storage
    try {
      await removeConnectedStore(storeId);
      console.log(`Store disconnected and removed: ${storeId}`);
    } catch (error) {
      console.error("Failed to remove store:", error);
      return res.status(500).json({
        error: "Failed to disconnect store",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }

    res.json({
      success: true,
      message: "Store disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting store:", error);
    res.status(500).json({
      error: "Failed to disconnect store",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

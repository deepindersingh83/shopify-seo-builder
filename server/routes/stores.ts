import { Request, Response } from "express";
import { z } from "zod";
import { databaseService } from "../services/database";

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

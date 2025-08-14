import { Request, Response } from "express";
import { z } from "zod";
import { databaseService } from "../services/database";
import { productRepository } from "../repositories/productRepository";
import { storeProductsService } from "../services/storeProductsService";

// In-memory storage for when database is not available
const connectedStores = new Map<string, any>();

// Simulate Shopify store connection and product import
async function simulateShopifyStoreConnection(domain: string, accessToken: string) {
  console.log(`🔗 Simulating Shopify connection for: ${domain}`);

  // Generate store data based on the actual domain
  const storeName = domain.split(".")[0]
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const storeData = {
    id: `store-${Date.now()}`,
    name: storeName,
    domain: domain,
    plan: "basic",
    status: "active",
    country: "Unknown",
    currency: "USD",
    timezone: "UTC",
    lastSync: new Date().toISOString().slice(0, 19).replace("T", " "),
    seoScore: Math.floor(Math.random() * 40) + 40,
    monthlyRevenue: Math.floor(Math.random() * 50000) + 10000,
    monthlyTraffic: Math.floor(Math.random() * 20000) + 5000,
    productsCount: 0, // Will be updated after importing products
    ordersCount: Math.floor(Math.random() * 300) + 50,
    conversionRate: +(Math.random() * 3 + 1).toFixed(1),
    avgOrderValue: +(Math.random() * 100 + 50).toFixed(2),
    topKeywords: ["product keyword", "brand name", "category term"],
    connectedAt: new Date().toISOString().slice(0, 10),
    isConnected: true,
    accessToken: accessToken,
  };

  // Import sample products for the connected store
  const importedProducts = await importSampleProducts(storeData.id, domain);
  storeData.productsCount = importedProducts.length;

  console.log(`✅ Store ${storeName} connected with ${importedProducts.length} products imported`);

  return storeData;
}

// Import sample products for a connected store
async function importSampleProducts(storeId: string, domain: string) {
  const storeName = domain.split(".")[0].replace("-", " ");

  // Generate realistic products based on store name
  const productTemplates = [
    {
      title: `${storeName} Premium Collection Item`,
      category: "Featured",
      description: "Premium quality product from our signature collection with exceptional craftsmanship.",
      price: 89.99,
      seoScore: 85
    },
    {
      title: `${storeName} Essential Daily Use`,
      category: "Essentials",
      description: "Perfect for everyday use with reliable performance and modern design.",
      price: 34.99,
      seoScore: 72
    },
    {
      title: `${storeName} Professional Grade`,
      category: "Professional",
      description: "Professional-grade solution designed for demanding applications.",
      price: 156.99,
      seoScore: 91
    },
    {
      title: `${storeName} Eco-Friendly Option`,
      category: "Sustainable",
      description: "Environmentally conscious choice without compromising on quality.",
      price: 67.99,
      seoScore: 78
    },
    {
      title: `${storeName} Limited Edition`,
      category: "Limited",
      description: "Exclusive limited edition item with unique features and premium materials.",
      price: 199.99,
      seoScore: 88
    }
  ];

  const importedProducts = [];

  for (let i = 0; i < productTemplates.length; i++) {
    const template = productTemplates[i];
    const productId = `${storeId}-product-${i + 1}`;

    const product = {
      id: productId,
      shopify_id: 10000 + i,
      title: template.title,
      handle: template.title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"),
      description: template.description,
      status: "active" as const,
      vendor: storeName,
      product_type: template.category,
      tags: [storeName.toLowerCase(), template.category.toLowerCase(), "imported"],
      price: template.price,
      inventory: Math.floor(Math.random() * 100) + 10,
      image_url: `https://picsum.photos/400/400?random=${productId}`,
      meta_title: `${template.title} | ${storeName}`,
      meta_description: template.description.substring(0, 150),
      seo_score: template.seoScore,
    };

    try {
      // Try to save product to database, but continue even if it fails
      if (databaseService.isConnected()) {
        await productRepository.create(product);
        console.log(`📦 Imported product to database: ${product.title}`);
      } else {
        // Store products in memory when database is not available
        console.log(`📦 Imported product to memory: ${product.title}`);
      }
      importedProducts.push(product);
    } catch (error) {
      console.error(`⚠️ Database save failed for ${product.title}, keeping in memory:`, error.message);
      // Still add to imported products even if database save fails
      importedProducts.push(product);
    }
  }

  // Store all imported products using shared service
  storeProductsService.setStoreProducts(storeId, importedProducts);

  return importedProducts;
}

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
        ],
      );
    } catch (error) {
      console.error(
        "Database store save failed, using memory fallback:",
        error,
      );
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
          lastSync: store.lastSync
            ? new Date(store.lastSync)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : "Never",
          connectedAt: store.connectedAt
            ? new Date(store.connectedAt).toISOString().slice(0, 10)
            : "Unknown",
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
      console.error(
        "Database store removal failed, using memory fallback:",
        error,
      );
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

    // In a real implementation, you would:
    // 1. Validate access token with Shopify API
    // 2. Fetch store information from Shopify
    // 3. Import products from Shopify

    // For now, simulate getting store data and importing products
    const storeData = await simulateShopifyStoreConnection(cleanUrl, accessToken);

    // Save store to storage (database or in-memory for now)
    try {
      await saveConnectedStore(storeData);
      console.log("Store connected and saved successfully:", storeData);
    } catch (error) {
      console.error("Failed to save store:", error);
      // Continue with response even if save fails
    }

    res.status(200).json({
      success: true,
      message: "Store connected successfully",
      store: storeData,
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

// Get products from all connected stores
export const getStoreProducts = async (req: Request, res: Response) => {
  try {
    let allProducts: any[] = [];

    if (databaseService.isConnected()) {
      // Get products from database if available
      const result = await productRepository.findAll({}, { offset: 0, limit: 1000, sortBy: "created_at", sortOrder: "desc" });
      allProducts = result.products;
      console.log(`📊 Retrieved ${allProducts.length} products from database`);
    } else {
      // Get products from memory storage using shared service
      allProducts = storeProductsService.getAllStoreProducts();
      console.log(`📊 Retrieved ${allProducts.length} products from memory storage`);
    }

    res.json({
      products: allProducts,
      total: allProducts.length,
      source: databaseService.isConnected() ? "database" : "memory"
    });
  } catch (error) {
    console.error("Error fetching store products:", error);
    res.status(500).json({
      error: "Failed to fetch products",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get products for a specific store
export const getProductsForStore = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    let products: any[] = [];

    if (databaseService.isConnected()) {
      // Filter products by store in database - we'd need to add store_id to products table
      // For now, get all products (this would need to be improved in a real app)
      const result = await productRepository.findAll({}, { offset: 0, limit: 1000, sortBy: "created_at", sortOrder: "desc" });
      products = result.products;
    } else {
      // Get products from memory storage for this specific store
      products = storeProductsService.getStoreProducts(storeId);
    }

    res.json({
      products,
      total: products.length,
      storeId,
      source: databaseService.isConnected() ? "database" : "memory"
    });
  } catch (error) {
    console.error("Error fetching products for store:", error);
    res.status(500).json({
      error: "Failed to fetch products for store",
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

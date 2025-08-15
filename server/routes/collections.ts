import { Request, Response } from "express";
import { databaseService } from "../services/database";
import { z } from "zod";

// Validation schemas
const CollectionSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(["collection", "category", "cms_page", "brand_page"]),
  slug: z.string().min(1).max(255),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  content: z.string().optional(),
  isPublished: z.boolean().default(true),
  templateSuffix: z.string().optional(),
  platform: z.string().optional(),
  platformId: z.string().optional(),
});

const SEOUpdateSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  content: z.string().optional(),
});

// In-memory storage for when database is not available
let inMemoryCollections: any[] = [];
let inMemoryRecommendations: any[] = [
  {
    id: "1",
    type: "title",
    priority: "high",
    description: "Add target keywords to meta title",
    impact: "Can improve rankings by 15-25%",
  },
  {
    id: "2",
    type: "description",
    priority: "medium",
    description: "Optimize meta description length (120-160 chars)",
    impact: "Better CTR from search results",
  },
  {
    id: "3",
    type: "keywords",
    priority: "high",
    description: "Add long-tail keyword variations",
    impact: "Capture more specific search queries",
  },
  {
    id: "4",
    type: "breadcrumbs",
    priority: "low",
    description: "Implement breadcrumb schema markup",
    impact: "Enhanced search result display",
  },
];

// Calculate SEO score
function calculateSEOScore(collection: any): number {
  let score = 0;

  // Meta title (25 points)
  if (collection.meta_title) {
    if (collection.meta_title.length >= 30 && collection.meta_title.length <= 60) {
      score += 25;
    } else if (collection.meta_title.length > 0) {
      score += 15;
    }
  }

  // Meta description (25 points)
  if (collection.meta_description) {
    if (collection.meta_description.length >= 120 && collection.meta_description.length <= 160) {
      score += 25;
    } else if (collection.meta_description.length > 0) {
      score += 15;
    }
  }

  // Keywords (20 points)
  const keywords = collection.keywords ? JSON.parse(collection.keywords) : [];
  if (keywords.length >= 3 && keywords.length <= 10) {
    score += 20;
  } else if (keywords.length > 0) {
    score += 10;
  }

  // Content (15 points)
  if (collection.content) {
    if (collection.content.length >= 300) {
      score += 15;
    } else if (collection.content.length >= 100) {
      score += 10;
    } else if (collection.content.length > 0) {
      score += 5;
    }
  }

  // Slug optimization (10 points)
  if (collection.slug) {
    if (collection.slug.includes('-') && collection.slug.length <= 50) {
      score += 10;
    } else if (collection.slug.length > 0) {
      score += 5;
    }
  }

  // Publishing status (5 points)
  if (collection.is_published) {
    score += 5;
  }

  return Math.min(score, 100);
}

// Determine status based on score
function getCollectionStatus(score: number): string {
  if (score >= 80) return "optimized";
  if (score >= 50) return "needs_work";
  return "critical";
}

// Get collections SEO data
export const getCollectionsSEOData = async (req: Request, res: Response) => {
  try {
    let collections = [];

    if (databaseService.isConnected()) {
      // Fetch from database
      collections = await databaseService.query(`
        SELECT * FROM collections ORDER BY updated_at DESC
      `);
    } else {
      // Use in-memory storage
      collections = inMemoryCollections;
    }

    // Transform data and calculate SEO scores
    const transformedCollections = collections.map((collection: any) => {
      const score = calculateSEOScore(collection);
      const status = getCollectionStatus(score);

      return {
        id: collection.id,
        name: collection.name,
        type: collection.type,
        slug: collection.slug,
        products: collection.product_count || 0,
        seoScore: score,
        metaTitle: collection.meta_title,
        metaDescription: collection.meta_description,
        keywords: collection.keywords ? JSON.parse(collection.keywords) : [],
        lastOptimized: collection.updated_at || collection.last_optimized,
        status,
        platform: collection.platform,
        platformId: collection.platform_id,
        content: collection.content,
        isPublished: collection.is_published,
        templateSuffix: collection.template_suffix,
      };
    });

    // Calculate stats
    const totalCollections = transformedCollections.length;
    const optimizedCount = transformedCollections.filter(c => c.status === "optimized").length;
    const needsWorkCount = transformedCollections.filter(c => c.status === "needs_work").length;
    const criticalCount = transformedCollections.filter(c => c.status === "critical").length;
    const averageScore = totalCollections > 0 
      ? Math.round(transformedCollections.reduce((sum, c) => sum + c.seoScore, 0) / totalCollections)
      : 0;

    res.json({
      collections: transformedCollections,
      recommendations: inMemoryRecommendations,
      stats: {
        totalCollections,
        optimizedCount,
        needsWorkCount,
        criticalCount,
        averageScore,
      },
    });
  } catch (error) {
    console.error("Error fetching collections SEO data:", error);
    res.status(500).json({ error: "Failed to fetch collections data" });
  }
};

// Sync collections from connected platforms
export const syncCollectionsFromPlatforms = async (req: Request, res: Response) => {
  try {
    let synced = 0;
    const errors: string[] = [];

    // Get connected platform integrations
    let platformIntegrations = [];
    
    if (databaseService.isConnected()) {
      platformIntegrations = await databaseService.query(`
        SELECT * FROM platform_integrations WHERE enabled = true
      `);
    }

    // Sync from each connected platform
    for (const integration of platformIntegrations) {
      try {
        if (integration.type === "shopify") {
          await syncShopifyCollections(integration);
          synced++;
        } else if (integration.type === "woocommerce") {
          await syncWooCommerceCategories(integration);
          synced++;
        }
      } catch (error) {
        console.error(`Error syncing from ${integration.name}:`, error);
        errors.push(`Failed to sync from ${integration.name}: ${error}`);
      }
    }

    res.json({
      success: errors.length === 0,
      synced,
      errors,
    });
  } catch (error) {
    console.error("Error syncing collections:", error);
    res.status(500).json({ error: "Failed to sync collections from platforms" });
  }
};

// Sync Shopify collections and pages
async function syncShopifyCollections(integration: any) {
  const { domain, accessToken } = JSON.parse(integration.credentials);

  // Fetch collections
  const collectionsResponse = await fetch(`https://${domain}.myshopify.com/admin/api/2023-10/collections.json`, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (collectionsResponse.ok) {
    const collectionsData = await collectionsResponse.json();
    
    for (const collection of collectionsData.collections) {
      await saveCollection({
        id: `shopify_collection_${collection.id}`,
        name: collection.title,
        type: "collection",
        slug: collection.handle,
        metaTitle: collection.seo?.title,
        metaDescription: collection.seo?.description,
        keywords: [],
        content: collection.body_html,
        isPublished: !!collection.published_at,
        templateSuffix: collection.template_suffix,
        platform: "shopify",
        platformId: collection.id.toString(),
        productCount: collection.products_count || 0,
      });
    }
  }

  // Fetch pages (CMS pages)
  const pagesResponse = await fetch(`https://${domain}.myshopify.com/admin/api/2023-10/pages.json`, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (pagesResponse.ok) {
    const pagesData = await pagesResponse.json();
    
    for (const page of pagesData.pages) {
      await saveCollection({
        id: `shopify_page_${page.id}`,
        name: page.title,
        type: "cms_page",
        slug: page.handle,
        metaTitle: page.seo?.title,
        metaDescription: page.seo?.description,
        keywords: [],
        content: page.body_html,
        isPublished: !!page.published_at,
        templateSuffix: page.template_suffix,
        platform: "shopify",
        platformId: page.id.toString(),
        productCount: 0,
      });
    }
  }
}

// Sync WooCommerce categories
async function syncWooCommerceCategories(integration: any) {
  const { url, consumerKey, consumerSecret } = JSON.parse(integration.credentials);
  
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  const response = await fetch(`${url}/wp-json/wc/v3/products/categories?per_page=100`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const categories = await response.json();
    
    for (const category of categories) {
      await saveCollection({
        id: `woocommerce_category_${category.id}`,
        name: category.name,
        type: "category",
        slug: category.slug,
        metaTitle: category.name,
        metaDescription: category.description,
        keywords: [],
        content: category.description,
        isPublished: true,
        platform: "woocommerce",
        platformId: category.id.toString(),
        productCount: category.count || 0,
      });
    }
  }
}

// Save collection to database or memory
async function saveCollection(collectionData: any) {
  if (databaseService.isConnected()) {
    const existing = await databaseService.query(
      `SELECT id FROM collections WHERE id = ?`,
      [collectionData.id]
    );

    if (existing.length > 0) {
      // Update existing
      await databaseService.query(`
        UPDATE collections SET
          name = ?, type = ?, slug = ?, meta_title = ?, meta_description = ?,
          keywords = ?, content = ?, is_published = ?, template_suffix = ?,
          platform = ?, platform_id = ?, product_count = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        collectionData.name,
        collectionData.type,
        collectionData.slug,
        collectionData.metaTitle,
        collectionData.metaDescription,
        JSON.stringify(collectionData.keywords),
        collectionData.content,
        collectionData.isPublished,
        collectionData.templateSuffix,
        collectionData.platform,
        collectionData.platformId,
        collectionData.productCount,
        collectionData.id,
      ]);
    } else {
      // Create new
      await databaseService.query(`
        INSERT INTO collections (
          id, name, type, slug, meta_title, meta_description, keywords,
          content, is_published, template_suffix, platform, platform_id,
          product_count, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        collectionData.id,
        collectionData.name,
        collectionData.type,
        collectionData.slug,
        collectionData.metaTitle,
        collectionData.metaDescription,
        JSON.stringify(collectionData.keywords),
        collectionData.content,
        collectionData.isPublished,
        collectionData.templateSuffix,
        collectionData.platform,
        collectionData.platformId,
        collectionData.productCount,
      ]);
    }
  } else {
    // Save to memory
    const existing = inMemoryCollections.findIndex(c => c.id === collectionData.id);
    if (existing >= 0) {
      inMemoryCollections[existing] = { ...collectionData, updated_at: new Date().toISOString() };
    } else {
      inMemoryCollections.push({ ...collectionData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
  }
}

// Get single collection
export const getCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let collection = null;

    if (databaseService.isConnected()) {
      const results = await databaseService.query(
        `SELECT * FROM collections WHERE id = ?`,
        [id]
      );
      collection = results[0];
    } else {
      collection = inMemoryCollections.find(c => c.id === id);
    }

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const score = calculateSEOScore(collection);
    const status = getCollectionStatus(score);

    res.json({
      id: collection.id,
      name: collection.name,
      type: collection.type,
      slug: collection.slug,
      products: collection.product_count || 0,
      seoScore: score,
      metaTitle: collection.meta_title,
      metaDescription: collection.meta_description,
      keywords: collection.keywords ? JSON.parse(collection.keywords) : [],
      lastOptimized: collection.updated_at || collection.last_optimized,
      status,
      platform: collection.platform,
      platformId: collection.platform_id,
      content: collection.content,
      isPublished: collection.is_published,
      templateSuffix: collection.template_suffix,
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
};

// Update collection SEO
export const updateCollectionSEO = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const seoData = SEOUpdateSchema.parse(req.body);

    if (databaseService.isConnected()) {
      await databaseService.query(`
        UPDATE collections SET
          meta_title = ?, meta_description = ?, keywords = ?, content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        seoData.metaTitle,
        seoData.metaDescription,
        JSON.stringify(seoData.keywords || []),
        seoData.content,
        id,
      ]);
    } else {
      const existing = inMemoryCollections.findIndex(c => c.id === id);
      if (existing >= 0) {
        inMemoryCollections[existing] = {
          ...inMemoryCollections[existing],
          meta_title: seoData.metaTitle,
          meta_description: seoData.metaDescription,
          keywords: JSON.stringify(seoData.keywords || []),
          content: seoData.content,
          updated_at: new Date().toISOString(),
        };
      }
    }

    // Return updated collection
    const updatedCollection = await getCollection(req, res);
  } catch (error) {
    console.error("Error updating collection SEO:", error);
    res.status(500).json({ error: "Failed to update collection SEO" });
  }
};

// Generate AI recommendations
export const generateSEORecommendations = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get collection data
    let collection = null;
    if (databaseService.isConnected()) {
      const results = await databaseService.query(
        `SELECT * FROM collections WHERE id = ?`,
        [id]
      );
      collection = results[0];
    } else {
      collection = inMemoryCollections.find(c => c.id === id);
    }

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Generate personalized recommendations based on collection data
    const recommendations = [];

    if (!collection.meta_title || collection.meta_title.length < 30) {
      recommendations.push({
        id: `${id}_title`,
        type: "title",
        priority: "high",
        description: "Add a compelling meta title with target keywords",
        impact: "Can improve search rankings by 15-25%",
      });
    }

    if (!collection.meta_description || collection.meta_description.length < 120) {
      recommendations.push({
        id: `${id}_description`,
        type: "description",
        priority: "high",
        description: "Write an engaging meta description (120-160 characters)",
        impact: "Improves click-through rate from search results",
      });
    }

    const keywords = collection.keywords ? JSON.parse(collection.keywords) : [];
    if (keywords.length < 3) {
      recommendations.push({
        id: `${id}_keywords`,
        type: "keywords",
        priority: "medium",
        description: "Add more relevant keywords and long-tail variations",
        impact: "Helps capture more specific search queries",
      });
    }

    if (!collection.content || collection.content.length < 300) {
      recommendations.push({
        id: `${id}_content`,
        type: "content",
        priority: "medium",
        description: "Add more descriptive content (at least 300 characters)",
        impact: "Provides more context for search engines",
      });
    }

    res.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

// Apply AI optimization
export const applySEOOptimization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    let collection = null;
    if (databaseService.isConnected()) {
      const results = await databaseService.query(
        `SELECT * FROM collections WHERE id = ?`,
        [id]
      );
      collection = results[0];
    } else {
      collection = inMemoryCollections.find(c => c.id === id);
    }

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Generate AI-optimized content based on type
    const optimizations: any = {};

    if (type === "title" || type === "all") {
      optimizations.metaTitle = `${collection.name} - Premium Collection | Best Deals & Quality Products`;
    }

    if (type === "description" || type === "all") {
      optimizations.metaDescription = `Discover our ${collection.name.toLowerCase()} collection featuring high-quality products. Shop now for the best deals and premium selection.`;
    }

    if (type === "keywords" || type === "all") {
      const baseKeywords = [collection.name.toLowerCase(), "premium", "quality", "best deals"];
      optimizations.keywords = baseKeywords.concat([
        `${collection.name.toLowerCase()} collection`,
        `buy ${collection.name.toLowerCase()}`,
        `${collection.name.toLowerCase()} online`,
      ]);
    }

    // Update the collection
    if (databaseService.isConnected()) {
      await databaseService.query(`
        UPDATE collections SET
          meta_title = COALESCE(?, meta_title),
          meta_description = COALESCE(?, meta_description),
          keywords = COALESCE(?, keywords),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        optimizations.metaTitle,
        optimizations.metaDescription,
        optimizations.keywords ? JSON.stringify(optimizations.keywords) : null,
        id,
      ]);
    } else {
      const existing = inMemoryCollections.findIndex(c => c.id === id);
      if (existing >= 0) {
        inMemoryCollections[existing] = {
          ...inMemoryCollections[existing],
          meta_title: optimizations.metaTitle || inMemoryCollections[existing].meta_title,
          meta_description: optimizations.metaDescription || inMemoryCollections[existing].meta_description,
          keywords: optimizations.keywords ? JSON.stringify(optimizations.keywords) : inMemoryCollections[existing].keywords,
          updated_at: new Date().toISOString(),
        };
      }
    }

    // Return updated collection
    req.params = { id };
    await getCollection(req, res);
  } catch (error) {
    console.error("Error applying AI optimization:", error);
    res.status(500).json({ error: "Failed to apply AI optimization" });
  }
};

// Create collection
export const createCollection = async (req: Request, res: Response) => {
  try {
    const collectionData = CollectionSchema.parse(req.body);
    const id = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await saveCollection({
      id,
      ...collectionData,
      productCount: 0,
    });

    res.status(201).json({ id, ...collectionData });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Failed to create collection" });
  }
};

// Delete collection
export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (databaseService.isConnected()) {
      await databaseService.query(`DELETE FROM collections WHERE id = ?`, [id]);
    } else {
      const index = inMemoryCollections.findIndex(c => c.id === id);
      if (index >= 0) {
        inMemoryCollections.splice(index, 1);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Failed to delete collection" });
  }
};

// Bulk optimize collections
export const bulkOptimizeCollections = async (req: Request, res: Response) => {
  try {
    const { collectionIds, type } = req.body;
    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const id of collectionIds) {
      try {
        // Apply optimization to each collection
        req.params = { id };
        req.body = { type };
        await applySEOOptimization(req, res);
        processed++;
      } catch (error) {
        failed++;
        errors.push(`Failed to optimize collection ${id}: ${error}`);
      }
    }

    res.json({
      success: failed === 0,
      processed,
      failed,
      errors,
    });
  } catch (error) {
    console.error("Error in bulk optimization:", error);
    res.status(500).json({ error: "Failed to perform bulk optimization" });
  }
};

// Export individual route handlers
export {
  getCollectionsSEOData,
  syncCollectionsFromPlatforms,
  getCollection,
  updateCollectionSEO,
  generateSEORecommendations,
  applySEOOptimization,
  createCollection,
  deleteCollection,
  bulkOptimizeCollections,
};

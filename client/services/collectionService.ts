interface Collection {
  id: string;
  name: string;
  type: "collection" | "category" | "cms_page" | "brand_page";
  slug: string;
  products: number;
  seoScore: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  lastOptimized: string;
  status: "optimized" | "needs_work" | "critical";
  platform?: string;
  platformId?: string;
  content?: string;
  isPublished?: boolean;
  templateSuffix?: string;
}

interface SEORecommendation {
  id: string;
  type: "title" | "description" | "keywords" | "content" | "breadcrumbs";
  priority: "high" | "medium" | "low";
  description: string;
  impact: string;
}

interface CollectionSEOData {
  collections: Collection[];
  recommendations: SEORecommendation[];
  stats: {
    totalCollections: number;
    optimizedCount: number;
    needsWorkCount: number;
    criticalCount: number;
    averageScore: number;
  };
}

interface ShopifyCollection {
  id: number;
  handle: string;
  title: string;
  body_html?: string;
  published_at?: string;
  template_suffix?: string;
  seo: {
    title?: string;
    description?: string;
  };
  product_count?: number;
}

interface ShopifyPage {
  id: number;
  title: string;
  handle: string;
  body_html?: string;
  published_at?: string;
  template_suffix?: string;
  seo: {
    title?: string;
    description?: string;
  };
}

class CollectionService {
  private baseUrl = "/api/collections";

  // Get all collections, categories, CMS pages, and brand pages
  async getCollectionsSEOData(): Promise<CollectionSEOData> {
    try {
      const response = await fetch(`${this.baseUrl}/seo-data`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch collections data: ${response.statusText}`,
        );
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  // Sync collections from connected platforms
  async syncCollectionsFromPlatforms(): Promise<{
    success: boolean;
    synced: number;
    errors: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/sync-from-platforms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get Shopify collections
  async getShopifyCollections(
    integrationId: string,
  ): Promise<ShopifyCollection[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/shopify/${integrationId}/collections`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Shopify collections: ${response.statusText}`,
        );
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  // Get Shopify pages (for CMS pages)
  async getShopifyPages(integrationId: string): Promise<ShopifyPage[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/shopify/${integrationId}/pages`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Shopify pages: ${response.statusText}`,
        );
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  // Update collection SEO data
  async updateCollectionSEO(
    collectionId: string,
    seoData: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
      content?: string;
    },
  ): Promise<Collection> {
    try {
      const response = await fetch(`${this.baseUrl}/${collectionId}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update collection SEO: ${response.statusText}`,
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Generate AI-powered SEO recommendations
  async generateSEORecommendations(
    collectionId: string,
  ): Promise<SEORecommendation[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${collectionId}/ai-recommendations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate recommendations: ${response.statusText}`,
        );
      }

      const recommendations = await response.json();
      return recommendations;
    } catch (error) {
      throw error;
    }
  }

  // Apply AI SEO optimization
  async applySEOOptimization(
    collectionId: string,
    optimizationType: "title" | "description" | "keywords" | "all",
  ): Promise<Collection> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${collectionId}/ai-optimize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: optimizationType }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to apply AI optimization: ${response.statusText}`,
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Bulk SEO optimization
  async bulkOptimizeCollections(
    collectionIds: string[],
    optimizationType: "title" | "description" | "keywords" | "all",
  ): Promise<{
    success: boolean;
    processed: number;
    failed: number;
    errors: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/bulk-optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionIds, type: optimizationType }),
      });

      if (!response.ok) {
        throw new Error(`Bulk optimization failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get collection by ID
  async getCollection(id: string): Promise<Collection> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch collection: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  // Delete collection
  async deleteCollection(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete collection: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  // Create new collection
  async createCollection(
    collectionData: Partial<Collection>,
  ): Promise<Collection> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create collection: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Sync collection back to platform
  async syncCollectionToPlatform(
    collectionId: string,
    platformId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${collectionId}/sync-to-platform`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platformId }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to sync to platform: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Calculate SEO score
  calculateSEOScore(collection: Collection): number {
    let score = 0;
    const maxScore = 100;

    // Meta title (25 points)
    if (collection.metaTitle) {
      if (
        collection.metaTitle.length >= 30 &&
        collection.metaTitle.length <= 60
      ) {
        score += 25;
      } else if (collection.metaTitle.length > 0) {
        score += 15;
      }
    }

    // Meta description (25 points)
    if (collection.metaDescription) {
      if (
        collection.metaDescription.length >= 120 &&
        collection.metaDescription.length <= 160
      ) {
        score += 25;
      } else if (collection.metaDescription.length > 0) {
        score += 15;
      }
    }

    // Keywords (20 points)
    if (collection.keywords && collection.keywords.length > 0) {
      if (collection.keywords.length >= 3 && collection.keywords.length <= 10) {
        score += 20;
      } else if (collection.keywords.length > 0) {
        score += 10;
      }
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
      if (collection.slug.includes("-") && collection.slug.length <= 50) {
        score += 10;
      } else if (collection.slug.length > 0) {
        score += 5;
      }
    }

    // Publishing status (5 points)
    if (collection.isPublished) {
      score += 5;
    }

    return Math.min(score, maxScore);
  }

  // Determine collection status based on SEO score
  getCollectionStatus(score: number): "optimized" | "needs_work" | "critical" {
    if (score >= 80) return "optimized";
    if (score >= 50) return "needs_work";
    return "critical";
  }
}

export const collectionService = new CollectionService();
export type { Collection, SEORecommendation, CollectionSEOData };

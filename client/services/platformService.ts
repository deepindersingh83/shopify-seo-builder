import {
  PlatformIntegration,
  SyncHistory,
  PlatformCredentials,
} from "@shared/workflows";

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  tags: string;
  status: "active" | "archived" | "draft";
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  seo: {
    title?: string;
    description?: string;
  };
  metafields?: ShopifyMetafield[];
}

interface ShopifyVariant {
  id: number;
  title: string;
  price: string;
  compare_at_price?: string;
  sku?: string;
  barcode?: string;
  inventory_quantity: number;
  weight: number;
  weight_unit: string;
}

interface ShopifyImage {
  id: number;
  src: string;
  alt?: string;
  position: number;
}

interface ShopifyMetafield {
  id: number;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  status: "publish" | "draft" | "private";
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number;
  categories: WooCommerceCategory[];
  tags: WooCommerceTag[];
  images: WooCommerceImage[];
  meta_data: WooCommerceMetaData[];
  yoast_head?: string;
  yoast_head_json?: any;
}

interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

interface WooCommerceTag {
  id: number;
  name: string;
  slug: string;
}

interface WooCommerceImage {
  id: number;
  src: string;
  name: string;
  alt: string;
  position: number;
}

interface WooCommerceMetaData {
  id: number;
  key: string;
  value: any;
}

interface SyncResult {
  success: boolean;
  totalItems: number;
  processedItems: number;
  errors: string[];
  warnings: string[];
  summary: {
    created: number;
    updated: number;
    skipped: number;
    failed: number;
  };
}

class PlatformService {
  private baseUrl = "/api/platforms";

  // Shopify Integration
  async connectShopify(credentials: {
    domain: string;
    accessToken: string;
  }): Promise<PlatformIntegration> {
    const response = await fetch(`${this.baseUrl}/shopify/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  async testShopifyConnection(
    integrationId: string,
  ): Promise<{ success: boolean; message: string; shop?: any }> {
    const response = await fetch(
      `${this.baseUrl}/shopify/${integrationId}/test`,
    );
    return response.json();
  }

  async getShopifyProducts(
    integrationId: string,
    params?: { limit?: number; page?: number; status?: string },
  ): Promise<{ products: ShopifyProduct[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.status) searchParams.append("status", params.status);

    const response = await fetch(
      `${this.baseUrl}/shopify/${integrationId}/products?${searchParams}`,
    );
    return response.json();
  }

  async syncFromShopify(
    integrationId: string,
    options?: { productIds?: number[]; fullSync?: boolean },
  ): Promise<SyncResult> {
    const response = await fetch(
      `${this.baseUrl}/shopify/${integrationId}/sync/import`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {}),
      },
    );
    return response.json();
  }

  async syncToShopify(
    integrationId: string,
    productIds: string[],
  ): Promise<SyncResult> {
    const response = await fetch(
      `${this.baseUrl}/shopify/${integrationId}/sync/export`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      },
    );
    return response.json();
  }

  async updateShopifyProduct(
    integrationId: string,
    shopifyProductId: number,
    updates: Partial<ShopifyProduct>,
  ): Promise<ShopifyProduct> {
    const response = await fetch(
      `${this.baseUrl}/shopify/${integrationId}/products/${shopifyProductId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      },
    );
    return response.json();
  }

  async createShopifyWebhook(
    integrationId: string,
    topic: string,
    address: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/shopify/${integrationId}/webhooks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, address }),
      },
    );
    return response.json();
  }

  // WooCommerce Integration
  async connectWooCommerce(credentials: {
    url: string;
    consumerKey: string;
    consumerSecret: string;
  }): Promise<PlatformIntegration> {
    const response = await fetch(`${this.baseUrl}/woocommerce/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  async testWooCommerceConnection(
    integrationId: string,
  ): Promise<{ success: boolean; message: string; info?: any }> {
    const response = await fetch(
      `${this.baseUrl}/woocommerce/${integrationId}/test`,
    );
    return response.json();
  }

  async getWooCommerceProducts(
    integrationId: string,
    params?: { per_page?: number; page?: number; status?: string },
  ): Promise<{ products: WooCommerceProduct[]; total: number; pages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.per_page)
      searchParams.append("per_page", params.per_page.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.status) searchParams.append("status", params.status);

    const response = await fetch(
      `${this.baseUrl}/woocommerce/${integrationId}/products?${searchParams}`,
    );
    return response.json();
  }

  async syncFromWooCommerce(
    integrationId: string,
    options?: { productIds?: number[]; fullSync?: boolean },
  ): Promise<SyncResult> {
    const response = await fetch(
      `${this.baseUrl}/woocommerce/${integrationId}/sync/import`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {}),
      },
    );
    return response.json();
  }

  async syncToWooCommerce(
    integrationId: string,
    productIds: string[],
  ): Promise<SyncResult> {
    const response = await fetch(
      `${this.baseUrl}/woocommerce/${integrationId}/sync/export`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      },
    );
    return response.json();
  }

  async updateWooCommerceProduct(
    integrationId: string,
    wooProductId: number,
    updates: Partial<WooCommerceProduct>,
  ): Promise<WooCommerceProduct> {
    const response = await fetch(
      `${this.baseUrl}/woocommerce/${integrationId}/products/${wooProductId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      },
    );
    return response.json();
  }

  // BigCommerce Integration
  async connectBigCommerce(credentials: {
    storeHash: string;
    accessToken: string;
  }): Promise<PlatformIntegration> {
    const response = await fetch(`${this.baseUrl}/bigcommerce/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  // General Platform Management
  async getPlatformIntegrations(): Promise<PlatformIntegration[]> {
    const response = await fetch(`${this.baseUrl}/integrations`);
    return response.json();
  }

  async getPlatformIntegration(id: string): Promise<PlatformIntegration> {
    const response = await fetch(`${this.baseUrl}/integrations/${id}`);
    return response.json();
  }

  async updatePlatformIntegration(
    id: string,
    updates: Partial<PlatformIntegration>,
  ): Promise<PlatformIntegration> {
    const response = await fetch(`${this.baseUrl}/integrations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  }

  async deletePlatformIntegration(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/integrations/${id}`, {
      method: "DELETE",
    });
  }

  async getSyncHistory(integrationId: string): Promise<SyncHistory[]> {
    const response = await fetch(
      `${this.baseUrl}/integrations/${integrationId}/sync-history`,
    );
    return response.json();
  }

  async startManualSync(
    integrationId: string,
    direction: "import" | "export" | "bidirectional",
    options?: any,
  ): Promise<{ syncId: string }> {
    const response = await fetch(
      `${this.baseUrl}/integrations/${integrationId}/sync`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, options }),
      },
    );
    return response.json();
  }

  async getSyncStatus(
    syncId: string,
  ): Promise<{
    status: string;
    progress: number;
    errors: string[];
    warnings: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/sync/${syncId}/status`);
    return response.json();
  }

  async cancelSync(syncId: string): Promise<void> {
    await fetch(`${this.baseUrl}/sync/${syncId}/cancel`, {
      method: "POST",
    });
  }

  // Product Mapping and Transformation
  async getFieldMappings(
    integrationId: string,
  ): Promise<{ [localField: string]: string }> {
    const response = await fetch(
      `${this.baseUrl}/integrations/${integrationId}/field-mappings`,
    );
    return response.json();
  }

  async updateFieldMappings(
    integrationId: string,
    mappings: { [localField: string]: string },
  ): Promise<void> {
    await fetch(
      `${this.baseUrl}/integrations/${integrationId}/field-mappings`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mappings),
      },
    );
  }

  async previewSync(
    integrationId: string,
    direction: "import" | "export",
    sampleSize: number = 5,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/integrations/${integrationId}/sync/preview`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, sampleSize }),
      },
    );
    return response.json();
  }

  // Conflict Resolution
  async getConflicts(integrationId: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/integrations/${integrationId}/conflicts`,
    );
    return response.json();
  }

  async resolveConflict(
    integrationId: string,
    conflictId: string,
    resolution: "local" | "remote" | "merge" | "skip",
  ): Promise<void> {
    await fetch(
      `${this.baseUrl}/integrations/${integrationId}/conflicts/${conflictId}/resolve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution }),
      },
    );
  }

  // Platform-specific SEO Features
  async syncSEOData(
    integrationId: string,
    productIds: string[],
  ): Promise<SyncResult> {
    const response = await fetch(
      `${this.baseUrl}/integrations/${integrationId}/sync/seo`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      },
    );
    return response.json();
  }

  async getSEOFieldMappings(
    integrationId: string,
  ): Promise<{ [seoField: string]: string }> {
    const response = await fetch(
      `${this.baseUrl}/integrations/${integrationId}/seo-mappings`,
    );
    return response.json();
  }

  // Real-time sync monitoring
  subscribeSyncUpdates(
    syncId: string,
    callback: (data: any) => void,
  ): EventSource {
    const eventSource = new EventSource(
      `${this.baseUrl}/sync/${syncId}/stream`,
    );
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    return eventSource;
  }

  // Mock data generators for development
  generateMockShopifyProducts(): ShopifyProduct[] {
    return [
      {
        id: 1234567890,
        title: "Premium Wireless Headphones",
        body_html:
          "<p>High-quality wireless headphones with noise cancellation.</p>",
        vendor: "AudioTech",
        product_type: "Electronics",
        handle: "premium-wireless-headphones",
        tags: "wireless, headphones, bluetooth, noise-cancelling",
        status: "active",
        variants: [
          {
            id: 12345,
            title: "Default Title",
            price: "199.99",
            compare_at_price: "249.99",
            sku: "AWH-001",
            barcode: "123456789012",
            inventory_quantity: 50,
            weight: 250,
            weight_unit: "g",
          },
        ],
        images: [
          {
            id: 56789,
            src: "https://example.com/headphones.jpg",
            alt: "Premium wireless headphones",
            position: 1,
          },
        ],
        seo: {
          title: "Premium Wireless Headphones - Best Quality Audio",
          description:
            "Experience superior sound quality with our premium wireless headphones featuring advanced noise cancellation technology.",
        },
        metafields: [
          {
            id: 98765,
            namespace: "seo",
            key: "focus_keyword",
            value: "wireless headphones",
            type: "single_line_text_field",
          },
        ],
      },
    ];
  }

  generateMockWooCommerceProducts(): WooCommerceProduct[] {
    return [
      {
        id: 123,
        name: "Premium Coffee Maker",
        slug: "premium-coffee-maker",
        status: "publish",
        description:
          "<p>Professional-grade coffee maker for perfect brewing every time.</p>",
        short_description:
          "Professional coffee maker with advanced brewing technology.",
        sku: "PCM-001",
        price: "299.99",
        regular_price: "299.99",
        sale_price: "",
        stock_quantity: 25,
        categories: [
          {
            id: 15,
            name: "Kitchen Appliances",
            slug: "kitchen-appliances",
          },
        ],
        tags: [
          {
            id: 25,
            name: "premium",
            slug: "premium",
          },
        ],
        images: [
          {
            id: 456,
            src: "https://example.com/coffee-maker.jpg",
            name: "Premium Coffee Maker",
            alt: "Professional coffee maker",
            position: 0,
          },
        ],
        meta_data: [
          {
            id: 789,
            key: "_yoast_wpseo_title",
            value: "Premium Coffee Maker - Professional Brewing",
          },
        ],
        yoast_head_json: {
          title: "Premium Coffee Maker - Professional Brewing",
          description:
            "Professional-grade coffee maker for perfect brewing every time.",
          robots: { index: "index", follow: "follow" },
        },
      },
    ];
  }
}

export const platformService = new PlatformService();

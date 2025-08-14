import { databaseService } from "../services/database";
import { z } from "zod";

// Product schema for validation
export const ProductSchema = z.object({
  id: z.string(),
  shopify_id: z.number().optional(),
  title: z.string(),
  handle: z.string(),
  description: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  vendor: z.string().optional(),
  product_type: z.string().optional(),
  tags: z.array(z.string()).default([]),
  price: z.number(),
  compare_at_price: z.number().optional(),
  inventory: z.number().default(0),
  image_url: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  seo_score: z.number().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export interface ProductFilters {
  status?: string[];
  vendor?: string[];
  product_type?: string[];
  seo_score_min?: number;
  seo_score_max?: number;
  price_min?: number;
  price_max?: number;
  tags?: string[];
  query?: string;
  has_meta_title?: boolean;
  has_meta_description?: boolean;
}

export interface PaginationOptions {
  offset: number;
  limit: number;
  sortBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

class ProductRepository {
  async findAll(
    filters: ProductFilters = {},
    pagination: PaginationOptions,
  ): Promise<ProductSearchResult> {
    // If database is not available, return empty results
    if (!databaseService.isConnected()) {
      return {
        products: [],
        total: 0,
        hasMore: false,
        page: Math.floor(pagination.offset / pagination.limit) + 1,
        totalPages: 0,
      };
    }

    const { offset, limit, sortBy } = pagination;

    let baseQuery = "SELECT * FROM products";
    let countQuery = "SELECT COUNT(*) as total FROM products";
    const params: any[] = [];
    const whereClauses: string[] = [];

    // Build WHERE clauses based on filters
    if (filters.status && filters.status.length > 0) {
      const placeholders = filters.status.map(() => "?").join(",");
      whereClauses.push(`status IN (${placeholders})`);
      params.push(...filters.status);
    }

    if (filters.vendor && filters.vendor.length > 0) {
      const placeholders = filters.vendor.map(() => "?").join(",");
      whereClauses.push(`vendor IN (${placeholders})`);
      params.push(...filters.vendor);
    }

    if (filters.product_type && filters.product_type.length > 0) {
      const placeholders = filters.product_type.map(() => "?").join(",");
      whereClauses.push(`product_type IN (${placeholders})`);
      params.push(...filters.product_type);
    }

    if (filters.seo_score_min !== undefined) {
      whereClauses.push("seo_score >= ?");
      params.push(filters.seo_score_min);
    }

    if (filters.seo_score_max !== undefined) {
      whereClauses.push("seo_score <= ?");
      params.push(filters.seo_score_max);
    }

    if (filters.price_min !== undefined) {
      whereClauses.push("price >= ?");
      params.push(filters.price_min);
    }

    if (filters.price_max !== undefined) {
      whereClauses.push("price <= ?");
      params.push(filters.price_max);
    }

    if (filters.has_meta_title !== undefined) {
      if (filters.has_meta_title) {
        whereClauses.push('meta_title IS NOT NULL AND meta_title != ""');
      } else {
        whereClauses.push('(meta_title IS NULL OR meta_title = "")');
      }
    }

    if (filters.has_meta_description !== undefined) {
      if (filters.has_meta_description) {
        whereClauses.push(
          'meta_description IS NOT NULL AND meta_description != ""',
        );
      } else {
        whereClauses.push(
          '(meta_description IS NULL OR meta_description = "")',
        );
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags
        .map(() => "JSON_CONTAINS(tags, ?)")
        .join(" OR ");
      whereClauses.push(`(${tagConditions})`);
      params.push(...filters.tags.map((tag) => JSON.stringify(tag)));
    }

    if (filters.query) {
      whereClauses.push(`(
        MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE) OR
        title LIKE ? OR
        description LIKE ? OR
        vendor LIKE ? OR
        product_type LIKE ?
      )`);
      const queryParam = `%${filters.query}%`;
      params.push(
        filters.query,
        queryParam,
        queryParam,
        queryParam,
        queryParam,
      );
    }

    // Apply WHERE clauses
    if (whereClauses.length > 0) {
      const whereClause = ` WHERE ${whereClauses.join(" AND ")}`;
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Apply sorting
    if (sortBy) {
      const direction = sortBy.direction.toUpperCase();
      baseQuery += ` ORDER BY ${sortBy.field} ${direction}`;
    } else {
      baseQuery += " ORDER BY updated_at DESC";
    }

    // Apply pagination
    baseQuery += " LIMIT ? OFFSET ?";
    const queryParams = [...params, limit, offset];
    const countParams = [...params];

    try {
      // Execute both queries
      const [products, countResult] = await Promise.all([
        databaseService.query(baseQuery, queryParams),
        databaseService.query(countQuery, countParams),
      ]);

      const totalCount = countResult[0].total;

      // Parse JSON fields
      const parsedProducts = products.map((product: any) => ({
        ...product,
        tags: product.tags ? JSON.parse(product.tags) : [],
        created_at: product.created_at?.toISOString(),
        updated_at: product.updated_at?.toISOString(),
      }));

      return {
        products: parsedProducts,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
      };
    } catch (error) {
      console.error("Error in ProductRepository.findAll:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Product | null> {
    if (!databaseService.isConnected()) {
      return null;
    }

    try {
      const result = await databaseService.query(
        "SELECT * FROM products WHERE id = ?",
        [id],
      );

      if (result.length === 0) {
        return null;
      }

      const product = result[0];
      return {
        ...product,
        tags: product.tags ? JSON.parse(product.tags) : [],
        created_at: product.created_at?.toISOString(),
        updated_at: product.updated_at?.toISOString(),
      };
    } catch (error) {
      console.error("Error in ProductRepository.findById:", error);
      throw error;
    }
  }

  async search(
    query: string,
    filters: ProductFilters = {},
    limit: number = 50,
  ): Promise<Product[]> {
    const searchFilters = { ...filters, query };
    const result = await this.findAll(searchFilters, {
      offset: 0,
      limit,
      sortBy: { field: "updated_at", direction: "desc" },
    });

    return result.products;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = ProductSchema.parse({
      id: productData.id || `product-${Date.now()}`,
      ...productData,
    });

    try {
      await databaseService.query(
        `
        INSERT INTO products (
          id, shopify_id, title, handle, description, status, vendor, product_type,
          tags, price, compare_at_price, inventory, image_url, meta_title, meta_description, seo_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          product.id,
          product.shopify_id,
          product.title,
          product.handle,
          product.description,
          product.status,
          product.vendor,
          product.product_type,
          JSON.stringify(product.tags),
          product.price,
          product.compare_at_price,
          product.inventory,
          product.image_url,
          product.meta_title,
          product.meta_description,
          product.seo_score,
        ],
      );

      const createdProduct = await this.findById(product.id);
      if (!createdProduct) {
        throw new Error("Failed to create product");
      }

      return createdProduct;
    } catch (error) {
      console.error("Error in ProductRepository.create:", error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const updateFields: string[] = [];
    const params: any[] = [];

    // Build dynamic update query
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && value !== undefined) {
        updateFields.push(`${key} = ?`);
        if (key === "tags") {
          params.push(JSON.stringify(value));
        } else {
          params.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    params.push(id); // for WHERE clause

    try {
      await databaseService.query(
        `
        UPDATE products 
        SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
        params,
      );

      return this.findById(id);
    } catch (error) {
      console.error("Error in ProductRepository.update:", error);
      throw error;
    }
  }

  async bulkUpdate(
    productIds: string[],
    updates: Partial<Product>,
  ): Promise<{ updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;

    try {
      await databaseService.transaction(async (conn) => {
        for (const id of productIds) {
          try {
            const updateFields: string[] = [];
            const params: any[] = [];

            Object.entries(updates).forEach(([key, value]) => {
              if (key !== "id" && value !== undefined) {
                updateFields.push(`${key} = ?`);
                if (key === "tags") {
                  params.push(JSON.stringify(value));
                } else {
                  params.push(value);
                }
              }
            });

            if (updateFields.length > 0) {
              params.push(id);
              await conn.query(
                `
                UPDATE products 
                SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
              `,
                params,
              );
              updated++;
            }
          } catch (error) {
            errors.push(
              `Product ${id}: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
          }
        }
      });

      return { updated, errors };
    } catch (error) {
      console.error("Error in ProductRepository.bulkUpdate:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await databaseService.query(
        "DELETE FROM products WHERE id = ?",
        [id],
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in ProductRepository.delete:", error);
      throw error;
    }
  }

  async getCount(filters: ProductFilters = {}): Promise<number> {
    if (!databaseService.isConnected()) {
      return 0;
    }

    let query = "SELECT COUNT(*) as total FROM products";
    const params: any[] = [];
    const whereClauses: string[] = [];

    // Apply the same filters as in findAll
    if (filters.status && filters.status.length > 0) {
      const placeholders = filters.status.map(() => "?").join(",");
      whereClauses.push(`status IN (${placeholders})`);
      params.push(...filters.status);
    }

    if (filters.query) {
      whereClauses.push(`(
        MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE) OR
        title LIKE ? OR
        description LIKE ? OR
        vendor LIKE ?
      )`);
      const queryParam = `%${filters.query}%`;
      params.push(filters.query, queryParam, queryParam, queryParam);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    try {
      const result = await databaseService.query(query, params);
      return result[0].total;
    } catch (error) {
      console.error("Error in ProductRepository.getCount:", error);
      throw error;
    }
  }

  async getVendors(): Promise<string[]> {
    if (!databaseService.isConnected()) {
      return [
        "Nike",
        "Adidas",
        "Apple",
        "Samsung",
        "Sony",
        "Microsoft",
        "Amazon",
        "Google",
        "Dell",
        "HP",
      ];
    }

    try {
      const result = await databaseService.query(`
        SELECT DISTINCT vendor
        FROM products
        WHERE vendor IS NOT NULL AND vendor != ''
        ORDER BY vendor
      `);

      return result.map((row: any) => row.vendor);
    } catch (error) {
      console.error("Error in ProductRepository.getVendors:", error);
      throw error;
    }
  }

  async getProductTypes(): Promise<string[]> {
    if (!databaseService.isConnected()) {
      return [
        "Electronics",
        "Clothing",
        "Shoes",
        "Accessories",
        "Home & Garden",
        "Sports",
        "Beauty",
        "Books",
        "Games",
        "Tools",
      ];
    }

    try {
      const result = await databaseService.query(`
        SELECT DISTINCT product_type
        FROM products
        WHERE product_type IS NOT NULL AND product_type != ''
        ORDER BY product_type
      `);

      return result.map((row: any) => row.product_type);
    } catch (error) {
      console.error("Error in ProductRepository.getProductTypes:", error);
      throw error;
    }
  }
}

export const productRepository = new ProductRepository();
export default productRepository;

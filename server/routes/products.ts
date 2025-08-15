import { Request, Response } from "express";
import {
  productRepository,
  type Product,
  type ProductFilters,
} from "../repositories/productRepository";
import { databaseService } from "../services/database";
import { storeProductsService } from "../services/storeProductsService";

// Paginated products endpoint
export const getPaginatedProducts = async (req: Request, res: Response) => {
  try {
    const { offset = 0, limit = 50, filters = {}, sorting = {} } = req.body;
    const startTime = Date.now();

    const startIndex = parseInt(offset as string);
    const pageSize = Math.min(parseInt(limit as string), 500);

    // Convert frontend filters to repository filters
    const productFilters: ProductFilters = {
      status: filters.status,
      vendor: filters.vendor,
      product_type: filters.productType,
      seo_score_min: filters.seoScoreRange?.[0],
      seo_score_max: filters.seoScoreRange?.[1],
      price_min: filters.priceRange?.[0],
      price_max: filters.priceRange?.[1],
      tags: filters.tags,
      query: filters.query,
      has_meta_title: filters.hasMetaTitle,
      has_meta_description: filters.hasMetaDescription,
    };

    const sortBy = sorting.field
      ? {
          field: sorting.field,
          direction: sorting.direction || "desc",
        }
      : undefined;

    let allProducts: Product[] = [];
    let totalCount = 0;

    if (databaseService.isConnected()) {
      // Get products from database
      const result = await productRepository.findAll(productFilters, {
        offset: startIndex,
        limit: pageSize,
        sortBy,
      });

      allProducts = result.products;
      totalCount = result.totalCount; // Fixed: was trying to access result.totalCount instead of totalCount

      console.log(`📊 Retrieved ${allProducts.length} products from database`);
    } else {
      // Get products from connected stores (memory storage)
      const storeProducts = storeProductsService.getAllStoreProducts();

      // Apply basic filtering for store products
      let filteredProducts = storeProducts;

      if (productFilters.query) {
        const query = productFilters.query.toLowerCase();
        filteredProducts = storeProducts.filter(product =>
          product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.vendor?.toLowerCase().includes(query)
        );
      }

      if (productFilters.status && productFilters.status.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          productFilters.status!.includes(product.status)
        );
      }

      if (productFilters.vendor && productFilters.vendor.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          productFilters.vendor!.includes(product.vendor)
        );
      }

      // Apply pagination
      totalCount = filteredProducts.length;
      allProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

      console.log(`📊 Retrieved ${allProducts.length}/${totalCount} products from store memory`);
    }

    const queryTime = Date.now() - startTime;

    res.json({
      data: allProducts,
      totalCount: totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      hasNextPage: startIndex + pageSize < totalCount,
      hasPreviousPage: startIndex > 0,
      queryTime,
      virtualScrollMetadata: {
        startIndex,
        endIndex: startIndex + allProducts.length - 1,
        totalHeight: totalCount * 80,
        visibleItems: allProducts.length,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search products endpoint
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query = "", filters = {}, sortBy = {}, limit = 50 } = req.body;
    const startTime = Date.now();

    const searchLimit = Math.min(parseInt(limit as string), 200);
    let allProducts: any[] = [];

    if (databaseService.isConnected()) {
      // Get products from database
      const productFilters: ProductFilters = {
        status: filters.status,
        vendor: filters.vendor,
        product_type: filters.productType,
        seo_score_min: filters.seoScoreRange?.[0],
        seo_score_max: filters.seoScoreRange?.[1],
        price_min: filters.priceRange?.[0],
        price_max: filters.priceRange?.[1],
        tags: filters.tags,
        query,
        has_meta_title: filters.hasMetaTitle,
        has_meta_description: filters.hasMetaDescription,
      };

      allProducts = await productRepository.search(
        query,
        productFilters,
        searchLimit,
      );
    } else {
      // Get products from store memory storage
      const storeProducts = storeProductsService.getAllStoreProducts();

      // Apply basic filtering
      allProducts = storeProducts.filter(product => {
        // Query filter
        if (query) {
          const searchQuery = query.toLowerCase();
          const matchesQuery =
            product.title?.toLowerCase().includes(searchQuery) ||
            product.description?.toLowerCase().includes(searchQuery) ||
            product.vendor?.toLowerCase().includes(searchQuery) ||
            product.product_type?.toLowerCase().includes(searchQuery);
          if (!matchesQuery) return false;
        }

        // Status filter
        if (filters.status && filters.status.length > 0) {
          if (!filters.status.includes(product.status)) return false;
        }

        // Vendor filter
        if (filters.vendor && filters.vendor.length > 0) {
          if (!filters.vendor.includes(product.vendor)) return false;
        }

        return true;
      });
    }

    // Apply sorting if requested
    if (sortBy.field) {
      allProducts.sort((a: any, b: any) => {
        const aVal = a[sortBy.field];
        const bVal = b[sortBy.field];

        if (sortBy.direction === "desc") {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    const queryTime = Date.now() - startTime;

    res.json({
      products: allProducts.slice(0, limit),
      totalCount: allProducts.length,
      queryTime,
    });
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get product count endpoint
export const getProductCount = async (req: Request, res: Response) => {
  try {
    const { query = "", filters = {} } = req.body;
    let count = 0;

    if (databaseService.isConnected()) {
      // Get count from database
      const productFilters: ProductFilters = {
        status: filters.status,
        vendor: filters.vendor,
        product_type: filters.productType,
        query,
      };

      count = await productRepository.getCount(productFilters);
    } else {
      // Get count from store memory storage
      const storeProducts = storeProductsService.getAllStoreProducts();

      // Apply basic filtering and count
      const filteredProducts = storeProducts.filter(product => {
        // Query filter
        if (query) {
          const searchQuery = query.toLowerCase();
          const matchesQuery =
            product.title?.toLowerCase().includes(searchQuery) ||
            product.description?.toLowerCase().includes(searchQuery) ||
            product.vendor?.toLowerCase().includes(searchQuery) ||
            product.product_type?.toLowerCase().includes(searchQuery);
          if (!matchesQuery) return false;
        }

        // Status filter
        if (filters.status && filters.status.length > 0) {
          if (!filters.status.includes(product.status)) return false;
        }

        // Vendor filter
        if (filters.vendor && filters.vendor.length > 0) {
          if (!filters.vendor.includes(product.vendor)) return false;
        }

        return true;
      });

      count = filteredProducts.length;
    }

    res.json({ count });
  } catch (error) {
    console.error("Error in getProductCount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lazy load products endpoint
export const lazyLoadProducts = async (req: Request, res: Response) => {
  try {
    const { startIndex, count } = req.body;

    const result = await productRepository.findAll(
      {},
      {
        offset: startIndex,
        limit: count,
      },
    );

    res.json(result.products);
  } catch (error) {
    console.error("Error in lazyLoadProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Bulk update products endpoint
export const bulkUpdateProducts = async (req: Request, res: Response) => {
  try {
    const { productIds, updates } = req.body;

    // Convert frontend updates to database format
    const dbUpdates: Partial<Product> = {};

    if (updates.status) dbUpdates.status = updates.status;
    if (updates.vendor) dbUpdates.vendor = updates.vendor;
    if (updates.productType) dbUpdates.product_type = updates.productType;
    if (updates.metaTitle) dbUpdates.meta_title = updates.metaTitle;
    if (updates.metaDescription)
      dbUpdates.meta_description = updates.metaDescription;
    if (updates.tags) {
      // Parse comma-separated tags
      dbUpdates.tags = updates.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean);
    }

    const result = await productRepository.bulkUpdate(productIds, dbUpdates);

    res.json({
      success: true,
      updatedCount: result.updated,
      failedCount: result.errors.length,
      results: productIds.map((id) => ({
        id,
        success: !result.errors.some((error) => error.includes(id)),
        changes: dbUpdates,
        error: result.errors.find((error) => error.includes(id)) || null,
      })),
    });
  } catch (error) {
    console.error("Error in bulkUpdateProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single product endpoint
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await productRepository.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error in getProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create product endpoint
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const product = await productRepository.create(productData);

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update product endpoint
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await productRepository.update(id, updates);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product endpoint
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await productRepository.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get vendors endpoint
export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await productRepository.getVendors();
    res.json(vendors);
  } catch (error) {
    console.error("Error in getVendors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get product types endpoint
export const getProductTypes = async (req: Request, res: Response) => {
  try {
    const productTypes = await productRepository.getProductTypes();
    res.json(productTypes);
  } catch (error) {
    console.error("Error in getProductTypes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

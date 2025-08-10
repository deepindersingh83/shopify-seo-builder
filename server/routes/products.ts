import { Request, Response } from "express";
import { productRepository, type Product, type ProductFilters } from "../repositories/productRepository";

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

    const sortBy = sorting.field ? {
      field: sorting.field,
      direction: sorting.direction || 'desc'
    } : undefined;

    const result = await productRepository.findAll(productFilters, {
      offset: startIndex,
      limit: pageSize,
      sortBy,
    });

    const queryTime = Date.now() - startTime;

    res.json({
      data: result.products,
      totalCount: result.totalCount,
      pageCount: Math.ceil(result.totalCount / pageSize),
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
      queryTime,
      virtualScrollMetadata: {
        startIndex,
        endIndex: startIndex + result.products.length - 1,
        totalHeight: result.totalCount * 80,
        visibleItems: result.products.length,
      },
    });
  } catch (error) {
    console.error('Error in getPaginatedProducts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search products endpoint
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query = "", filters = {}, sortBy = {}, limit = 50 } = req.body;
    const startTime = Date.now();

    const searchLimit = Math.min(parseInt(limit as string), 200);

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
      query,
      has_meta_title: filters.hasMetaTitle,
      has_meta_description: filters.hasMetaDescription,
    };

    const products = await productRepository.search(query, productFilters, searchLimit);
    
    // Apply sorting if requested
    if (sortBy.field) {
      products.sort((a: any, b: any) => {
        const aVal = a[sortBy.field];
        const bVal = b[sortBy.field];
        
        if (sortBy.direction === 'desc') {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    const queryTime = Date.now() - startTime;

    res.json({
      products: products.slice(0, limit),
      totalCount: products.length,
      queryTime,
    });
  } catch (error) {
    console.error('Error in searchProducts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product count endpoint
export const getProductCount = async (req: Request, res: Response) => {
  try {
    const { query = "", filters = {} } = req.body;
    
    const productFilters: ProductFilters = {
      status: filters.status,
      vendor: filters.vendor,
      product_type: filters.productType,
      query,
    };

    const count = await productRepository.getCount(productFilters);
    
    res.json({ count });
  } catch (error) {
    console.error('Error in getProductCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Lazy load products endpoint
export const lazyLoadProducts = async (req: Request, res: Response) => {
  try {
    const { startIndex, count } = req.body;

    const result = await productRepository.findAll({}, {
      offset: startIndex,
      limit: count,
    });

    res.json(result.products);
  } catch (error) {
    console.error('Error in lazyLoadProducts:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    if (updates.metaDescription) dbUpdates.meta_description = updates.metaDescription;
    if (updates.tags) {
      // Parse comma-separated tags
      dbUpdates.tags = updates.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    }

    const result = await productRepository.bulkUpdate(productIds, dbUpdates);

    res.json({
      success: true,
      updatedCount: result.updated,
      failedCount: result.errors.length,
      results: productIds.map(id => ({
        id,
        success: !result.errors.some(error => error.includes(id)),
        changes: dbUpdates,
        error: result.errors.find(error => error.includes(id)) || null,
      })),
    });
  } catch (error) {
    console.error('Error in bulkUpdateProducts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product endpoint
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await productRepository.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create product endpoint
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    
    const product = await productRepository.create(productData);
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product endpoint
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const product = await productRepository.update(id, updates);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product endpoint
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await productRepository.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get vendors endpoint
export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await productRepository.getVendors();
    res.json(vendors);
  } catch (error) {
    console.error('Error in getVendors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get product types endpoint
export const getProductTypes = async (req: Request, res: Response) => {
  try {
    const productTypes = await productRepository.getProductTypes();
    res.json(productTypes);
  } catch (error) {
    console.error('Error in getProductTypes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

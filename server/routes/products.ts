import { Request, Response } from "express";

interface Product {
  id: string;
  title: string;
  handle: string;
  status: "active" | "draft" | "archived";
  vendor: string;
  productType: string;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  inventory: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  seoScore: number;
}

// Generate mock data for 500K+ products efficiently
const generateMockProduct = (id: number): Product => {
  const statuses: ("active" | "draft" | "archived")[] = [
    "active",
    "draft",
    "archived",
  ];
  const vendors = [
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
  const productTypes = [
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

  const descriptions = [
    "High-quality product designed for modern consumers with exceptional durability and style.",
    "Premium offering that combines functionality with aesthetic appeal for the discerning customer.",
    "Innovation meets tradition in this carefully crafted product that exceeds expectations.",
    "Professional-grade solution engineered for performance and reliability in demanding environments.",
    "Sustainable and eco-friendly option that doesn't compromise on quality or performance.",
  ];

  const title = `Product ${id} - ${vendors[id % vendors.length]} ${productTypes[id % productTypes.length]}`;
  const handle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
  const seoScore = Math.floor(Math.random() * 100);

  return {
    id: `product-${id}`,
    title,
    handle,
    status: statuses[id % statuses.length],
    vendor: vendors[id % vendors.length],
    productType: productTypes[id % productTypes.length],
    tags: [
      `tag-${Math.floor(id / 100)}`,
      `category-${id % 10}`,
      `featured-${id % 50}`,
    ],
    price: Math.floor(Math.random() * 500) + 20,
    compareAtPrice:
      Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 100 : undefined,
    inventory: Math.floor(Math.random() * 1000),
    image: `https://picsum.photos/200/200?random=${id}`,
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    description: descriptions[id % descriptions.length],
    metaTitle: Math.random() > 0.3 ? `${title} | Best Quality` : undefined,
    metaDescription:
      Math.random() > 0.2
        ? `${descriptions[id % descriptions.length].substring(0, 150)}...`
        : undefined,
    seoScore,
  };
};

// Paginated products endpoint
export const getPaginatedProducts = (req: Request, res: Response) => {
  try {
    const { offset = 0, limit = 50, filters = {}, sorting = {} } = req.body;
    const startTime = Date.now();

    // Simulate large dataset (500K products)
    const TOTAL_PRODUCTS = 500000;
    const startIndex = parseInt(offset as string);
    const pageSize = Math.min(parseInt(limit as string), 500); // Max 500 per page for performance

    // Generate products for the requested range
    const products: Product[] = [];
    for (
      let i = startIndex;
      i < Math.min(startIndex + pageSize, TOTAL_PRODUCTS);
      i++
    ) {
      const product = generateMockProduct(i + 1);

      // Apply filters
      if (
        filters.status &&
        filters.status.length > 0 &&
        !filters.status.includes(product.status)
      ) {
        continue;
      }
      if (
        filters.vendor &&
        filters.vendor.length > 0 &&
        !filters.vendor.includes(product.vendor)
      ) {
        continue;
      }
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (
          !product.title.toLowerCase().includes(query) &&
          !product.description.toLowerCase().includes(query)
        ) {
          continue;
        }
      }

      products.push(product);
    }

    // Apply sorting
    if (sorting.field) {
      products.sort((a, b) => {
        const aVal = a[sorting.field as keyof Product];
        const bVal = b[sorting.field as keyof Product];

        if (sorting.direction === "desc") {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    const queryTime = Date.now() - startTime;

    res.json({
      data: products,
      totalCount: TOTAL_PRODUCTS,
      pageCount: Math.ceil(TOTAL_PRODUCTS / pageSize),
      hasNextPage: startIndex + pageSize < TOTAL_PRODUCTS,
      hasPreviousPage: startIndex > 0,
      queryTime,
      virtualScrollMetadata: {
        startIndex,
        endIndex: startIndex + products.length - 1,
        totalHeight: TOTAL_PRODUCTS * 80, // Assuming 80px per item
        visibleItems: products.length,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search products endpoint
export const searchProducts = (req: Request, res: Response) => {
  try {
    const { query = "", filters = {}, sortBy = {}, limit = 50 } = req.body;
    const startTime = Date.now();

    const TOTAL_PRODUCTS = 500000;
    const searchLimit = Math.min(parseInt(limit as string), 200);
    const products: Product[] = [];
    const matchedProducts = new Set<string>(); // Track unique products

    // Simulate searching through a large dataset efficiently
    if (query) {
      const searchQuery = query.toLowerCase();

      // Use query hash to distribute search across the product range to avoid duplicates
      const queryHash = searchQuery.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const searchRange = Math.min(5000, TOTAL_PRODUCTS);

      for (let i = 0; i < searchRange; i++) {
        // Generate unique product IDs based on search query and iteration
        const productId = (queryHash * 31 + i * 7) % TOTAL_PRODUCTS + 1;
        const productKey = `product-${productId}`;

        if (matchedProducts.has(productKey)) {
          continue; // Skip duplicates
        }

        const product = generateMockProduct(productId);

        // Check if product matches search query
        const matchesQuery =
          product.title.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.vendor.toLowerCase().includes(searchQuery) ||
          product.productType.toLowerCase().includes(searchQuery) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchQuery));

        if (!matchesQuery) {
          continue;
        }

        // Apply filters
        if (
          filters.status &&
          filters.status.length > 0 &&
          !filters.status.includes(product.status)
        ) {
          continue;
        }
        if (
          filters.vendor &&
          filters.vendor.length > 0 &&
          !filters.vendor.includes(product.vendor)
        ) {
          continue;
        }

        matchedProducts.add(productKey);
        products.push(product);

        if (products.length >= searchLimit) {
          break;
        }
      }
    } else {
      // No search query - return unique sample of products
      for (let i = 1; i <= searchLimit && i <= TOTAL_PRODUCTS; i++) {
        const product = generateMockProduct(i);

        // Apply filters
        if (
          filters.status &&
          filters.status.length > 0 &&
          !filters.status.includes(product.status)
        ) {
          continue;
        }
        if (
          filters.vendor &&
          filters.vendor.length > 0 &&
          !filters.vendor.includes(product.vendor)
        ) {
          continue;
        }

        products.push(product);
      }
    }

    // Apply sorting
    if (sortBy.field) {
      products.sort((a, b) => {
        const aVal = a[sortBy.field as keyof Product];
        const bVal = b[sortBy.field as keyof Product];

        if (sortBy.direction === "desc") {
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
    console.error("Error in searchProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get product count endpoint
export const getProductCount = (req: Request, res: Response) => {
  try {
    const { query = "", filters = {} } = req.body;

    // For demo purposes, return different counts based on filters
    let count = 500000; // Base count

    if (query) {
      count = Math.floor(count * 0.1); // Search typically returns 10% of total
    }

    if (filters.status && filters.status.length > 0) {
      count = Math.floor(count * (filters.status.length / 3)); // 3 total statuses
    }

    res.json({ count });
  } catch (error) {
    console.error("Error in getProductCount:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lazy load products endpoint
export const lazyLoadProducts = (req: Request, res: Response) => {
  try {
    const { startIndex, count } = req.body;
    const products: Product[] = [];

    for (let i = startIndex; i < startIndex + count; i++) {
      products.push(generateMockProduct(i + 1));
    }

    res.json(products);
  } catch (error) {
    console.error("Error in lazyLoadProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Bulk update products endpoint
export const bulkUpdateProducts = (req: Request, res: Response) => {
  try {
    const { productIds, updates } = req.body;

    // Simulate bulk update processing
    const results = productIds.map((id: string) => ({
      id,
      success: Math.random() > 0.1, // 90% success rate
      changes: updates,
      error: Math.random() > 0.9 ? "Failed to update product" : null,
    }));

    res.json({
      success: true,
      updatedCount: results.filter((r: any) => r.success).length,
      failedCount: results.filter((r: any) => !r.success).length,
      results,
    });
  } catch (error) {
    console.error("Error in bulkUpdateProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single product endpoint
export const getProduct = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id.replace("product-", ""));

    if (isNaN(productId)) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = generateMockProduct(productId);
    res.json(product);
  } catch (error) {
    console.error("Error in getProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

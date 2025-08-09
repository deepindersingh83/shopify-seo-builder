interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items in cache
  strategy: "lru" | "fifo" | "lfu"; // Cache eviction strategy
}

interface PaginationConfig {
  pageSize: number;
  virtualScrolling: boolean;
  preloadPages: number;
  bufferSize: number;
}

interface BatchConfig {
  batchSize: number;
  maxConcurrentRequests: number;
  retryAttempts: number;
  retryDelay: number;
}

interface IndexConfig {
  fields: string[];
  type: "btree" | "hash" | "text";
  unique?: boolean;
}

interface PerformanceMetrics {
  queryTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  throughput: number;
  errorRate: number;
}

interface VirtualScrollItem {
  id: string;
  index: number;
  height: number;
  data: any;
}

interface LazyLoadConfig {
  threshold: number; // Distance from viewport to trigger loading
  rootMargin: string; // Intersection observer root margin
  loadBatchSize: number; // Number of items to load at once
}

class PerformanceService {
  private cache = new Map<
    string,
    { data: any; timestamp: number; accessCount: number }
  >();
  private cacheConfig: CacheConfig = {
    ttl: 300000, // 5 minutes
    maxSize: 10000,
    strategy: "lru",
  };

  private batchConfig: BatchConfig = {
    batchSize: 200,
    maxConcurrentRequests: 10,
    retryAttempts: 3,
    retryDelay: 1000,
  };

  private paginationConfig: PaginationConfig = {
    pageSize: 50,
    virtualScrolling: true,
    preloadPages: 2,
    bufferSize: 100,
  };

  private metrics: PerformanceMetrics = {
    queryTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    throughput: 0,
    errorRate: 0,
  };

  // Cache Management
  setCache(key: string, data: any, customTtl?: number): void {
    const ttl = customTtl || this.cacheConfig.ttl;

    // Clean expired entries if cache is at max size
    if (this.cache.size >= this.cacheConfig.maxSize) {
      this.evictCache();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 0,
    });
  }

  getCache(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.cacheConfig.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access count for LFU strategy
    entry.accessCount++;
    return entry.data;
  }

  private evictCache(): void {
    const now = Date.now();
    let evicted = 0;

    // First, remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheConfig.ttl) {
        this.cache.delete(key);
        evicted++;
      }
    }

    // If still at capacity, use eviction strategy
    if (this.cache.size >= this.cacheConfig.maxSize) {
      const entries = Array.from(this.cache.entries());

      switch (this.cacheConfig.strategy) {
        case "lru":
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          break;
        case "lfu":
          entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
          break;
        case "fifo":
        default:
          // Already in insertion order
          break;
      }

      // Remove oldest/least used entries
      const toRemove = Math.max(1, Math.floor(this.cacheConfig.maxSize * 0.1));
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; hitRate: number; memoryUsage: number } {
    return {
      size: this.cache.size,
      hitRate: this.metrics.cacheHitRate,
      memoryUsage: this.estimateCacheMemoryUsage(),
    };
  }

  private estimateCacheMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2; // String characters are 2 bytes
      totalSize += JSON.stringify(entry.data).length * 2; // Rough estimation
      totalSize += 16; // Timestamp and accessCount
    }
    return totalSize;
  }

  // Pagination with Virtual Scrolling
  async getPaginatedData<T>(
    dataSource: string,
    page: number,
    filters?: any,
    sorting?: { field: string; direction: "asc" | "desc" },
  ): Promise<{
    data: T[];
    totalCount: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    virtualScrollMetadata?: {
      startIndex: number;
      endIndex: number;
      totalHeight: number;
      visibleItems: number;
    };
  }> {
    const cacheKey = this.generateCacheKey(
      "paginated",
      dataSource,
      page,
      filters,
      sorting,
    );
    const cached = this.getCache(cacheKey);

    if (cached) {
      this.updateMetrics("cacheHit");
      return cached;
    }

    const startTime = performance.now();

    try {
      const offset = (page - 1) * this.paginationConfig.pageSize;

      const response = await fetch("/api/products/paginated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offset,
          limit: this.paginationConfig.pageSize,
          filters,
          sorting,
          enableVirtualScrolling: this.paginationConfig.virtualScrolling,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      // Cache the result
      this.setCache(cacheKey, result);

      this.updateMetrics("querySuccess", performance.now() - startTime);
      return result;
    } catch (error) {
      this.updateMetrics("queryError", performance.now() - startTime);
      throw error;
    }
  }

  // Virtual Scrolling Implementation
  calculateVirtualScrollParams(
    totalItems: number,
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
  ): {
    startIndex: number;
    endIndex: number;
    offsetY: number;
    visibleItems: number;
  } {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(
      startIndex + visibleItems + this.paginationConfig.bufferSize,
      totalItems - 1,
    );
    const offsetY = startIndex * itemHeight;

    return {
      startIndex: Math.max(0, startIndex - this.paginationConfig.bufferSize),
      endIndex,
      offsetY,
      visibleItems,
    };
  }

  // Batch Processing
  async processBatch<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    onProgress?: (progress: number, completed: number, total: number) => void,
  ): Promise<R[]> {
    const results: R[] = [];
    const totalBatches = Math.ceil(items.length / this.batchConfig.batchSize);
    let completedBatches = 0;

    // Create batches
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += this.batchConfig.batchSize) {
      batches.push(items.slice(i, i + this.batchConfig.batchSize));
    }

    // Process batches with concurrency control
    const semaphore = new Semaphore(this.batchConfig.maxConcurrentRequests);

    const batchPromises = batches.map(async (batch, index) => {
      await semaphore.acquire();

      try {
        const batchResult = await this.retryOperation(
          () => processor(batch),
          this.batchConfig.retryAttempts,
          this.batchConfig.retryDelay,
        );

        completedBatches++;
        const progress = (completedBatches / totalBatches) * 100;

        if (onProgress) {
          onProgress(progress, completedBatches, totalBatches);
        }

        return batchResult;
      } finally {
        semaphore.release();
      }
    });

    const batchResults = await Promise.all(batchPromises);

    // Flatten results
    for (const batchResult of batchResults) {
      results.push(...batchResult);
    }

    return results;
  }

  // Retry mechanism with exponential backoff
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number,
    baseDelay: number,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Lazy Loading Implementation
  createLazyLoader(
    config: LazyLoadConfig = {
      threshold: 200,
      rootMargin: "50px",
      loadBatchSize: 20,
    },
  ): {
    observer: IntersectionObserver;
    loadItems: (startIndex: number, count: number) => Promise<any[]>;
  } {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const index = parseInt(element.dataset.index || "0");

            // Trigger loading of next batch
            this.loadLazyBatch(index, config.loadBatchSize);
          }
        });
      },
      {
        rootMargin: config.rootMargin,
        threshold: 0.1,
      },
    );

    return {
      observer,
      loadItems: (startIndex: number, count: number) =>
        this.loadLazyBatch(startIndex, count),
    };
  }

  private async loadLazyBatch(
    startIndex: number,
    count: number,
  ): Promise<any[]> {
    const cacheKey = `lazy_batch_${startIndex}_${count}`;
    const cached = this.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch("/api/products/lazy-load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startIndex, count }),
      });

      const items = await response.json();
      this.setCache(cacheKey, items, 60000); // Cache for 1 minute

      return items;
    } catch (error) {
      console.error("Failed to load lazy batch:", error);
      return [];
    }
  }

  // Search Optimization with Debouncing
  createOptimizedSearch(
    searchFunction: (query: string, filters?: any) => Promise<any[]>,
    debounceMs: number = 300,
  ): (query: string, filters?: any) => Promise<any[]> {
    let timeoutId: NodeJS.Timeout;
    let lastQuery = "";

    return (query: string, filters?: any) => {
      return new Promise((resolve, reject) => {
        // Clear previous timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // If query hasn't changed, return cached result
        const cacheKey = this.generateCacheKey("search", query, filters);
        const cached = this.getCache(cacheKey);

        if (cached && query === lastQuery) {
          resolve(cached);
          return;
        }

        timeoutId = setTimeout(async () => {
          try {
            const results = await searchFunction(query, filters);
            this.setCache(cacheKey, results, 120000); // Cache for 2 minutes
            lastQuery = query;
            resolve(results);
          } catch (error) {
            reject(error);
          }
        }, debounceMs);
      });
    };
  }

  // Memory Management
  async optimizeMemoryUsage(): Promise<void> {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Clear old cache entries
    this.evictCache();

    // Clear any large temporary data structures
    this.clearTempData();
  }

  private clearTempData(): void {
    // Clear any temporary data that might be consuming memory
    // This would be implementation-specific
  }

  // Performance Monitoring
  private updateMetrics(
    type: "cacheHit" | "querySuccess" | "queryError",
    queryTime?: number,
  ): void {
    switch (type) {
      case "cacheHit":
        // Update cache hit rate
        break;
      case "querySuccess":
        if (queryTime !== undefined) {
          this.metrics.queryTime = queryTime;
        }
        break;
      case "queryError":
        this.metrics.errorRate++;
        break;
    }
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Utility Functions
  private generateCacheKey(...parts: any[]): string {
    return parts
      .map((part) =>
        typeof part === "object" ? JSON.stringify(part) : String(part),
      )
      .join(":");
  }

  // Configuration Management
  updateCacheConfig(config: Partial<CacheConfig>): void {
    this.cacheConfig = { ...this.cacheConfig, ...config };
  }

  updateBatchConfig(config: Partial<BatchConfig>): void {
    this.batchConfig = { ...this.batchConfig, ...config };
  }

  updatePaginationConfig(config: Partial<PaginationConfig>): void {
    this.paginationConfig = { ...this.paginationConfig, ...config };
  }

  // Database Query Optimization Suggestions
  generateOptimizationSuggestions(queryMetrics: any): string[] {
    const suggestions: string[] = [];

    if (queryMetrics.executionTime > 1000) {
      suggestions.push(
        "Consider adding database indexes for frequently queried fields",
      );
      suggestions.push(
        "Implement query result caching for expensive operations",
      );
    }

    if (queryMetrics.scannedRows > queryMetrics.returnedRows * 10) {
      suggestions.push(
        "Query is scanning too many rows - consider adding more selective filters",
      );
    }

    if (queryMetrics.memoryUsage > 100 * 1024 * 1024) {
      // 100MB
      suggestions.push(
        "Query is using excessive memory - consider pagination or result limiting",
      );
    }

    return suggestions;
  }
}

// Semaphore for concurrency control
class Semaphore {
  private permits: number;
  private waiting: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      this.permits--;
      resolve();
    }
  }
}

export const performanceService = new PerformanceService();
export type {
  CacheConfig,
  PaginationConfig,
  BatchConfig,
  PerformanceMetrics,
  VirtualScrollItem,
  LazyLoadConfig,
};

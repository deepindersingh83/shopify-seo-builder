// Shared service for managing store products across routes
class StoreProductsService {
  private storeProducts = new Map<string, any[]>();

  // Add products for a store
  setStoreProducts(storeId: string, products: any[]): void {
    this.storeProducts.set(storeId, products);
    console.log(`💾 Stored ${products.length} products for store ${storeId}`);
  }

  // Get products for a specific store
  getStoreProducts(storeId: string): any[] {
    return this.storeProducts.get(storeId) || [];
  }

  // Get all products from all connected stores
  getAllStoreProducts(): any[] {
    const allProducts: any[] = [];
    for (const products of this.storeProducts.values()) {
      allProducts.push(...products);
    }
    return allProducts;
  }

  // Get all store IDs that have products
  getConnectedStoreIds(): string[] {
    return Array.from(this.storeProducts.keys());
  }

  // Remove products for a store
  removeStoreProducts(storeId: string): void {
    this.storeProducts.delete(storeId);
    console.log(`🗑️ Removed products for store ${storeId}`);
  }

  // Get total product count across all stores
  getTotalProductCount(): number {
    let total = 0;
    for (const products of this.storeProducts.values()) {
      total += products.length;
    }
    return total;
  }
}

export const storeProductsService = new StoreProductsService();
export default storeProductsService;

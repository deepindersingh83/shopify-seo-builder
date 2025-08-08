import { FilterPreset, ProductFilter } from '@shared/workflows';

interface FilterCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'is_empty' | 'is_not_empty' | 'starts_with' | 'ends_with';
  value: any;
  value2?: any; // For 'between' operator
  logicalOperator?: 'AND' | 'OR';
}

interface FilterGroup {
  id: string;
  conditions: FilterCondition[];
  logicalOperator: 'AND' | 'OR';
}

interface AdvancedFilter {
  id: string;
  name: string;
  description?: string;
  groups: FilterGroup[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive: boolean;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'range';
  options?: { value: any; label: string }[];
  placeholder?: string;
  description?: string;
  category: 'basic' | 'seo' | 'inventory' | 'pricing' | 'performance' | 'advanced';
}

interface QuickFilter {
  id: string;
  label: string;
  description: string;
  icon: string;
  filter: ProductFilter[];
  color: string;
}

class FilterService {
  private baseUrl = '/api/filters';

  // Available filter fields configuration
  getFilterFields(): FilterField[] {
    return [
      // Basic Fields
      { key: 'title', label: 'Product Title', type: 'text', category: 'basic', placeholder: 'Search in product titles...' },
      { key: 'handle', label: 'URL Handle', type: 'text', category: 'basic', placeholder: 'URL handle/slug...' },
      { key: 'description', label: 'Description', type: 'text', category: 'basic', placeholder: 'Search in descriptions...' },
      { key: 'vendor', label: 'Vendor/Brand', type: 'select', category: 'basic', options: [
        { value: 'Apple', label: 'Apple' },
        { value: 'Samsung', label: 'Samsung' },
        { value: 'Nike', label: 'Nike' },
        { value: 'Adidas', label: 'Adidas' }
      ]},
      { key: 'productType', label: 'Product Type', type: 'select', category: 'basic', options: [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Shoes', label: 'Shoes' },
        { value: 'Accessories', label: 'Accessories' }
      ]},
      { key: 'status', label: 'Status', type: 'select', category: 'basic', options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'archived', label: 'Archived' }
      ]},
      { key: 'tags', label: 'Tags', type: 'multiselect', category: 'basic' },
      
      // SEO Fields
      { key: 'seoScore', label: 'SEO Score', type: 'range', category: 'seo', description: 'Filter by SEO optimization score' },
      { key: 'metaTitle', label: 'Meta Title', type: 'text', category: 'seo', placeholder: 'Search in meta titles...' },
      { key: 'metaDescription', label: 'Meta Description', type: 'text', category: 'seo', placeholder: 'Search in meta descriptions...' },
      { key: 'focusKeyword', label: 'Focus Keyword', type: 'text', category: 'seo', placeholder: 'Target keyword...' },
      { key: 'hasMetaTitle', label: 'Has Meta Title', type: 'boolean', category: 'seo' },
      { key: 'hasMetaDescription', label: 'Has Meta Description', type: 'boolean', category: 'seo' },
      { key: 'hasAltText', label: 'Has Alt Text', type: 'boolean', category: 'seo' },
      { key: 'hasSchema', label: 'Has Schema Markup', type: 'boolean', category: 'seo' },
      
      // Inventory Fields
      { key: 'inventory', label: 'Stock Quantity', type: 'range', category: 'inventory' },
      { key: 'sku', label: 'SKU', type: 'text', category: 'inventory', placeholder: 'SKU identifier...' },
      { key: 'barcode', label: 'Barcode', type: 'text', category: 'inventory', placeholder: 'Barcode...' },
      { key: 'trackQuantity', label: 'Track Quantity', type: 'boolean', category: 'inventory' },
      { key: 'lowStock', label: 'Low Stock Alert', type: 'boolean', category: 'inventory', description: 'Products with stock below threshold' },
      
      // Pricing Fields
      { key: 'price', label: 'Price', type: 'range', category: 'pricing' },
      { key: 'compareAtPrice', label: 'Compare At Price', type: 'range', category: 'pricing' },
      { key: 'costPerItem', label: 'Cost Per Item', type: 'range', category: 'pricing' },
      { key: 'hasDiscount', label: 'Has Discount', type: 'boolean', category: 'pricing' },
      { key: 'profitMargin', label: 'Profit Margin %', type: 'range', category: 'pricing' },
      
      // Performance Fields
      { key: 'pageSpeed', label: 'Page Speed Score', type: 'range', category: 'performance' },
      { key: 'mobileScore', label: 'Mobile Score', type: 'range', category: 'performance' },
      { key: 'coreWebVitals', label: 'Core Web Vitals', type: 'select', category: 'performance', options: [
        { value: 'good', label: 'Good' },
        { value: 'needs-improvement', label: 'Needs Improvement' },
        { value: 'poor', label: 'Poor' }
      ]},
      
      // Advanced Fields
      { key: 'createdAt', label: 'Created Date', type: 'date', category: 'advanced' },
      { key: 'updatedAt', label: 'Updated Date', type: 'date', category: 'advanced' },
      { key: 'weight', label: 'Weight', type: 'range', category: 'advanced' },
      { key: 'dimensions', label: 'Has Dimensions', type: 'boolean', category: 'advanced' },
      { key: 'hasImages', label: 'Has Images', type: 'boolean', category: 'advanced' },
      { key: 'imageCount', label: 'Image Count', type: 'range', category: 'advanced' },
    ];
  }

  // Quick filters for common use cases
  getQuickFilters(): QuickFilter[] {
    return [
      {
        id: 'seo-needs-work',
        label: 'SEO Needs Work',
        description: 'Products with SEO score below 60',
        icon: 'AlertTriangle',
        color: 'red',
        filter: [{ field: 'seoScore', operator: 'less_than', value: 60 }]
      },
      {
        id: 'missing-meta',
        label: 'Missing Meta Tags',
        description: 'Products without meta title or description',
        icon: 'Target',
        color: 'orange',
        filter: [
          { field: 'hasMetaTitle', operator: 'equals', value: false },
          { field: 'hasMetaDescription', operator: 'equals', value: false }
        ]
      },
      {
        id: 'low-stock',
        label: 'Low Stock',
        description: 'Products with inventory below 10',
        icon: 'Package',
        color: 'yellow',
        filter: [{ field: 'inventory', operator: 'less_than', value: 10 }]
      },
      {
        id: 'high-value',
        label: 'High Value',
        description: 'Products priced above $100',
        icon: 'DollarSign',
        color: 'green',
        filter: [{ field: 'price', operator: 'greater_than', value: 100 }]
      },
      {
        id: 'draft-products',
        label: 'Draft Products',
        description: 'Products in draft status',
        icon: 'Edit',
        color: 'blue',
        filter: [{ field: 'status', operator: 'equals', value: 'draft' }]
      },
      {
        id: 'no-images',
        label: 'No Images',
        description: 'Products without product images',
        icon: 'Image',
        color: 'purple',
        filter: [{ field: 'hasImages', operator: 'equals', value: false }]
      }
    ];
  }

  // Filter Presets Management
  async getFilterPresets(): Promise<FilterPreset[]> {
    try {
      const response = await fetch(`${this.baseUrl}/presets`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      return response.json();
    } catch (error) {
      // Return mock data if API is not available
      return this.generateMockFilterPresets();
    }
  }

  async getFilterPreset(id: string): Promise<FilterPreset> {
    const response = await fetch(`${this.baseUrl}/presets/${id}`);
    return response.json();
  }

  async saveFilterPreset(preset: Omit<FilterPreset, 'id' | 'createdAt' | 'usageCount'>): Promise<FilterPreset> {
    try {
      const response = await fetch(`${this.baseUrl}/presets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset)
      });
      if (!response.ok) {
        throw new Error('API not available');
      }
      return response.json();
    } catch (error) {
      // Return mock data if API is not available
      return {
        ...preset,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
        usageCount: 0
      };
    }
  }

  async updateFilterPreset(id: string, updates: Partial<FilterPreset>): Promise<FilterPreset> {
    try {
      const response = await fetch(`${this.baseUrl}/presets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) {
        throw new Error('API not available');
      }
      return response.json();
    } catch (error) {
      // Return mock data if API is not available
      const mockPresets = this.generateMockFilterPresets();
      const preset = mockPresets.find(p => p.id === id);
      return preset ? { ...preset, ...updates } : { id, ...updates } as FilterPreset;
    }
  }

  async deleteFilterPreset(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/presets/${id}`, {
      method: 'DELETE'
    });
  }

  async duplicateFilterPreset(id: string, newName: string): Promise<FilterPreset> {
    const response = await fetch(`${this.baseUrl}/presets/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });
    return response.json();
  }

  // Filter Application
  async applyFilters(filters: ProductFilter[], options?: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortDirection?: 'asc' | 'desc' 
  }): Promise<{ products: any[]; total: number; facets: any }> {
    const response = await fetch(`${this.baseUrl}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters, options })
    });
    return response.json();
  }

  async getFilterCounts(filters: ProductFilter[]): Promise<{ [field: string]: number }> {
    const response = await fetch(`${this.baseUrl}/counts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters })
    });
    return response.json();
  }

  async getFilterSuggestions(field: string, query: string, currentFilters: ProductFilter[] = []): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, query, currentFilters })
    });
    return response.json();
  }

  // Advanced Filter Building
  async validateFilter(filter: ProductFilter): Promise<{ valid: boolean; error?: string }> {
    const response = await fetch(`${this.baseUrl}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter })
    });
    return response.json();
  }

  async previewFilterResults(filters: ProductFilter[], limit: number = 5): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters, limit })
    });
    return response.json();
  }

  // Filter Analytics
  async getFilterAnalytics(presetId?: string): Promise<{
    usageStats: { [presetId: string]: number };
    popularFields: { field: string; count: number }[];
    savedTime: number;
    topPresets: FilterPreset[];
  }> {
    const url = presetId 
      ? `${this.baseUrl}/analytics?presetId=${presetId}`
      : `${this.baseUrl}/analytics`;
    const response = await fetch(url);
    return response.json();
  }

  // Filter Export/Import
  async exportFilters(presetIds: string[]): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presetIds })
    });
    return response.blob();
  }

  async importFilters(file: File): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  // Filter Sharing
  async shareFilterPreset(id: string, options: { public: boolean; expiresAt?: string }): Promise<{ shareUrl: string }> {
    const response = await fetch(`${this.baseUrl}/presets/${id}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    return response.json();
  }

  async getSharedFilterPreset(shareToken: string): Promise<FilterPreset> {
    const response = await fetch(`${this.baseUrl}/shared/${shareToken}`);
    return response.json();
  }

  // Client-side filtering utilities
  applyFiltersToProducts(products: any[], filters: ProductFilter[]): any[] {
    return products.filter(product => {
      return filters.every(filter => this.evaluateFilter(product, filter));
    });
  }

  private evaluateFilter(product: any, filter: ProductFilter): boolean {
    const fieldValue = this.getNestedProperty(product, filter.field);
    const { operator, value, value2 } = filter;

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      case 'less_than':
        return Number(fieldValue) < Number(value);
      case 'between':
        return Number(fieldValue) >= Number(value) && Number(fieldValue) <= Number(value2);
      case 'in':
        return Array.isArray(value) ? value.includes(fieldValue) : false;
      case 'not_in':
        return Array.isArray(value) ? !value.includes(fieldValue) : true;
      case 'is_empty':
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'is_not_empty':
        return fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
      default:
        return true;
    }
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Filter builder helpers
  buildFilterFromQuickFilter(quickFilter: QuickFilter): ProductFilter[] {
    return quickFilter.filter;
  }

  combineFilters(filters1: ProductFilter[], filters2: ProductFilter[], operator: 'AND' | 'OR' = 'AND'): ProductFilter[] {
    // For simplicity, just concatenate filters
    // In a real implementation, you'd need to handle logical operators properly
    return [...filters1, ...filters2];
  }

  // Mock data generators
  generateMockFilterPresets(): FilterPreset[] {
    return [
      {
        id: '1',
        name: 'SEO Optimization Needed',
        description: 'Products that need SEO improvements',
        filters: [
          { field: 'seoScore', operator: 'less_than', value: 70 },
          { field: 'status', operator: 'equals', value: 'active' }
        ],
        isPublic: true,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        usageCount: 45
      },
      {
        id: '2',
        name: 'High Value Electronics',
        description: 'Electronics products over $200',
        filters: [
          { field: 'productType', operator: 'equals', value: 'Electronics' },
          { field: 'price', operator: 'greater_than', value: 200 }
        ],
        isPublic: false,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        usageCount: 23
      },
      {
        id: '3',
        name: 'Inventory Alerts',
        description: 'Products with low stock or missing data',
        filters: [
          { field: 'inventory', operator: 'less_than', value: 20 },
          { field: 'trackQuantity', operator: 'equals', value: true }
        ],
        isPublic: true,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        usageCount: 67
      }
    ];
  }
}

export const filterService = new FilterService();

import {
  AIOptimizationSuggestion,
  TagSuggestion,
  CategoryMapping,
} from "@shared/workflows";

interface SEOIssue {
  type:
    | "missing_meta_title"
    | "missing_meta_description"
    | "missing_alt_text"
    | "title_too_long"
    | "title_too_short"
    | "description_too_long"
    | "description_too_short"
    | "missing_focus_keyword"
    | "low_keyword_density"
    | "missing_schema"
    | "duplicate_content";
  severity: "critical" | "warning" | "info";
  description: string;
  autoFixable: boolean;
  fixSuggestion?: string;
}

interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: AIOptimizationSuggestion[];
  improvements: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    effort: "low" | "medium" | "high";
  }[];
}

interface SchemaMarkup {
  type: "Product" | "Article" | "Organization" | "WebPage" | "BreadcrumbList";
  jsonLd: string;
  isValid: boolean;
  errors?: string[];
}

interface ContentOptimization {
  originalText: string;
  optimizedText: string;
  changes: {
    type:
      | "keyword_addition"
      | "readability_improvement"
      | "length_optimization"
      | "structure_improvement";
    description: string;
    confidence: number;
  }[];
  readabilityScore: number;
  keywordDensity: number;
}

class SEOService {
  private baseUrl = "/api/seo";

  // SEO Analysis and Scoring
  async analyzeProduct(productId: string): Promise<SEOAnalysis> {
    const response = await fetch(`${this.baseUrl}/analyze/${productId}`);
    return response.json();
  }

  async analyzeBulkProducts(
    productIds: string[],
  ): Promise<{ [productId: string]: SEOAnalysis }> {
    const response = await fetch(`${this.baseUrl}/analyze/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    });
    return response.json();
  }

  // Auto-Fix SEO Issues
  async autoFixProduct(
    productId: string,
    issueTypes?: string[],
  ): Promise<{ fixed: string[]; failed: string[]; changes: any[] }> {
    const response = await fetch(`${this.baseUrl}/auto-fix/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issueTypes }),
    });
    return response.json();
  }

  async autoFixBulkProducts(
    productIds: string[],
    issueTypes?: string[],
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auto-fix/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds, issueTypes }),
    });
    return response.json();
  }

  // AI-Powered Meta Generation
  async generateMetaTitle(
    productId: string,
    options?: {
      useKeywords?: string[];
      tone?: "professional" | "casual" | "persuasive";
    },
  ): Promise<{
    suggestions: string[];
    recommended: string;
    reasoning: string;
  }> {
    const response = await fetch(
      `${this.baseUrl}/generate/meta-title/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {}),
      },
    );
    return response.json();
  }

  async generateMetaDescription(
    productId: string,
    options?: {
      useKeywords?: string[];
      tone?: "professional" | "casual" | "persuasive";
    },
  ): Promise<{
    suggestions: string[];
    recommended: string;
    reasoning: string;
  }> {
    const response = await fetch(
      `${this.baseUrl}/generate/meta-description/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {}),
      },
    );
    return response.json();
  }

  async generateAltText(
    productId: string,
    imageUrl: string,
  ): Promise<{ suggestions: string[]; recommended: string }> {
    const response = await fetch(
      `${this.baseUrl}/generate/alt-text/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      },
    );
    return response.json();
  }

  // Schema Markup Generation
  async generateProductSchema(
    productId: string,
    options?: {
      includeReviews?: boolean;
      includeBrand?: boolean;
      includeOffers?: boolean;
    },
  ): Promise<SchemaMarkup> {
    const response = await fetch(
      `${this.baseUrl}/schema/product/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {}),
      },
    );
    return response.json();
  }

  async generateBreadcrumbSchema(productId: string): Promise<SchemaMarkup> {
    const response = await fetch(
      `${this.baseUrl}/schema/breadcrumb/${productId}`,
    );
    return response.json();
  }

  async validateSchema(
    jsonLd: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const response = await fetch(`${this.baseUrl}/schema/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonLd }),
    });
    return response.json();
  }

  // Smart Tag Suggestions
  async getTagSuggestions(productId: string): Promise<TagSuggestion[]> {
    const response = await fetch(
      `${this.baseUrl}/tags/suggestions/${productId}`,
    );
    return response.json();
  }

  async getTagSuggestionsFromText(
    text: string,
    category?: string,
  ): Promise<TagSuggestion[]> {
    const response = await fetch(`${this.baseUrl}/tags/suggestions/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, category }),
    });
    return response.json();
  }

  async getCategoryMappings(): Promise<CategoryMapping[]> {
    const response = await fetch(`${this.baseUrl}/tags/category-mappings`);
    return response.json();
  }

  async updateCategoryMapping(
    category: string,
    mapping: CategoryMapping,
  ): Promise<CategoryMapping> {
    const response = await fetch(
      `${this.baseUrl}/tags/category-mappings/${category}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapping),
      },
    );
    return response.json();
  }

  // Keyword Research and Analysis
  async researchKeywords(
    seedKeyword: string,
    options?: {
      country?: string;
      language?: string;
      volume?: boolean;
      competition?: boolean;
    },
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/keywords/research`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seedKeyword, ...options }),
    });
    return response.json();
  }

  async analyzeKeywordDifficulty(
    keywords: string[],
  ): Promise<{
    [keyword: string]: {
      difficulty: number;
      volume: number;
      competition: "low" | "medium" | "high";
    };
  }> {
    const response = await fetch(`${this.baseUrl}/keywords/difficulty`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords }),
    });
    return response.json();
  }

  async getKeywordSuggestions(
    productId: string,
  ): Promise<{ primary: string[]; secondary: string[]; longtail: string[] }> {
    const response = await fetch(
      `${this.baseUrl}/keywords/suggestions/${productId}`,
    );
    return response.json();
  }

  // Content Optimization
  async optimizeContent(
    productId: string,
    content: string,
    targetKeyword?: string,
  ): Promise<ContentOptimization> {
    const response = await fetch(
      `${this.baseUrl}/content/optimize/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, targetKeyword }),
      },
    );
    return response.json();
  }

  async analyzeReadability(
    content: string,
  ): Promise<{ score: number; level: string; suggestions: string[] }> {
    const response = await fetch(`${this.baseUrl}/content/readability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return response.json();
  }

  // Competitor Analysis
  async analyzeCompetitors(
    productId: string,
    competitorUrls: string[],
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/competitors/analyze/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorUrls }),
      },
    );
    return response.json();
  }

  async findContentGaps(
    productId: string,
  ): Promise<{
    gaps: string[];
    opportunities: string[];
    recommendations: string[];
  }> {
    const response = await fetch(
      `${this.baseUrl}/competitors/content-gaps/${productId}`,
    );
    return response.json();
  }

  // Performance Monitoring
  async getPageSpeedInsights(productId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/performance/pagespeed/${productId}`,
    );
    return response.json();
  }

  async getCoreWebVitals(
    productId: string,
  ): Promise<{
    lcp: number;
    fid: number;
    cls: number;
    overall: "good" | "needs-improvement" | "poor";
  }> {
    const response = await fetch(
      `${this.baseUrl}/performance/core-web-vitals/${productId}`,
    );
    return response.json();
  }

  // SEO Templates and Rules
  async getOptimizationTemplates(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/templates`);
    return response.json();
  }

  async createOptimizationRule(rule: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
    return response.json();
  }

  async applyOptimizationTemplate(
    productId: string,
    templateId: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/templates/${templateId}/apply/${productId}`,
      {
        method: "POST",
      },
    );
    return response.json();
  }

  // Batch Processing
  async startBatchOptimization(
    productIds: string[],
    options: any,
  ): Promise<{ batchId: string; status: string }> {
    const response = await fetch(`${this.baseUrl}/batch/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds, options }),
    });
    return response.json();
  }

  async getBatchStatus(
    batchId: string,
  ): Promise<{ status: string; progress: number; results: any[] }> {
    const response = await fetch(`${this.baseUrl}/batch/${batchId}/status`);
    return response.json();
  }

  // Mock implementations for immediate use
  generateMockSEOAnalysis(productId: string): SEOAnalysis {
    return {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      issues: [
        {
          type: "missing_meta_description",
          severity: "critical",
          description: "Product is missing meta description",
          autoFixable: true,
          fixSuggestion:
            "Generate AI-powered meta description based on product content",
        },
        {
          type: "title_too_long",
          severity: "warning",
          description: "Meta title exceeds recommended 60 characters",
          autoFixable: true,
          fixSuggestion: "Trim title while preserving key information",
        },
        {
          type: "missing_schema",
          severity: "warning",
          description: "Product schema markup is missing",
          autoFixable: true,
          fixSuggestion:
            "Generate structured data for better search visibility",
        },
      ],
      suggestions: [
        {
          type: "meta_title",
          current: "Basic Product Title",
          suggested: "Premium Product Title - Best Quality | Brand Name",
          confidence: 0.85,
          reasoning: "Added descriptive keywords and brand name for better SEO",
          estimatedImpact: "high",
        },
      ],
      improvements: [
        {
          title: "Add focus keyword to title",
          description:
            "Include your primary target keyword in the product title",
          impact: "high",
          effort: "low",
        },
        {
          title: "Optimize image alt text",
          description: "Add descriptive alt text to all product images",
          impact: "medium",
          effort: "low",
        },
      ],
    };
  }

  generateMockTagSuggestions(productId: string): TagSuggestion[] {
    return [
      {
        tag: "premium-quality",
        confidence: 0.92,
        source: "ai",
        reasoning: "Detected premium quality indicators in product description",
      },
      {
        tag: "bestseller",
        confidence: 0.78,
        source: "category_mapping",
        reasoning: "Popular tag for this product category",
      },
      {
        tag: "eco-friendly",
        confidence: 0.65,
        source: "keyword_analysis",
        reasoning: "Found sustainability-related keywords in content",
      },
    ];
  }

  generateMockSchemaMarkup(productId: string): SchemaMarkup {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: "Premium Electronics Device",
      image: "https://example.com/product-image.jpg",
      description: "High-quality electronics device with premium features",
      brand: {
        "@type": "Brand",
        name: "Premium Brand",
      },
      offers: {
        "@type": "Offer",
        url: "https://example.com/product",
        priceCurrency: "USD",
        price: "299.99",
        availability: "https://schema.org/InStock",
      },
    };

    return {
      type: "Product",
      jsonLd: JSON.stringify(schema, null, 2),
      isValid: true,
      errors: [],
    };
  }
}

export const seoService = new SEOService();

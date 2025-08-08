import { 
  ThirdPartyIntegration, 
  GoogleSearchConsoleData, 
  GoogleAnalyticsData, 
  SEOToolData, 
  PageSpeedData,
  PageSpeedOpportunity 
} from '@shared/workflows';

interface GoogleSearchConsoleQuery {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GoogleSearchConsolePage {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GoogleAnalyticsMetric {
  itemsViewed: number;
  purchaseToDetailRate: number;
  itemRevenue: number;
  itemPurchaseQuantity: number;
  cartToViewRate: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  goalConversions: number;
  goalConversionRate: number;
}

interface SEMrushKeywordData {
  keyword: string;
  position: number;
  volume: number;
  cpc: number;
  competition: number;
  trend: number[];
  difficulty: number;
  url: string;
}

interface AhrefsData {
  keywords: {
    keyword: string;
    position: number;
    volume: number;
    difficulty: number;
    traffic: number;
  }[];
  backlinks: {
    domain: string;
    url: string;
    domainRating: number;
    urlRating: number;
    anchor: string;
    type: 'dofollow' | 'nofollow';
  }[];
  competitorAnalysis: {
    domain: string;
    organicKeywords: number;
    organicTraffic: number;
    domainRating: number;
  }[];
}

class ThirdPartyService {
  private baseUrl = '/api/third-party';

  // Google Search Console Integration
  async connectGoogleSearchConsole(authCode: string): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/google-search-console/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authCode })
    });
    return response.json();
  }

  async getSearchConsoleProperties(integrationId: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/google-search-console/${integrationId}/properties`);
    return response.json();
  }

  async getSearchConsoleData(integrationId: string, url: string, params?: {
    startDate?: string;
    endDate?: string;
    dimensions?: string[];
    filters?: any[];
  }): Promise<GoogleSearchConsoleData> {
    const response = await fetch(`${this.baseUrl}/google-search-console/${integrationId}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, ...params })
    });
    return response.json();
  }

  async getSearchConsoleQueries(integrationId: string, url: string, startDate: string, endDate: string): Promise<GoogleSearchConsoleQuery[]> {
    const response = await fetch(`${this.baseUrl}/google-search-console/${integrationId}/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, startDate, endDate, dimensions: ['query'] })
    });
    return response.json();
  }

  async getSearchConsolePages(integrationId: string, startDate: string, endDate: string): Promise<GoogleSearchConsolePage[]> {
    const response = await fetch(`${this.baseUrl}/google-search-console/${integrationId}/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, dimensions: ['page'] })
    });
    return response.json();
  }

  // Google Analytics Integration
  async connectGoogleAnalytics(authCode: string): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/google-analytics/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authCode })
    });
    return response.json();
  }

  async getAnalyticsProperties(integrationId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/google-analytics/${integrationId}/properties`);
    return response.json();
  }

  async getAnalyticsData(integrationId: string, propertyId: string, params: {
    startDate: string;
    endDate: string;
    metrics: string[];
    dimensions?: string[];
    filters?: any[];
  }): Promise<GoogleAnalyticsData> {
    const response = await fetch(`${this.baseUrl}/google-analytics/${integrationId}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, ...params })
    });
    return response.json();
  }

  async getProductPerformance(integrationId: string, propertyId: string, productId: string, dateRange: string): Promise<GoogleAnalyticsMetric> {
    const response = await fetch(`${this.baseUrl}/google-analytics/${integrationId}/product-performance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, productId, dateRange })
    });
    return response.json();
  }

  async getEcommerceData(integrationId: string, propertyId: string, startDate: string, endDate: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/google-analytics/${integrationId}/ecommerce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, startDate, endDate })
    });
    return response.json();
  }

  // SEMrush Integration
  async connectSEMrush(apiKey: string): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/semrush/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    return response.json();
  }

  async getSEMrushKeywordData(integrationId: string, domain: string, params?: {
    database?: string;
    limit?: number;
    export_columns?: string[];
  }): Promise<SEMrushKeywordData[]> {
    const response = await fetch(`${this.baseUrl}/semrush/${integrationId}/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, ...params })
    });
    return response.json();
  }

  async getSEMrushCompetitorAnalysis(integrationId: string, domain: string, competitors: string[]): Promise<any> {
    const response = await fetch(`${this.baseUrl}/semrush/${integrationId}/competitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, competitors })
    });
    return response.json();
  }

  async getSEMrushKeywordDifficulty(integrationId: string, keywords: string[], database: string = 'us'): Promise<{ [keyword: string]: SEOToolData }> {
    const response = await fetch(`${this.baseUrl}/semrush/${integrationId}/keyword-difficulty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords, database })
    });
    return response.json();
  }

  async getSEMrushBacklinks(integrationId: string, domain: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/semrush/${integrationId}/backlinks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  }

  // Ahrefs Integration
  async connectAhrefs(apiKey: string): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/ahrefs/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    return response.json();
  }

  async getAhrefsData(integrationId: string, domain: string): Promise<AhrefsData> {
    const response = await fetch(`${this.baseUrl}/ahrefs/${integrationId}/overview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain })
    });
    return response.json();
  }

  async getAhrefsKeywords(integrationId: string, domain: string, limit: number = 100): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ahrefs/${integrationId}/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, limit })
    });
    return response.json();
  }

  async getAhrefsBacklinks(integrationId: string, domain: string, limit: number = 100): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ahrefs/${integrationId}/backlinks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, limit })
    });
    return response.json();
  }

  // Google PageSpeed Insights Integration
  async getPageSpeedInsights(url: string, strategy: 'mobile' | 'desktop' = 'mobile'): Promise<PageSpeedData> {
    const response = await fetch(`${this.baseUrl}/pagespeed/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, strategy })
    });
    return response.json();
  }

  async getBulkPageSpeedInsights(urls: string[]): Promise<{ [url: string]: PageSpeedData }> {
    const response = await fetch(`${this.baseUrl}/pagespeed/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls })
    });
    return response.json();
  }

  // Social Media Integrations
  async connectFacebook(accessToken: string): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/facebook/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken })
    });
    return response.json();
  }

  async getFacebookInsights(integrationId: string, postId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/facebook/${integrationId}/insights/${postId}`);
    return response.json();
  }

  async connectTwitter(accessToken: string, accessTokenSecret: string): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/twitter/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, accessTokenSecret })
    });
    return response.json();
  }

  async getTwitterAnalytics(integrationId: string, tweetId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/twitter/${integrationId}/analytics/${tweetId}`);
    return response.json();
  }

  // Integration Management
  async getThirdPartyIntegrations(): Promise<ThirdPartyIntegration[]> {
    const response = await fetch(`${this.baseUrl}/integrations`);
    return response.json();
  }

  async updateIntegration(id: string, updates: Partial<ThirdPartyIntegration>): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/integrations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  async deleteIntegration(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/integrations/${id}`, {
      method: 'DELETE'
    });
  }

  async testIntegration(id: string): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await fetch(`${this.baseUrl}/integrations/${id}/test`, {
      method: 'POST'
    });
    return response.json();
  }

  // Comprehensive SEO Analysis
  async getComprehensiveSEOAnalysis(productId: string, url: string): Promise<{
    searchConsole: GoogleSearchConsoleData;
    analytics: GoogleAnalyticsData;
    pageSpeed: PageSpeedData;
    semrush?: SEOToolData;
    ahrefs?: AhrefsData;
    recommendations: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/comprehensive-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, url })
    });
    return response.json();
  }

  // Data Syncing and Automation
  async syncAllIntegrations(): Promise<{ [integrationId: string]: { status: string; lastSync: string } }> {
    const response = await fetch(`${this.baseUrl}/sync-all`, {
      method: 'POST'
    });
    return response.json();
  }

  async scheduledDataSync(integrationId: string, schedule: { interval: number; enabled: boolean }): Promise<void> {
    await fetch(`${this.baseUrl}/integrations/${integrationId}/schedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule)
    });
  }

  // Mock data generators
  generateMockSearchConsoleData(): GoogleSearchConsoleData {
    return {
      url: 'https://example.com/product/123',
      clicks: 1250,
      impressions: 15000,
      ctr: 8.33,
      position: 3.2,
      queries: [
        'premium electronics device',
        'best wireless headphones',
        'noise cancelling headphones',
        'bluetooth headphones review'
      ]
    };
  }

  generateMockAnalyticsData(): GoogleAnalyticsData {
    return {
      pageviews: 5420,
      uniquePageviews: 4350,
      bounceRate: 35.5,
      avgTimeOnPage: 145.8,
      conversions: 89,
      conversionRate: 2.05
    };
  }

  generateMockPageSpeedData(): PageSpeedData {
    return {
      desktopScore: 94,
      mobileScore: 87,
      coreWebVitals: {
        lcp: 2.1,
        fid: 85,
        cls: 0.08
      },
      opportunities: [
        {
          title: 'Optimize images',
          description: 'Properly size images to save cellular data and improve load time',
          impact: 'medium',
          savings: 0.8
        },
        {
          title: 'Enable text compression',
          description: 'Text-based resources should be served with compression to minimize network bytes',
          impact: 'low',
          savings: 0.3
        }
      ]
    };
  }

  generateMockSEMrushData(): SEOToolData {
    return {
      difficulty: 68,
      searchVolume: 12000,
      competitorCount: 45,
      suggestions: [
        'wireless bluetooth headphones',
        'noise cancelling earbuds',
        'premium audio devices',
        'professional headphones'
      ],
      backlinks: 156,
      domainAuthority: 72
    };
  }
}

export const thirdPartyService = new ThirdPartyService();

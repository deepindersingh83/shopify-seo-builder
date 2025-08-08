import { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Sync,
  Eye,
  Edit,
  Trash2,
  Activity,
  MoreHorizontal,
  ArrowUpDown,
  Clock,
  Search,
  ExternalLink,
  Zap,
  Shield,
  Filter,
  Star,
  Package,
  FileText,
  BarChart3,
  Target,
  Lightbulb,
  DollarSign,
  Users,
  Globe,
  TrendingDown,
  AlertCircle,
  PieChart,
  LineChart,
  Calendar,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketOpportunity {
  id: string;
  category: string;
  subcategory: string;
  marketSize: number;
  growthRate: number;
  competitionLevel: 'low' | 'medium' | 'high';
  demandTrend: 'rising' | 'stable' | 'declining';
  profitMargin: number;
  entryBarrier: 'low' | 'medium' | 'high';
  seasonality: {
    peak_months: string[];
    low_months: string[];
  };
  topKeywords: {
    keyword: string;
    volume: number;
    difficulty: number;
    trend: number;
  }[];
  estimatedRevenue: number;
  confidence: number;
  lastUpdated: string;
}

interface ProductGap {
  id: string;
  category: string;
  missingProducts: {
    title: string;
    estimatedDemand: number;
    keywordVolume: number;
    competitorCount: number;
    suggestedPrice: number;
    profitPotential: 'high' | 'medium' | 'low';
  }[];
  totalOpportunity: number;
  timeToMarket: number;
  requiredInvestment: number;
}

interface CompetitorAnalysis {
  id: string;
  competitor: string;
  domain: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  pricing: {
    avg_price: number;
    price_range: { min: number; max: number };
    pricing_strategy: string;
  };
  seo_performance: {
    domain_authority: number;
    avg_ranking: number;
    top_keywords: string[];
  };
  product_gaps: string[];
  threat_level: 'low' | 'medium' | 'high';
}

interface TrendAnalysis {
  id: string;
  trend: string;
  category: string;
  momentum: number;
  timeframe: string;
  related_keywords: string[];
  market_impact: 'high' | 'medium' | 'low';
  opportunity_score: number;
  geographic_focus: string[];
  demographic: string;
  prediction: {
    next_3_months: number;
    next_6_months: number;
    next_12_months: number;
  };
}

export function MarketOpportunityAnalysis() {
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [productGaps, setProductGaps] = useState<ProductGap[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockOpportunities: MarketOpportunity[] = [
        {
          id: '1',
          category: 'Electronics',
          subcategory: 'Smart Home Devices',
          marketSize: 45000000,
          growthRate: 23.5,
          competitionLevel: 'medium',
          demandTrend: 'rising',
          profitMargin: 35.8,
          entryBarrier: 'medium',
          seasonality: {
            peak_months: ['Nov', 'Dec', 'Jan'],
            low_months: ['Jun', 'Jul', 'Aug']
          },
          topKeywords: [
            { keyword: 'smart home devices', volume: 74000, difficulty: 65, trend: 15.2 },
            { keyword: 'home automation', volume: 49000, difficulty: 58, trend: 22.1 },
            { keyword: 'IoT devices', volume: 33000, difficulty: 71, trend: 8.9 }
          ],
          estimatedRevenue: 2400000,
          confidence: 87,
          lastUpdated: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          category: 'Fashion',
          subcategory: 'Sustainable Clothing',
          marketSize: 32000000,
          growthRate: 18.7,
          competitionLevel: 'low',
          demandTrend: 'rising',
          profitMargin: 42.3,
          entryBarrier: 'low',
          seasonality: {
            peak_months: ['Mar', 'Apr', 'Sep', 'Oct'],
            low_months: ['Jan', 'Feb']
          },
          topKeywords: [
            { keyword: 'sustainable fashion', volume: 61000, difficulty: 52, trend: 28.4 },
            { keyword: 'eco-friendly clothing', volume: 38000, difficulty: 48, trend: 31.7 },
            { keyword: 'organic cotton', volume: 25000, difficulty: 44, trend: 19.3 }
          ],
          estimatedRevenue: 1850000,
          confidence: 92,
          lastUpdated: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '3',
          category: 'Health & Wellness',
          subcategory: 'Fitness Equipment',
          marketSize: 28000000,
          growthRate: 12.3,
          competitionLevel: 'high',
          demandTrend: 'stable',
          profitMargin: 28.9,
          entryBarrier: 'high',
          seasonality: {
            peak_months: ['Jan', 'Feb', 'Mar'],
            low_months: ['Nov', 'Dec']
          },
          topKeywords: [
            { keyword: 'home gym equipment', volume: 95000, difficulty: 78, trend: 5.1 },
            { keyword: 'resistance bands', volume: 54000, difficulty: 62, trend: 12.8 },
            { keyword: 'yoga accessories', volume: 41000, difficulty: 55, trend: 8.7 }
          ],
          estimatedRevenue: 1200000,
          confidence: 73,
          lastUpdated: new Date(Date.now() - 259200000).toISOString()
        }
      ];

      const mockProductGaps: ProductGap[] = [
        {
          id: '1',
          category: 'Electronics',
          missingProducts: [
            {
              title: 'Voice-Controlled LED Strip Lights',
              estimatedDemand: 15400,
              keywordVolume: 28000,
              competitorCount: 12,
              suggestedPrice: 79.99,
              profitPotential: 'high'
            },
            {
              title: 'Smart Plant Monitoring System',
              estimatedDemand: 8900,
              keywordVolume: 18500,
              competitorCount: 7,
              suggestedPrice: 149.99,
              profitPotential: 'high'
            },
            {
              title: 'Wireless Charging Mouse Pad',
              estimatedDemand: 12300,
              keywordVolume: 22000,
              competitorCount: 15,
              suggestedPrice: 59.99,
              profitPotential: 'medium'
            }
          ],
          totalOpportunity: 890000,
          timeToMarket: 45,
          requiredInvestment: 25000
        },
        {
          id: '2',
          category: 'Fashion',
          missingProducts: [
            {
              title: 'Bamboo Fiber Athletic Wear',
              estimatedDemand: 11200,
              keywordVolume: 31000,
              competitorCount: 9,
              suggestedPrice: 89.99,
              profitPotential: 'high'
            },
            {
              title: 'Recycled Ocean Plastic Shoes',
              estimatedDemand: 7800,
              keywordVolume: 19500,
              competitorCount: 5,
              suggestedPrice: 129.99,
              profitPotential: 'high'
            }
          ],
          totalOpportunity: 650000,
          timeToMarket: 60,
          requiredInvestment: 45000
        }
      ];

      const mockCompetitors: CompetitorAnalysis[] = [
        {
          id: '1',
          competitor: 'TechInnovate Co',
          domain: 'techinnovate.com',
          marketShare: 18.5,
          strengths: ['Strong brand recognition', 'Wide product range', 'Excellent customer service'],
          weaknesses: ['Higher pricing', 'Limited international shipping', 'Slow innovation'],
          pricing: {
            avg_price: 156.78,
            price_range: { min: 29.99, max: 899.99 },
            pricing_strategy: 'Premium positioning'
          },
          seo_performance: {
            domain_authority: 72,
            avg_ranking: 8.3,
            top_keywords: ['smart devices', 'home automation', 'IoT solutions']
          },
          product_gaps: ['Voice assistants under $50', 'Energy monitoring devices', 'Smart security cameras'],
          threat_level: 'high'
        },
        {
          id: '2',
          competitor: 'EcoFashion Hub',
          domain: 'ecofashionhub.com',
          marketShare: 12.3,
          strengths: ['Sustainability focus', 'Loyal customer base', 'Influencer partnerships'],
          weaknesses: ['Limited product variety', 'Higher costs', 'Seasonal fluctuations'],
          pricing: {
            avg_price: 78.45,
            price_range: { min: 25.00, max: 349.99 },
            pricing_strategy: 'Value-based pricing'
          },
          seo_performance: {
            domain_authority: 58,
            avg_ranking: 12.7,
            top_keywords: ['sustainable fashion', 'eco clothing', 'organic materials']
          },
          product_gaps: ['Plus-size sustainable clothing', 'Sustainable activewear', 'Eco-friendly accessories'],
          threat_level: 'medium'
        }
      ];

      const mockTrends: TrendAnalysis[] = [
        {
          id: '1',
          trend: 'AI-Powered Personal Health Monitoring',
          category: 'Health & Technology',
          momentum: 89.5,
          timeframe: 'Next 12 months',
          related_keywords: ['AI health tracker', 'smart wellness', 'personal health AI', 'biometric monitoring'],
          market_impact: 'high',
          opportunity_score: 94,
          geographic_focus: ['North America', 'Europe', 'Asia Pacific'],
          demographic: 'Health-conscious adults 25-55',
          prediction: {
            next_3_months: 15.2,
            next_6_months: 28.7,
            next_12_months: 45.9
          }
        },
        {
          id: '2',
          trend: 'Circular Economy Products',
          category: 'Sustainability',
          momentum: 76.8,
          timeframe: 'Next 18 months',
          related_keywords: ['circular economy', 'upcycled products', 'zero waste', 'refurbished goods'],
          market_impact: 'medium',
          opportunity_score: 82,
          geographic_focus: ['Europe', 'North America'],
          demographic: 'Environmentally conscious consumers',
          prediction: {
            next_3_months: 8.9,
            next_6_months: 18.4,
            next_12_months: 32.1
          }
        }
      ];

      setOpportunities(mockOpportunities);
      setProductGaps(mockProductGaps);
      setCompetitors(mockCompetitors);
      setTrends(mockTrends);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompetitionBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low Competition</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Competition</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Competition</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getProfitPotentialBadge = (potential: string) => {
    switch (potential) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Profit</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Profit</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low Profit</Badge>;
      default:
        return <Badge variant="secondary">{potential}</Badge>;
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Market Opportunity Analysis</h2>
          <p className="text-muted-foreground">Discover untapped markets and growth opportunities</p>
        </div>
        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Market Analysis</DialogTitle>
              <DialogDescription>
                Analyze a specific market segment or product category for opportunities.
              </DialogDescription>
            </DialogHeader>
            <CreateAnalysisForm onCancel={() => setShowAnalysisDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">
              {opportunities.filter(o => o.confidence > 80).length} high-confidence
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(opportunities.reduce((sum, o) => sum + o.estimatedRevenue, 0) / 1000000 * 10) / 10}M
            </div>
            <p className="text-xs text-muted-foreground">
              Total estimated revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Gaps</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productGaps.reduce((sum, gap) => sum + gap.missingProducts.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Identified opportunities
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Trends</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trends.length}</div>
            <p className="text-xs text-muted-foreground">
              Emerging trends tracked
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList>
          <TabsTrigger value="opportunities">Market Opportunities</TabsTrigger>
          <TabsTrigger value="gaps">Product Gaps</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Market Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{opportunity.subcategory}</h3>
                      {getCompetitionBadge(opportunity.competitionLevel)}
                      <Badge variant="outline" className="text-xs">
                        {opportunity.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {opportunity.category} • Market Size: ${(opportunity.marketSize / 1000000).toFixed(1)}M
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Growth Rate:</span>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(opportunity.demandTrend)}
                          <span className="font-medium text-green-600">+{opportunity.growthRate}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profit Margin:</span>
                        <div className="font-medium">{opportunity.profitMargin}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Revenue:</span>
                        <div className="font-medium">${(opportunity.estimatedRevenue / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entry Barrier:</span>
                        <div className="font-medium capitalize">{opportunity.entryBarrier}</div>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Target className="h-4 w-4 mr-2" />
                        Create SEO Strategy
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Analysis
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Top Keywords */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Top Keywords</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {opportunity.topKeywords.slice(0, 3).map((keyword, index) => (
                      <div key={index} className="border rounded p-2 text-sm">
                        <div className="font-medium">{keyword.keyword}</div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{keyword.volume.toLocaleString()} searches</span>
                          <span className="text-green-600">+{keyword.trend}%</span>
                        </div>
                        <div className="mt-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Difficulty</span>
                            <span>{keyword.difficulty}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${keyword.difficulty < 50 ? 'bg-green-500' : keyword.difficulty < 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${keyword.difficulty}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Seasonality */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Seasonality</h4>
                  <div className="flex space-x-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Peak:</span>
                      <span className="ml-2 font-medium">{opportunity.seasonality.peak_months.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Low:</span>
                      <span className="ml-2 font-medium">{opportunity.seasonality.low_months.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Product Gaps Tab */}
        <TabsContent value="gaps" className="space-y-4">
          {productGaps.map((gap) => (
            <Card key={gap.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{gap.category} Product Gaps</h3>
                    <p className="text-sm text-muted-foreground">
                      {gap.missingProducts.length} opportunities • ${(gap.totalOpportunity / 1000).toFixed(0)}K potential
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">Time to Market</div>
                    <div className="font-medium">{gap.timeToMarket} days</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {gap.missingProducts.map((product, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{product.title}</h4>
                        {getProfitPotentialBadge(product.profitPotential)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Est. Demand:</span>
                          <div className="font-medium">{product.estimatedDemand.toLocaleString()}/month</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Keyword Volume:</span>
                          <div className="font-medium">{product.keywordVolume.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Competitors:</span>
                          <div className="font-medium">{product.competitorCount}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Suggested Price:</span>
                          <div className="font-medium">${product.suggestedPrice}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Required Investment:</span>
                    <span className="ml-2 font-medium">${gap.requiredInvestment.toLocaleString()}</span>
                  </div>
                  <Button size="sm">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Create Product Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitors" className="space-y-4">
          {competitors.map((competitor) => (
            <Card key={competitor.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold">{competitor.competitor}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                        <span>{competitor.domain}</span>
                        <span>•</span>
                        <span>{competitor.marketShare}% market share</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    competitor.threat_level === 'low' ? 'outline' :
                    competitor.threat_level === 'medium' ? 'secondary' : 'destructive'
                  } className={getThreatLevelColor(competitor.threat_level)}>
                    {competitor.threat_level} threat
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                    <ul className="space-y-1 text-sm">
                      {competitor.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Weaknesses</h4>
                    <ul className="space-y-1 text-sm">
                      {competitor.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <XCircle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">SEO Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain Authority:</span>
                        <span className="font-medium">{competitor.seo_performance.domain_authority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Ranking:</span>
                        <span className="font-medium">#{competitor.seo_performance.avg_ranking}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Price:</span>
                        <span className="font-medium">${competitor.pricing.avg_price}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Product Gaps (Opportunities)</h4>
                  <div className="flex flex-wrap gap-2">
                    {competitor.product_gaps.map((gap, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {gap}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-4">
          {trends.map((trend) => (
            <Card key={trend.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{trend.trend}</h3>
                      <Badge variant="outline" className="text-xs">
                        {trend.opportunity_score}/100 opportunity score
                      </Badge>
                      <Badge variant={trend.market_impact === 'high' ? 'default' : 'secondary'}>
                        {trend.market_impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trend.category} • {trend.timeframe} • {trend.demographic}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Momentum</div>
                    <div className="text-2xl font-bold text-green-600">{trend.momentum}%</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Related Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {trend.related_keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Geographic Focus</h4>
                    <div className="flex flex-wrap gap-1">
                      {trend.geographic_focus.map((region, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Growth Prediction</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-muted-foreground">3 Months</div>
                      <div className="font-medium text-green-600">+{trend.prediction.next_3_months}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">6 Months</div>
                      <div className="font-medium text-green-600">+{trend.prediction.next_6_months}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">12 Months</div>
                      <div className="font-medium text-green-600">+{trend.prediction.next_12_months}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>AI-Generated Market Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-blue-700 mb-2">Emerging Opportunity Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI has detected a 67% increase in searches for "sustainable electronics" over the past 30 days. 
                    This presents a significant opportunity in the Electronics category with low competition and high profit potential.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Explore Opportunity
                  </Button>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-green-700 mb-2">Seasonal Trend Prediction</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on historical data and current trends, we predict a 45% spike in "home fitness equipment" 
                    searches starting in December. Consider preparing inventory and SEO campaigns now.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-medium text-yellow-700 mb-2">Competitive Gap Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Your top competitor has weak coverage in the "eco-friendly fashion accessories" segment. 
                    This represents a $2.3M revenue opportunity with 78% confidence.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Analyze Competitors
                  </Button>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-purple-700 mb-2">Keyword Opportunity</h4>
                  <p className="text-sm text-muted-foreground">
                    The keyword "smart home security" has 89K monthly searches with only 23% competition. 
                    Creating content around this topic could capture significant organic traffic.
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Create SEO Strategy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateAnalysisForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Analysis Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose analysis type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market_opportunity">Market Opportunity</SelectItem>
            <SelectItem value="product_gap">Product Gap Analysis</SelectItem>
            <SelectItem value="competitor_analysis">Competitor Analysis</SelectItem>
            <SelectItem value="trend_analysis">Trend Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Target Category</Label>
        <Input placeholder="e.g., Electronics, Fashion, Health & Wellness" />
      </div>
      
      <div>
        <Label>Geographic Focus</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="north_america">North America</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Start Analysis
        </Button>
      </DialogFooter>
    </div>
  );
}

export default MarketOpportunityAnalysis;

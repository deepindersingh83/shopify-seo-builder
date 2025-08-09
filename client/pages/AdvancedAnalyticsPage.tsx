import { Layout } from "../components/Layout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Eye,
  Search,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Crown,
  Award,
  Zap,
  Activity,
  PieChart,
  LineChart,
  Globe,
  Shopping,
  Star,
  Clock,
  Percent
} from "lucide-react";

interface ProductPerformance {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  organicTraffic: number;
  organicRevenue: number;
  conversionRate: number;
  averagePosition: number;
  impressions: number;
  clicks: number;
  ctr: number;
  seoScore: number;
  keywordCount: number;
  topKeywords: string[];
  monthlyTrend: "up" | "down" | "stable";
  revenueGrowth: number;
  trafficGrowth: number;
}

interface KeywordCannibalization {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  competingProducts: {
    productId: string;
    productName: string;
    currentPosition: number;
    url: string;
    clicks: number;
    impressions: number;
  }[];
  recommendedAction: "consolidate" | "differentiate" | "redirect" | "monitor";
  impactScore: number;
  potentialTrafficGain: number;
}

interface ROIAttribution {
  id: string;
  channel: "organic_search" | "paid_search" | "social" | "email" | "direct" | "referral";
  productId: string;
  productName: string;
  investment: number;
  revenue: number;
  roi: number;
  conversions: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  attributionModel: "first_click" | "last_click" | "linear" | "time_decay";
  timeFrame: string;
}

interface CompetitorProduct {
  id: string;
  productName: string;
  competitorName: string;
  competitorPrice: number;
  yourPrice: number;
  competitorPosition: number;
  yourPosition: number;
  sharedKeywords: number;
  competitorTraffic: number;
  marketShare: number;
  priceAdvantage: "higher" | "lower" | "similar";
  positionAdvantage: "better" | "worse" | "similar";
}

export default function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Mock product performance data
  const productPerformance: ProductPerformance[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      sku: "WH-PRO-001",
      category: "Electronics",
      price: 199.99,
      organicTraffic: 8450,
      organicRevenue: 28750,
      conversionRate: 4.2,
      averagePosition: 3.2,
      impressions: 125000,
      clicks: 8450,
      ctr: 6.8,
      seoScore: 94,
      keywordCount: 47,
      topKeywords: ["wireless headphones", "noise cancelling headphones", "premium audio"],
      monthlyTrend: "up",
      revenueGrowth: 23.5,
      trafficGrowth: 18.2
    },
    {
      id: "2",
      name: "Ergonomic Office Chair",
      sku: "OC-ERG-002",
      category: "Furniture",
      price: 399.99,
      organicTraffic: 5680,
      organicRevenue: 45600,
      conversionRate: 3.8,
      averagePosition: 5.1,
      impressions: 89000,
      clicks: 5680,
      ctr: 6.4,
      seoScore: 87,
      keywordCount: 32,
      topKeywords: ["ergonomic chair", "office chair", "desk chair"],
      monthlyTrend: "down",
      revenueGrowth: -8.3,
      trafficGrowth: -12.1
    },
    {
      id: "3",
      name: "Sustainable Water Bottle",
      sku: "WB-ECO-003",
      category: "Lifestyle",
      price: 24.99,
      organicTraffic: 12500,
      organicRevenue: 18750,
      conversionRate: 6.1,
      averagePosition: 2.8,
      impressions: 145000,
      clicks: 12500,
      ctr: 8.6,
      seoScore: 91,
      keywordCount: 28,
      topKeywords: ["eco water bottle", "sustainable bottle", "reusable water bottle"],
      monthlyTrend: "up",
      revenueGrowth: 34.7,
      trafficGrowth: 28.9
    }
  ];

  // Mock keyword cannibalization data
  const cannibalizationIssues: KeywordCannibalization[] = [
    {
      id: "1",
      keyword: "wireless headphones",
      searchVolume: 45000,
      difficulty: 72,
      competingProducts: [
        {
          productId: "1",
          productName: "Premium Wireless Headphones",
          currentPosition: 3,
          url: "/products/premium-wireless-headphones",
          clicks: 3200,
          impressions: 58000
        },
        {
          productId: "4",
          productName: "Sports Wireless Earbuds",
          currentPosition: 8,
          url: "/products/sports-wireless-earbuds",
          clicks: 1100,
          impressions: 32000
        },
        {
          productId: "7",
          productName: "Budget Wireless Headphones",
          currentPosition: 12,
          url: "/products/budget-wireless-headphones",
          clicks: 450,
          impressions: 18000
        }
      ],
      recommendedAction: "differentiate",
      impactScore: 85,
      potentialTrafficGain: 2800
    },
    {
      id: "2",
      keyword: "office chair",
      searchVolume: 35000,
      difficulty: 68,
      competingProducts: [
        {
          productId: "2",
          productName: "Ergonomic Office Chair",
          currentPosition: 5,
          url: "/products/ergonomic-office-chair",
          clicks: 2400,
          impressions: 42000
        },
        {
          productId: "5",
          productName: "Executive Office Chair",
          currentPosition: 9,
          url: "/products/executive-office-chair",
          clicks: 980,
          impressions: 25000
        }
      ],
      recommendedAction: "consolidate",
      impactScore: 78,
      potentialTrafficGain: 1850
    }
  ];

  // Mock ROI attribution data
  const roiAttribution: ROIAttribution[] = [
    {
      id: "1",
      channel: "organic_search",
      productId: "1",
      productName: "Premium Wireless Headphones",
      investment: 5800,
      revenue: 28750,
      roi: 395.7,
      conversions: 144,
      averageOrderValue: 199.65,
      customerLifetimeValue: 485.20,
      attributionModel: "last_click",
      timeFrame: "Last 30 days"
    },
    {
      id: "2",
      channel: "paid_search",
      productId: "1",
      productName: "Premium Wireless Headphones",
      investment: 12400,
      revenue: 35600,
      roi: 187.1,
      conversions: 178,
      averageOrderValue: 200.00,
      customerLifetimeValue: 485.20,
      attributionModel: "first_click",
      timeFrame: "Last 30 days"
    },
    {
      id: "3",
      channel: "organic_search",
      productId: "3",
      productName: "Sustainable Water Bottle",
      investment: 2400,
      revenue: 18750,
      roi: 681.3,
      conversions: 750,
      averageOrderValue: 25.00,
      customerLifetimeValue: 78.50,
      attributionModel: "linear",
      timeFrame: "Last 30 days"
    }
  ];

  // Mock competitor data
  const competitorProducts: CompetitorProduct[] = [
    {
      id: "1",
      productName: "Premium Wireless Headphones",
      competitorName: "TechRival",
      competitorPrice: 229.99,
      yourPrice: 199.99,
      competitorPosition: 2,
      yourPosition: 3,
      sharedKeywords: 23,
      competitorTraffic: 12500,
      marketShare: 15.3,
      priceAdvantage: "lower",
      positionAdvantage: "worse"
    },
    {
      id: "2",
      productName: "Ergonomic Office Chair",
      competitorName: "OfficeMax",
      competitorPrice: 349.99,
      yourPrice: 399.99,
      competitorPosition: 4,
      yourPosition: 5,
      sharedKeywords: 18,
      competitorTraffic: 8900,
      marketShare: 22.1,
      priceAdvantage: "higher",
      positionAdvantage: "worse"
    }
  ];

  const getTrendIcon = (trend: string, growth?: number) => {
    if (trend === "up" || (growth && growth > 0)) {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    } else if (trend === "down" || (growth && growth < 0)) {
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "organic_search":
        return <Search className="h-4 w-4 text-green-500" />;
      case "paid_search":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "social":
        return <Users className="h-4 w-4 text-pink-500" />;
      case "email":
        return <Activity className="h-4 w-4 text-purple-500" />;
      case "direct":
        return <Globe className="h-4 w-4 text-orange-500" />;
      case "referral":
        return <ArrowUpRight className="h-4 w-4 text-gray-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "consolidate":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "differentiate":
        return "text-green-600 bg-green-50 border-green-200";
      case "redirect":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "monitor":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getAdvantageColor = (advantage: string) => {
    switch (advantage) {
      case "better":
      case "lower":
        return "text-green-600 bg-green-50";
      case "worse":
      case "higher":
        return "text-red-600 bg-red-50";
      case "similar":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const filteredProducts = productPerformance.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics & Insights</h1>
            <p className="text-muted-foreground mt-2">
              Deep dive into product performance, keyword cannibalization, and ROI attribution
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Custom Dashboard
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organic Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${productPerformance.reduce((sum, p) => sum + p.organicRevenue, 0).toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                +16.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {productPerformance.reduce((sum, p) => sum + p.organicTraffic, 0).toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                +12.8% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average SEO Score</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(productPerformance.reduce((sum, p) => sum + p.seoScore, 0) / productPerformance.length)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                +3.1 from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cannibalization Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cannibalizationIssues.length}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                2 resolved this month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Key Insights & Recommendations
            </CardTitle>
            <CardDescription>AI-powered insights to optimize your product performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Crown className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Top Performer</span>
                </div>
                <div className="text-sm text-green-800 mb-2">
                  "Sustainable Water Bottle" has the highest ROI at 681%. Consider expanding this product line.
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="font-medium text-red-900">Needs Attention</span>
                </div>
                <div className="text-sm text-red-800 mb-2">
                  "Office Chair" traffic down 12%. Check for technical SEO issues or increased competition.
                </div>
                <Button size="sm" variant="outline">Investigate</Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Opportunity</span>
                </div>
                <div className="text-sm text-blue-800 mb-2">
                  Resolve "wireless headphones" cannibalization to gain an estimated 2,800 additional clicks.
                </div>
                <Button size="sm" variant="outline">Fix Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="product-performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="product-performance">Product Performance</TabsTrigger>
            <TabsTrigger value="cannibalization">Keyword Cannibalization</TabsTrigger>
            <TabsTrigger value="roi-attribution">ROI Attribution</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Tracking</TabsTrigger>
            <TabsTrigger value="forecasting">Revenue Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="product-performance" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Analytics</CardTitle>
                <CardDescription>Track organic traffic, revenue, and conversions by product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Traffic</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                        <TableHead>Avg Position</TableHead>
                        <TableHead>SEO Score</TableHead>
                        <TableHead>Growth</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.sku} • ${product.price}
                              </div>
                              <Badge variant="outline">{product.category}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{product.organicTraffic.toLocaleString()}</div>
                              <div className="text-muted-foreground">
                                {product.impressions.toLocaleString()} impressions
                              </div>
                              <div className="text-muted-foreground">
                                {product.ctr}% CTR
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-green-600">
                                ${product.organicRevenue.toLocaleString()}
                              </div>
                              <div className="text-muted-foreground">
                                {product.keywordCount} keywords
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{product.conversionRate}%</span>
                              <Progress value={product.conversionRate} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{product.averagePosition.toFixed(1)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{product.seoScore}</span>
                              <Progress value={product.seoScore} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                {getTrendIcon(product.monthlyTrend, product.trafficGrowth)}
                                <span className={`ml-1 ${product.trafficGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.trafficGrowth >= 0 ? '+' : ''}{product.trafficGrowth.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-muted-foreground">Traffic</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Optimize">
                                <Target className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Keywords">
                                <Search className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Organic revenue performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <LineChart className="h-16 w-16 mr-4" />
                    <div>
                      <div className="font-medium">Revenue Chart</div>
                      <div className="text-sm">Interactive chart would be rendered here</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Distribution</CardTitle>
                  <CardDescription>Organic traffic by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <PieChart className="h-16 w-16 mr-4" />
                    <div>
                      <div className="font-medium">Traffic Distribution</div>
                      <div className="text-sm">Pie chart would be rendered here</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cannibalization" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Found {cannibalizationIssues.length} keyword cannibalization issues that could be affecting your search performance.
                Resolving these could increase traffic by up to {cannibalizationIssues.reduce((sum, issue) => sum + issue.potentialTrafficGain, 0).toLocaleString()} clicks per month.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Keyword Cannibalization Detection</CardTitle>
                <CardDescription>
                  Identify products competing for the same keywords and optimize your content strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cannibalizationIssues.map((issue) => (
                    <div key={issue.id} className="p-6 border rounded-lg space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">"{issue.keyword}"</h3>
                            <Badge className={getActionColor(issue.recommendedAction)}>
                              {issue.recommendedAction.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                            <span>
                              <Search className="h-4 w-4 inline mr-1" />
                              {issue.searchVolume.toLocaleString()} monthly searches
                            </span>
                            <span>
                              <Target className="h-4 w-4 inline mr-1" />
                              Difficulty: {issue.difficulty}%
                            </span>
                            <span>
                              <TrendingUp className="h-4 w-4 inline mr-1" />
                              Impact Score: {issue.impactScore}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            +{issue.potentialTrafficGain.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Potential clicks</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Competing Products:</h4>
                        {issue.competingProducts.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium">{product.productName}</div>
                              <div className="text-sm text-muted-foreground">{product.url}</div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">Position #{product.currentPosition}</div>
                              <div className="text-muted-foreground">
                                {product.clicks.toLocaleString()} clicks
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Recommended Action: <strong className="capitalize">{issue.recommendedAction.replace("_", " ")}</strong>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm">Apply Fix</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roi-attribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Attribution Analysis</CardTitle>
                <CardDescription>
                  Track revenue attribution across different marketing channels and attribution models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Channel</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Investment</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>ROI</TableHead>
                        <TableHead>Conversions</TableHead>
                        <TableHead>AOV</TableHead>
                        <TableHead>CLV</TableHead>
                        <TableHead>Attribution Model</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roiAttribution.map((attribution) => (
                        <TableRow key={attribution.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getChannelIcon(attribution.channel)}
                              <Badge variant="outline" className="ml-2 capitalize">
                                {attribution.channel.replace("_", " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{attribution.productName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-red-600">
                              ${attribution.investment.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-green-600">
                              ${attribution.revenue.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`text-sm font-bold ${attribution.roi >= 200 ? 'text-green-600' : attribution.roi >= 100 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {attribution.roi.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{attribution.conversions}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">${attribution.averageOrderValue.toFixed(2)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">${attribution.customerLifetimeValue.toFixed(2)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {attribution.attributionModel.replace("_", " ")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel ROI Comparison</CardTitle>
                  <CardDescription>Return on investment by channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["organic_search", "paid_search", "social", "email"].map((channel) => {
                      const channelData = roiAttribution.filter(r => r.channel === channel);
                      const avgROI = channelData.length > 0 
                        ? channelData.reduce((sum, r) => sum + r.roi, 0) / channelData.length 
                        : 0;
                      
                      return (
                        <div key={channel} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              {getChannelIcon(channel)}
                              <span className="ml-2 capitalize">{channel.replace("_", " ")}</span>
                            </div>
                            <span className="font-medium">{avgROI.toFixed(1)}% ROI</span>
                          </div>
                          <Progress value={Math.min(avgROI / 5, 100)} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attribution Models</CardTitle>
                  <CardDescription>Compare different attribution approaches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["first_click", "last_click", "linear", "time_decay"].map((model) => {
                      const modelData = roiAttribution.filter(r => r.attributionModel === model);
                      const totalRevenue = modelData.reduce((sum, r) => sum + r.revenue, 0);
                      
                      return (
                        <div key={model} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{model.replace("_", " ")}</span>
                          <div className="text-right">
                            <div className="font-medium">${totalRevenue.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{modelData.length} products</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(roiAttribution.reduce((sum, r) => sum + r.roi, 0) / roiAttribution.length)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Average ROI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(roiAttribution.reduce((sum, r) => sum + r.averageOrderValue, 0) / roiAttribution.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Order Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {roiAttribution.reduce((sum, r) => sum + r.conversions, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Conversions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="competitor-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Product Tracking</CardTitle>
                <CardDescription>
                  Monitor competitor pricing, rankings, and market share for your key products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Competitor</TableHead>
                        <TableHead>Pricing</TableHead>
                        <TableHead>Ranking</TableHead>
                        <TableHead>Shared Keywords</TableHead>
                        <TableHead>Market Share</TableHead>
                        <TableHead>Competitive Advantage</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitorProducts.map((competitor) => (
                        <TableRow key={competitor.id}>
                          <TableCell>
                            <div className="font-medium">{competitor.productName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{competitor.competitorName}</div>
                            <div className="text-sm text-muted-foreground">
                              {competitor.competitorTraffic.toLocaleString()} traffic
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">Theirs:</span>
                                <span className="font-medium">${competitor.competitorPrice}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">Yours:</span>
                                <span className="font-medium">${competitor.yourPrice}</span>
                              </div>
                              <Badge className={getAdvantageColor(competitor.priceAdvantage)} variant="outline">
                                {competitor.priceAdvantage}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">Theirs:</span>
                                <span className="font-medium">#{competitor.competitorPosition}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">Yours:</span>
                                <span className="font-medium">#{competitor.yourPosition}</span>
                              </div>
                              <Badge className={getAdvantageColor(competitor.positionAdvantage)} variant="outline">
                                {competitor.positionAdvantage}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{competitor.sharedKeywords}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{competitor.marketShare}%</span>
                              <Progress value={competitor.marketShare} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Badge className={getAdvantageColor(competitor.priceAdvantage)} variant="outline">
                                  Price {competitor.priceAdvantage}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge className={getAdvantageColor(competitor.positionAdvantage)} variant="outline">
                                  Rank {competitor.positionAdvantage}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="View Analysis">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Price Alert">
                                <DollarSign className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Track Keywords">
                                <Search className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecasting</CardTitle>
                <CardDescription>
                  AI-powered predictions for product performance and revenue growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">3-Month Revenue Forecast</h4>
                    <div className="space-y-3">
                      {productPerformance.slice(0, 3).map((product) => {
                        const forecastGrowth = product.revenueGrowth * 0.8; // Conservative forecast
                        const forecastRevenue = product.organicRevenue * (1 + forecastGrowth / 100);
                        
                        return (
                          <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Current: ${product.organicRevenue.toLocaleString()}/month
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                ${forecastRevenue.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {forecastGrowth >= 0 ? '+' : ''}{forecastGrowth.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Growth Opportunities</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="font-medium text-blue-900">Keyword Optimization</div>
                        <div className="text-sm text-blue-800">Potential +$15,400/month revenue</div>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <div className="font-medium text-green-900">Content Enhancement</div>
                        <div className="text-sm text-green-800">Potential +$8,200/month revenue</div>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                        <div className="font-medium text-purple-900">Technical SEO</div>
                        <div className="text-sm text-purple-800">Potential +$5,900/month revenue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

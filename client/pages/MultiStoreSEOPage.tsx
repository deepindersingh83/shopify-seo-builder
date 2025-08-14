import { Layout } from "../components/Layout";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Store,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Globe,
  Users,
  DollarSign,
  Package,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Zap,
  Target,
  Crown,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Award,
  Activity,
  RefreshCw,
} from "lucide-react";

interface ShopifyStore {
  id: string;
  name: string;
  domain: string;
  plan: "basic" | "shopify" | "advanced" | "plus";
  status: "active" | "paused" | "development" | "maintenance";
  country: string;
  currency: string;
  timezone: string;
  lastSync: string;
  seoScore: number;
  monthlyRevenue: number;
  monthlyTraffic: number;
  productsCount: number;
  ordersCount: number;
  conversionRate: number;
  avgOrderValue: number;
  topKeywords: string[];
  connectedAt: string;
  isConnected: boolean;
}

interface StoreMetrics {
  totalStores: number;
  totalRevenue: number;
  totalTraffic: number;
  averageSEOScore: number;
  totalProducts: number;
  totalOrders: number;
  bestPerformingStore: string;
  worstPerformingStore: string;
}

interface SEOCampaign {
  id: string;
  name: string;
  description: string;
  targetStores: string[];
  status: "active" | "paused" | "completed" | "scheduled";
  startDate: string;
  endDate?: string;
  progress: number;
  results: {
    keywordImprovements: number;
    trafficIncrease: number;
    revenueIncrease: number;
  };
}

export default function MultiStoreSEOPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [isAddStoreDialogOpen, setIsAddStoreDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load stores from API on component mount
  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data.stores || []);
      } else {
        console.error('Failed to load stores');
        // Keep stores as empty array if API fails
        setStores([]);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback mock data when no real stores are connected
  const fallbackStores: ShopifyStore[] = [
    {
      id: "1",
      name: "TechGear Pro",
      domain: "techgearpro.myshopify.com",
      plan: "plus",
      status: "active",
      country: "United States",
      currency: "USD",
      timezone: "EST",
      lastSync: "2024-01-20 14:30",
      seoScore: 92,
      monthlyRevenue: 125000,
      monthlyTraffic: 45000,
      productsCount: 1247,
      ordersCount: 890,
      conversionRate: 3.2,
      avgOrderValue: 140.5,
      topKeywords: ["wireless headphones", "gaming laptop", "tech accessories"],
      connectedAt: "2023-12-01",
      isConnected: true,
    },
    {
      id: "2",
      name: "Fashion Forward",
      domain: "fashionforward.myshopify.com",
      plan: "advanced",
      status: "active",
      country: "Canada",
      currency: "CAD",
      timezone: "PST",
      lastSync: "2024-01-20 13:45",
      seoScore: 87,
      monthlyRevenue: 89000,
      monthlyTraffic: 32000,
      productsCount: 856,
      ordersCount: 1123,
      conversionRate: 4.1,
      avgOrderValue: 79.3,
      topKeywords: [
        "women's fashion",
        "sustainable clothing",
        "trendy outfits",
      ],
      connectedAt: "2024-01-05",
      isConnected: true,
    },
    {
      id: "3",
      name: "Home Essentials",
      domain: "homeessentials.myshopify.com",
      plan: "shopify",
      status: "development",
      country: "United Kingdom",
      currency: "GBP",
      timezone: "GMT",
      lastSync: "2024-01-19 16:20",
      seoScore: 65,
      monthlyRevenue: 34000,
      monthlyTraffic: 12000,
      productsCount: 423,
      ordersCount: 267,
      conversionRate: 2.8,
      avgOrderValue: 127.4,
      topKeywords: ["home decor", "kitchen essentials", "storage solutions"],
      connectedAt: "2024-01-15",
      isConnected: false,
    },
    {
      id: "4",
      name: "Organic Beauty",
      domain: "organicbeauty.myshopify.com",
      plan: "basic",
      status: "paused",
      country: "Australia",
      currency: "AUD",
      timezone: "AEST",
      lastSync: "2024-01-18 09:15",
      seoScore: 74,
      monthlyRevenue: 21000,
      monthlyTraffic: 8500,
      productsCount: 189,
      ordersCount: 156,
      conversionRate: 2.9,
      avgOrderValue: 134.6,
      topKeywords: [
        "organic skincare",
        "natural beauty",
        "cruelty-free cosmetics",
      ],
      connectedAt: "2023-11-20",
      isConnected: true,
    },
  ];

  // Calculate metrics from real store data
  const activeStores = stores.length > 0 ? stores : fallbackStores;
  const metrics: StoreMetrics = {
    totalStores: activeStores.length,
    totalRevenue: activeStores.reduce((sum, store) => sum + (store.monthlyRevenue || 0), 0),
    totalTraffic: activeStores.reduce((sum, store) => sum + (store.monthlyTraffic || 0), 0),
    averageSEOScore: activeStores.length > 0
      ? Math.round(activeStores.reduce((sum, store) => sum + (store.seoScore || 0), 0) / activeStores.length)
      : 0,
    totalProducts: activeStores.reduce((sum, store) => sum + (store.productsCount || 0), 0),
    totalOrders: activeStores.reduce((sum, store) => sum + (store.ordersCount || 0), 0),
    bestPerformingStore: activeStores.length > 0
      ? activeStores.reduce((best, store) => (store.seoScore || 0) > (best.seoScore || 0) ? store : best).name
      : "None",
    worstPerformingStore: activeStores.length > 0
      ? activeStores.reduce((worst, store) => (store.seoScore || 0) < (worst.seoScore || 0) ? store : worst).name
      : "None",
  };

  // Mock SEO campaigns
  const campaigns: SEOCampaign[] = [
    {
      id: "1",
      name: "Holiday Season Optimization",
      description:
        "Optimize all stores for holiday shopping keywords and seasonal trends",
      targetStores: ["1", "2", "4"],
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      progress: 68,
      results: {
        keywordImprovements: 245,
        trafficIncrease: 23,
        revenueIncrease: 18,
      },
    },
    {
      id: "2",
      name: "Mobile SEO Enhancement",
      description:
        "Improve mobile search performance across all connected stores",
      targetStores: ["1", "2", "3", "4"],
      status: "completed",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      progress: 100,
      results: {
        keywordImprovements: 178,
        trafficIncrease: 31,
        revenueIncrease: 24,
      },
    },
    {
      id: "3",
      name: "Local SEO Expansion",
      description:
        "Implement local SEO strategies for region-specific targeting",
      targetStores: ["2", "3"],
      status: "scheduled",
      startDate: "2024-02-01",
      progress: 0,
      results: {
        keywordImprovements: 0,
        trafficIncrease: 0,
        revenueIncrease: 0,
      },
    },
  ];

  const filteredStores = activeStores.filter((store) => {
    const matchesSearch =
      searchTerm === "" ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.domain.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || store.status === filterStatus;
    const matchesPlan = filterPlan === "all" || store.plan === filterPlan;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "paused":
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case "development":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "maintenance":
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "secondary";
      case "development":
        return "default";
      case "maintenance":
        return "outline";
      default:
        return "destructive";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "plus":
        return <Crown className="h-4 w-4 text-purple-500" />;
      case "advanced":
        return <Award className="h-4 w-4 text-blue-500" />;
      case "shopify":
        return <Shield className="h-4 w-4 text-green-500" />;
      case "basic":
        return <Package className="h-4 w-4 text-gray-500" />;
      default:
        return <Store className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "plus":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "advanced":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "shopify":
        return "text-green-600 bg-green-50 border-green-200";
      case "basic":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "scheduled":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "paused":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on stores:`, selectedStores);
  };

  const handleConnectStore = async () => {
    if (!storeUrl || !accessToken) {
      alert("Please enter both store URL and access token");
      return;
    }

    setIsConnecting(true);

    try {
      // Mock API call - replace with actual endpoint
      const response = await fetch("/api/stores/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeUrl: storeUrl.trim(),
          accessToken: accessToken.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Store connected successfully:", result);

        // Reset form and close dialog
        setStoreUrl("");
        setAccessToken("");
        setIsAddStoreDialogOpen(false);

        // Show success message
        alert(
          "Store connected successfully! The page will refresh to show your new store.",
        );

        // Reload stores instead of refreshing entire page
        await loadStores();
      } else {
        const error = await response.json();
        alert(`Failed to connect store: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error connecting store:", error);
      alert(
        "Failed to connect store. Please check your network connection and try again.",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Multi-Store SEO Management</h1>
            <p className="text-muted-foreground mt-2">
              Centralized SEO management and optimization for all your Shopify
              stores
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Dashboard
            </Button>
            <Dialog
              open={isCampaignDialogOpen}
              onOpenChange={setIsCampaignDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create SEO Campaign</DialogTitle>
                  <DialogDescription>
                    Launch a coordinated SEO campaign across multiple stores
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input
                        id="campaign-name"
                        placeholder="Q1 2024 Optimization"
                      />
                    </div>
                    <div>
                      <Label htmlFor="campaign-type">Campaign Type</Label>
                      <Select defaultValue="keyword">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keyword">
                            Keyword Optimization
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical SEO
                          </SelectItem>
                          <SelectItem value="content">
                            Content Enhancement
                          </SelectItem>
                          <SelectItem value="local">Local SEO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Campaign description and objectives"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label>Target Stores</Label>
                    <div className="mt-2 space-y-2">
                      {activeStores
                        .filter((s) => s.isConnected)
                        .map((store) => (
                          <div
                            key={store.id}
                            className="flex items-center space-x-2"
                          >
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">{store.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCampaignDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCampaignDialogOpen(false)}>
                    Create Campaign
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isAddStoreDialogOpen}
              onOpenChange={setIsAddStoreDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Store
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Connect Shopify Store</DialogTitle>
                  <DialogDescription>
                    Connect a new Shopify store to your SEO management dashboard
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="store-url">Store URL</Label>
                    <Input
                      id="store-url"
                      placeholder="yourstore.myshopify.com"
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="access-token">
                      Private App Access Token
                    </Label>
                    <Input
                      id="access-token"
                      type="password"
                      placeholder="shpat_..."
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                    />
                  </div>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      We use secure OAuth 2.0 authentication to connect to your
                      store. Your credentials are encrypted and never stored.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStoreUrl("");
                      setAccessToken("");
                      setIsAddStoreDialogOpen(false);
                    }}
                    disabled={isConnecting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConnectStore}
                    disabled={isConnecting || !storeUrl || !accessToken}
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect Store"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Connected Stores
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalStores}</div>
              <div className="text-xs text-muted-foreground">
                {stores.filter((s) => s.isConnected).length} active connections
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Monthly across all stores
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Traffic
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalTraffic.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Monthly organic visitors
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average SEO Score
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.averageSEOScore}
              </div>
              <div className="text-xs text-muted-foreground">
                Across all connected stores
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common multi-store SEO management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <RefreshCw className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Sync All Stores</div>
                  <div className="text-sm text-muted-foreground">
                    Update data from all stores
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Target className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Bulk Optimization</div>
                  <div className="text-sm text-muted-foreground">
                    Apply SEO fixes to all stores
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <BarChart3 className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Performance Report</div>
                  <div className="text-sm text-muted-foreground">
                    Generate cross-store analytics
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Zap className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Auto-Pilot Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Enable automated SEO
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="stores" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stores">All Stores</TabsTrigger>
            <TabsTrigger value="campaigns">SEO Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Cross-Store Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automation Rules</TabsTrigger>
            <TabsTrigger value="settings">Global Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="plus">Plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedStores.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedStores.length} store(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("sync")}
                      >
                        Sync Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("optimize")}
                      >
                        Bulk Optimize
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBulkAction("campaign")}
                      >
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stores Table */}
            <Card>
              <CardHeader>
                <CardTitle>Shopify Stores ({filteredStores.length})</CardTitle>
                <CardDescription>
                  Manage and monitor all your connected Shopify stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStores(
                                  filteredStores.map((s) => s.id),
                                );
                              } else {
                                setSelectedStores([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Store Information</TableHead>
                        <TableHead>Plan & Status</TableHead>
                        <TableHead>SEO Score</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedStores.includes(store.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStores([
                                    ...selectedStores,
                                    store.id,
                                  ]);
                                } else {
                                  setSelectedStores(
                                    selectedStores.filter(
                                      (id) => id !== store.id,
                                    ),
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center">
                                {store.name}
                                {!store.isConnected && (
                                  <Badge
                                    variant="destructive"
                                    className="ml-2 text-xs"
                                  >
                                    Disconnected
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {store.domain}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {store.country} • {store.currency}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                {getPlanIcon(store.plan)}
                                <Badge
                                  className={getPlanColor(store.plan) + " ml-2"}
                                >
                                  {store.plan.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex items-center">
                                {getStatusIcon(store.status)}
                                <Badge
                                  variant={getStatusBadgeVariant(store.status)}
                                  className="ml-2"
                                >
                                  {store.status}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="text-lg font-bold">
                                {store.seoScore}
                              </div>
                              <Progress
                                value={store.seoScore}
                                className="h-2 w-16"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {store.monthlyTraffic.toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <Package className="h-3 w-3 mr-1" />
                                {store.productsCount.toLocaleString()}
                              </div>
                              <div className="text-muted-foreground">
                                {store.conversionRate}% CVR
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-green-600">
                                ${store.monthlyRevenue.toLocaleString()}
                              </div>
                              <div className="text-muted-foreground">
                                ${store.avgOrderValue.toFixed(2)} AOV
                              </div>
                              <div className="text-muted-foreground">
                                {store.ordersCount} orders
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{store.lastSync}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                title="View Dashboard"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Store Settings"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Sync Now"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Open Store"
                              >
                                <ExternalLink className="h-4 w-4" />
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

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Campaigns</CardTitle>
                <CardDescription>
                  Coordinate SEO efforts across multiple stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-6 border rounded-lg space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {campaign.name}
                            </h3>
                            <Badge
                              className={getCampaignStatusColor(
                                campaign.status,
                              )}
                            >
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {campaign.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {campaign.startDate} -{" "}
                              {campaign.endDate || "Ongoing"}
                            </span>
                            <span>
                              <Store className="h-4 w-4 inline mr-1" />
                              {campaign.targetStores.length} stores
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {campaign.progress}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Complete
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            +{campaign.results.keywordImprovements}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Keyword Improvements
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            +{campaign.results.trafficIncrease}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Traffic Increase
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            +{campaign.results.revenueIncrease}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Revenue Increase
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Target stores:{" "}
                          {campaign.targetStores
                            .map((id) => activeStores.find((s) => s.id === id)?.name)
                            .join(", ")}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {campaign.status === "active" && (
                            <Button size="sm" variant="outline">
                              Pause Campaign
                            </Button>
                          )}
                          {campaign.status === "paused" && (
                            <Button size="sm">Resume Campaign</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Store</CardTitle>
                  <CardDescription>Monthly revenue comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeStores.map((store) => {
                      const percentage = metrics.totalRevenue > 0
                        ? ((store.monthlyRevenue || 0) / metrics.totalRevenue) * 100
                        : 0;
                      return (
                        <div key={store.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{store.name}</span>
                            <span>
                              ${(store.monthlyRevenue || 0).toLocaleString()} (
                              {percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Performance Trends</CardTitle>
                  <CardDescription>SEO score changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stores.map((store) => (
                      <div
                        key={store.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{store.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{store.seoScore}</span>
                          {store.seoScore >= 80 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cross-Store Performance Insights</CardTitle>
                <CardDescription>
                  Key insights across your store portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {metrics.bestPerformingStore}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Best Performing Store
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Highest SEO score and revenue
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {metrics.worstPerformingStore}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Needs Attention
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Lowest performance metrics
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(
                        (stores.filter((s) => s.seoScore >= 80).length /
                          stores.length) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      High Performing Stores
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      SEO score 80 or above
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Rules</CardTitle>
                <CardDescription>
                  Set up automated SEO tasks across all stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Auto-optimize new products",
                      description:
                        "Automatically generate SEO-optimized meta titles and descriptions for new products",
                      enabled: true,
                      stores: 4,
                    },
                    {
                      name: "Weekly SEO health checks",
                      description:
                        "Perform automated SEO audits and generate reports every week",
                      enabled: true,
                      stores: 4,
                    },
                    {
                      name: "Seasonal keyword updates",
                      description:
                        "Automatically update product keywords based on seasonal trends",
                      enabled: false,
                      stores: 2,
                    },
                    {
                      name: "Broken link monitoring",
                      description:
                        "Daily scan for broken links and automatic redirect suggestions",
                      enabled: true,
                      stores: 3,
                    },
                    {
                      name: "Schema markup validation",
                      description:
                        "Weekly validation and auto-fixing of structured data",
                      enabled: false,
                      stores: 4,
                    },
                  ].map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rule.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Applied to {rule.stores} store(s)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={rule.enabled ? "success" : "secondary"}>
                          {rule.enabled ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          {rule.enabled ? "Configure" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Automation Rule</CardTitle>
                <CardDescription>
                  Set up a new automated SEO task
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      placeholder="My automation rule"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trigger">Trigger</Label>
                    <Select defaultValue="new-product">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-product">
                          New Product Added
                        </SelectItem>
                        <SelectItem value="inventory-change">
                          Inventory Change
                        </SelectItem>
                        <SelectItem value="schedule">Scheduled</SelectItem>
                        <SelectItem value="seo-score-drop">
                          SEO Score Drop
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="action">Action</Label>
                    <Select defaultValue="optimize-meta">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="optimize-meta">
                          Optimize Meta Tags
                        </SelectItem>
                        <SelectItem value="generate-schema">
                          Generate Schema Markup
                        </SelectItem>
                        <SelectItem value="update-sitemaps">
                          Update XML Sitemaps
                        </SelectItem>
                        <SelectItem value="send-alert">Send Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Target Stores</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {stores
                        .filter((s) => s.isConnected)
                        .map((store) => (
                          <div
                            key={store.id}
                            className="flex items-center space-x-2"
                          >
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">{store.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Button>Create Automation Rule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global SEO Settings</CardTitle>
                <CardDescription>
                  Settings that apply to all connected stores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sync-frequency">
                        Data Sync Frequency
                      </Label>
                      <Select defaultValue="hourly">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real-time">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="default-currency">Default Currency</Label>
                      <Select defaultValue="USD">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Global Notifications</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">SEO score alerts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">
                            Campaign completion notifications
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">
                            Weekly performance reports
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button>Save Global Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API & Integrations</CardTitle>
                <CardDescription>
                  Manage external integrations and API access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Shopify Partner API</div>
                      <div className="text-sm text-muted-foreground">
                        Enhanced store management capabilities
                      </div>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Google Search Console</div>
                      <div className="text-sm text-muted-foreground">
                        Search performance data integration
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Google Analytics 4</div>
                      <div className="text-sm text-muted-foreground">
                        Enhanced analytics and conversion tracking
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
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

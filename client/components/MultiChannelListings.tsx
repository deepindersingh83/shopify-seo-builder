import { useState, useEffect } from "react";
import {
  ShoppingBag,
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
  ExternalLink,
  Zap,
  Shield,
  Search,
  Filter,
  Star,
  Package,
  FileText,
  BarChart3,
  Target,
  DollarSign,
  Users,
  Globe,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  Copy,
  Image,
  MessageSquare,
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
import { Textarea } from "@/components/ui/textarea";

interface Channel {
  id: string;
  name: string;
  type:
    | "amazon"
    | "ebay"
    | "facebook"
    | "google_shopping"
    | "shopify"
    | "etsy"
    | "walmart"
    | "custom";
  status: "connected" | "disconnected" | "error" | "pending";
  credentials: any;
  settings: {
    autoSync: boolean;
    syncInterval: number;
    autoPublish: boolean;
    pricingStrategy: "same" | "markup" | "markdown" | "custom";
    pricingValue: number;
    enableReviews: boolean;
    categoryMapping: boolean;
  };
  stats: {
    totalListings: number;
    activeListings: number;
    pendingListings: number;
    totalSales: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  lastSync?: string;
  fees: {
    listingFee: number;
    sellingFee: number;
    paymentFee: number;
  };
}

interface Listing {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  channels: {
    channelId: string;
    channelName: string;
    status: "active" | "pending" | "rejected" | "paused";
    listingId?: string;
    listingUrl?: string;
    performance: {
      views: number;
      clicks: number;
      sales: number;
      revenue: number;
    };
    seoData: {
      keywords: string[];
      ranking: number;
      visibility: number;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ChannelTemplate {
  channelId: string;
  channelName: string;
  titleTemplate: string;
  descriptionTemplate: string;
  categoryMapping: { [key: string]: string };
  keywordOptimization: {
    primaryKeywords: string[];
    secondaryKeywords: string[];
    titleKeywords: number;
    descriptionKeywords: number;
  };
  imagingRequirements: {
    minImages: number;
    maxImages: number;
    aspectRatio: string;
    minResolution: string;
    allowLifestyle: boolean;
  };
}

interface BulkOperation {
  id: string;
  type:
    | "publish"
    | "update"
    | "pause"
    | "delete"
    | "sync_prices"
    | "sync_inventory";
  channels: string[];
  products: string[];
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  startedAt: string;
  completedAt?: string;
  results: {
    successful: number;
    failed: number;
    errors: string[];
  };
}

export function MultiChannelListings() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [templates, setTemplates] = useState<ChannelTemplate[]>([]);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockChannels: Channel[] = [
        {
          id: "1",
          name: "Amazon Marketplace",
          type: "amazon",
          status: "connected",
          credentials: {
            sellerId: "A1XXXXXXXXXXXXX",
            accessKey: "AKIAXXXXXXXXXXXXX",
            secretKey: "xxxxxxxxxxxxxxxxxx",
            marketplaceId: "ATVPDKIKX0DER",
          },
          settings: {
            autoSync: true,
            syncInterval: 60,
            autoPublish: false,
            pricingStrategy: "markup",
            pricingValue: 15,
            enableReviews: true,
            categoryMapping: true,
          },
          stats: {
            totalListings: 1247,
            activeListings: 1198,
            pendingListings: 49,
            totalSales: 45230,
            conversionRate: 3.8,
            avgOrderValue: 127.5,
          },
          lastSync: new Date(Date.now() - 1800000).toISOString(),
          fees: {
            listingFee: 0,
            sellingFee: 15.0,
            paymentFee: 2.9,
          },
        },
        {
          id: "2",
          name: "eBay Store",
          type: "ebay",
          status: "connected",
          credentials: {
            userId: "testuser_ebay",
            appId: "YourAppId",
            certId: "YourCertId",
            devId: "YourDevId",
          },
          settings: {
            autoSync: true,
            syncInterval: 120,
            autoPublish: true,
            pricingStrategy: "same",
            pricingValue: 0,
            enableReviews: true,
            categoryMapping: true,
          },
          stats: {
            totalListings: 892,
            activeListings: 856,
            pendingListings: 36,
            totalSales: 28940,
            conversionRate: 2.4,
            avgOrderValue: 89.3,
          },
          lastSync: new Date(Date.now() - 3600000).toISOString(),
          fees: {
            listingFee: 0.35,
            sellingFee: 10.0,
            paymentFee: 2.9,
          },
        },
        {
          id: "3",
          name: "Facebook Marketplace",
          type: "facebook",
          status: "connected",
          credentials: {
            pageId: "123456789012345",
            accessToken: "EAAXXXXxxxxxxx",
            catalogId: "987654321098765",
          },
          settings: {
            autoSync: false,
            syncInterval: 240,
            autoPublish: true,
            pricingStrategy: "markdown",
            pricingValue: 5,
            enableReviews: false,
            categoryMapping: false,
          },
          stats: {
            totalListings: 567,
            activeListings: 543,
            pendingListings: 24,
            totalSales: 15680,
            conversionRate: 1.9,
            avgOrderValue: 65.4,
          },
          lastSync: new Date(Date.now() - 7200000).toISOString(),
          fees: {
            listingFee: 0,
            sellingFee: 5.0,
            paymentFee: 2.9,
          },
        },
        {
          id: "4",
          name: "Google Shopping",
          type: "google_shopping",
          status: "disconnected",
          credentials: {
            merchantId: "123456789",
            accountId: "987654321",
          },
          settings: {
            autoSync: false,
            syncInterval: 120,
            autoPublish: false,
            pricingStrategy: "same",
            pricingValue: 0,
            enableReviews: false,
            categoryMapping: true,
          },
          stats: {
            totalListings: 0,
            activeListings: 0,
            pendingListings: 0,
            totalSales: 0,
            conversionRate: 0,
            avgOrderValue: 0,
          },
          fees: {
            listingFee: 0,
            sellingFee: 0,
            paymentFee: 0,
          },
        },
      ];

      const mockListings: Listing[] = [
        {
          id: "1",
          productId: "prod_123",
          title: "Premium Wireless Headphones - Noise Cancelling",
          description:
            "High-quality wireless headphones with active noise cancellation...",
          price: 199.99,
          images: ["https://picsum.photos/400/400?random=1"],
          category: "Electronics > Audio > Headphones",
          channels: [
            {
              channelId: "1",
              channelName: "Amazon",
              status: "active",
              listingId: "B08XXXXXXXXXX",
              listingUrl: "https://amazon.com/dp/B08XXXXXXXXXX",
              performance: {
                views: 15420,
                clicks: 587,
                sales: 23,
                revenue: 4599.77,
              },
              seoData: {
                keywords: [
                  "wireless headphones",
                  "noise cancelling",
                  "bluetooth",
                ],
                ranking: 12,
                visibility: 87,
              },
            },
            {
              channelId: "2",
              channelName: "eBay",
              status: "active",
              listingId: "174XXXXXXXXXX",
              listingUrl: "https://ebay.com/itm/174XXXXXXXXXX",
              performance: {
                views: 8940,
                clicks: 234,
                sales: 12,
                revenue: 2399.88,
              },
              seoData: {
                keywords: ["bluetooth headphones", "wireless audio"],
                ranking: 8,
                visibility: 92,
              },
            },
            {
              channelId: "3",
              channelName: "Facebook",
              status: "pending",
              performance: {
                views: 0,
                clicks: 0,
                sales: 0,
                revenue: 0,
              },
              seoData: {
                keywords: [],
                ranking: 0,
                visibility: 0,
              },
            },
          ],
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];

      const mockBulkOperations: BulkOperation[] = [
        {
          id: "1",
          type: "publish",
          channels: ["1", "2"],
          products: ["prod_123", "prod_124", "prod_125"],
          status: "completed",
          progress: 100,
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3000000).toISOString(),
          results: {
            successful: 5,
            failed: 1,
            errors: ["Product prod_125 rejected due to incomplete data"],
          },
        },
        {
          id: "2",
          type: "sync_prices",
          channels: ["1", "2", "3"],
          products: ["prod_126", "prod_127"],
          status: "running",
          progress: 67,
          startedAt: new Date(Date.now() - 900000).toISOString(),
          results: {
            successful: 2,
            failed: 0,
            errors: [],
          },
        },
      ];

      setChannels(mockChannels);
      setListings(mockListings);
      setBulkOperations(mockBulkOperations);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="outline">
            <XCircle className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "amazon":
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold text-sm">A</span>
          </div>
        );
      case "ebay":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">E</span>
          </div>
        );
      case "facebook":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">F</span>
          </div>
        );
      case "google_shopping":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">G</span>
          </div>
        );
      case "etsy":
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold text-sm">Et</span>
          </div>
        );
      case "walmart":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">W</span>
          </div>
        );
      default:
        return <ShoppingBag className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const handleSync = async (channelId: string) => {
    try {
      console.log("Syncing channel:", channelId);
      // Implementation would go here
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  const handleBulkOperation = async (
    operation: string,
    channelIds: string[],
    productIds: string[],
  ) => {
    try {
      console.log("Bulk operation:", operation, channelIds, productIds);
      // Implementation would go here
    } catch (error) {
      console.error("Bulk operation failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Multi-Channel Listings
          </h2>
          <p className="text-muted-foreground">
            Manage product listings across multiple sales channels
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Bulk Operations
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Operations</DialogTitle>
                <DialogDescription>
                  Perform bulk actions on selected products across multiple
                  channels.
                </DialogDescription>
              </DialogHeader>
              <BulkOperationForm onCancel={() => setShowBulkDialog(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Connect Channel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Connect Sales Channel</DialogTitle>
                <DialogDescription>
                  Connect a new sales channel to expand your reach and boost
                  sales.
                </DialogDescription>
              </DialogHeader>
              <ConnectChannelForm
                onCancel={() => setShowConnectDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Channels
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {channels.filter((c) => c.status === "connected").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {channels.length} total channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {channels
                .reduce((sum, c) => sum + c.stats.activeListings, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {Math.round(
                channels.reduce((sum, c) => sum + c.stats.totalSales, 0),
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Conversion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (channels.reduce((sum, c) => sum + c.stats.conversionRate, 0) /
                  channels.length) *
                  10,
              ) / 10}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-4">
          {channels.map((channel) => (
            <Card key={channel.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getChannelIcon(channel.type)}
                    <div>
                      <h3 className="font-semibold">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {channel.type.replace("_", " ")}
                      </p>
                      {channel.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last synced:{" "}
                          {new Date(channel.lastSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(channel.status)}

                    {channel.settings.autoSync && (
                      <Badge variant="outline" className="text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Auto-sync
                      </Badge>
                    )}

                    {channel.settings.autoPublish && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Auto-publish
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Channel Stats */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Active Listings:
                    </span>
                    <p className="font-medium">
                      {channel.stats.activeListings.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Monthly Sales:
                    </span>
                    <p className="font-medium">
                      ${channel.stats.totalSales.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Conversion Rate:
                    </span>
                    <p className="font-medium">
                      {channel.stats.conversionRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Avg Order Value:
                    </span>
                    <p className="font-medium">
                      ${channel.stats.avgOrderValue}
                    </p>
                  </div>
                </div>

                {/* Pricing Strategy */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Pricing Strategy:
                      </span>
                      <span className="ml-2 font-medium capitalize">
                        {channel.settings.pricingStrategy}
                        {channel.settings.pricingValue > 0 &&
                          ` (+${channel.settings.pricingValue}%)`}
                        {channel.settings.pricingValue < 0 &&
                          ` (${channel.settings.pricingValue}%)`}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Fees:</span>
                      <span className="ml-2 font-medium">
                        {channel.fees.sellingFee}% + {channel.fees.paymentFee}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {channel.status === "connected" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(channel.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-3 w-3 mr-1" />
                        Bulk Upload
                      </Button>
                    </>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Download Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Test Connection
                      </DropdownMenuItem>
                      {channel.status === "connected" ? (
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Disconnect
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reconnect
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {channels.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No channels connected
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Connect to sales channels like Amazon, eBay, and Facebook to
                  start selling your products.
                </p>
                <Button onClick={() => setShowConnectDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Your First Channel
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {listing.category}
                        </p>
                        <div className="text-lg font-bold text-green-600">
                          ${listing.price}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Channel Status */}
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Channel Status:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {listing.channels.map((channelListing, index) => (
                          <div
                            key={index}
                            className="border rounded p-3 text-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {channelListing.channelName}
                              </span>
                              {getStatusBadge(channelListing.status)}
                            </div>

                            {channelListing.status === "active" &&
                              channelListing.listingUrl && (
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Views:
                                    </span>
                                    <span>
                                      {channelListing.performance.views.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Sales:
                                    </span>
                                    <span>
                                      {channelListing.performance.sales}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Revenue:
                                    </span>
                                    <span className="text-green-600 font-medium">
                                      $
                                      {channelListing.performance.revenue.toLocaleString()}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="mt-2 h-6 text-xs"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View Listing
                                  </Button>
                                </div>
                              )}

                            {channelListing.status === "pending" && (
                              <p className="text-xs text-muted-foreground">
                                Awaiting approval...
                              </p>
                            )}

                            {channelListing.status === "rejected" && (
                              <p className="text-xs text-red-600">
                                Rejected - Review required
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Channel Templates</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels
                  .filter((c) => c.status === "connected")
                  .map((channel) => (
                    <div key={channel.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(channel.type)}
                          <div>
                            <h4 className="font-medium">
                              {channel.name} Template
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Optimized for {channel.type.replace("_", " ")}{" "}
                              marketplace
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Title Template:
                          </span>
                          <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                            {"{title}"} - {"{brand}"} | {"{primary_keyword}"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            SEO Keywords:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              Primary
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Secondary
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Long-tail
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkOperations.map((operation) => (
                  <div key={operation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium capitalize">
                          {operation.type.replace("_", " ")} Operation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {operation.products.length} products •{" "}
                          {operation.channels.length} channels
                        </p>
                      </div>
                      {getStatusBadge(operation.status)}
                    </div>

                    {operation.status === "running" && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{operation.progress}%</span>
                        </div>
                        <Progress value={operation.progress} />
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>
                        Started:{" "}
                        {new Date(operation.startedAt).toLocaleString()}
                      </span>
                      {operation.completedAt && (
                        <span>
                          Completed:{" "}
                          {new Date(operation.completedAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {operation.results.successful > 0 ||
                    operation.results.failed > 0 ? (
                      <div className="mt-3 pt-3 border-t text-sm">
                        <div className="flex space-x-4">
                          <span className="text-green-600">
                            ✓ {operation.results.successful} successful
                          </span>
                          {operation.results.failed > 0 && (
                            <span className="text-red-600">
                              ✗ {operation.results.failed} failed
                            </span>
                          )}
                        </div>
                        {operation.results.errors.length > 0 && (
                          <div className="mt-2">
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground">
                                View errors ({operation.results.errors.length})
                              </summary>
                              <div className="mt-1 space-y-1">
                                {operation.results.errors.map(
                                  (error, index) => (
                                    <div key={index} className="text-red-600">
                                      {error}
                                    </div>
                                  ),
                                )}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels
                    .filter((c) => c.status === "connected")
                    .map((channel) => (
                      <div
                        key={channel.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(channel.type)}
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">
                            ${channel.stats.totalSales.toLocaleString()}
                          </div>
                          <div className="text-muted-foreground">
                            {channel.stats.conversionRate}% CVR
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">87%</div>
                    <p className="text-sm text-muted-foreground">
                      Avg SEO Optimization
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Keywords Optimized</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Ranking</span>
                      <span className="font-medium">#8.3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Visibility Score</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConnectChannelForm({ onCancel }: { onCancel: () => void }) {
  const [channelType, setChannelType] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <Label>Channel Type</Label>
        <Select value={channelType} onValueChange={setChannelType}>
          <SelectTrigger>
            <SelectValue placeholder="Choose sales channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amazon">Amazon Marketplace</SelectItem>
            <SelectItem value="ebay">eBay</SelectItem>
            <SelectItem value="facebook">Facebook Marketplace</SelectItem>
            <SelectItem value="google_shopping">Google Shopping</SelectItem>
            <SelectItem value="etsy">Etsy</SelectItem>
            <SelectItem value="walmart">Walmart Marketplace</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {channelType === "amazon" && (
        <div className="space-y-4">
          <div>
            <Label>Seller ID</Label>
            <Input placeholder="A1XXXXXXXXXXXXX" />
          </div>
          <div>
            <Label>Access Key ID</Label>
            <Input placeholder="AKIAXXXXXXXXXXXXX" />
          </div>
          <div>
            <Label>Secret Access Key</Label>
            <Input type="password" placeholder="Your secret key" />
          </div>
          <div>
            <Label>Marketplace ID</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select marketplace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ATVPDKIKX0DER">United States</SelectItem>
                <SelectItem value="A1PA6795UKMFR9">Germany</SelectItem>
                <SelectItem value="A1RKKUPIHCS9HS">Spain</SelectItem>
                <SelectItem value="A13V1IB3VIYZZH">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {channelType === "ebay" && (
        <div className="space-y-4">
          <div>
            <Label>eBay User ID</Label>
            <Input placeholder="your_ebay_username" />
          </div>
          <div>
            <Label>App ID (Client ID)</Label>
            <Input placeholder="YourAppId" />
          </div>
          <div>
            <Label>Dev ID</Label>
            <Input placeholder="YourDevId" />
          </div>
          <div>
            <Label>Cert ID (Client Secret)</Label>
            <Input type="password" placeholder="YourCertId" />
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!channelType}>
          Connect Channel
        </Button>
      </DialogFooter>
    </div>
  );
}

function BulkOperationForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Operation Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="publish">Publish Products</SelectItem>
            <SelectItem value="update">Update Listings</SelectItem>
            <SelectItem value="sync_prices">Sync Prices</SelectItem>
            <SelectItem value="sync_inventory">Sync Inventory</SelectItem>
            <SelectItem value="pause">Pause Listings</SelectItem>
            <SelectItem value="delete">Delete Listings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Select Channels</Label>
        <div className="space-y-2 mt-2">
          {["Amazon", "eBay", "Facebook"].map((channel) => (
            <div key={channel} className="flex items-center space-x-2">
              <input type="checkbox" id={channel} />
              <label htmlFor={channel} className="text-sm">
                {channel}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Products</Label>
        <Textarea
          placeholder="Enter product IDs (one per line) or select from catalog..."
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Start Operation</Button>
      </DialogFooter>
    </div>
  );
}

export default MultiChannelListings;

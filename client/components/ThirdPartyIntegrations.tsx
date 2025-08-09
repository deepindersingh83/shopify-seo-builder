import { useState, useEffect } from "react";
import {
  BarChart3,
  Search,
  TrendingUp,
  Smartphone,
  Globe,
  Share2,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  Activity,
  Eye,
  Download,
  Zap,
  Target,
  Users,
  MousePointer,
  Clock,
  ShoppingCart,
  DollarSign,
  Gauge,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { thirdPartyService } from "@/services/thirdPartyService";
import { ThirdPartyIntegration } from "@shared/workflows";

export function ThirdPartyIntegrations() {
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    loadIntegrations();
    loadDashboardData();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockIntegrations: ThirdPartyIntegration[] = [
        {
          id: "1",
          name: "Google Search Console",
          type: "google_search_console",
          status: "connected",
          credentials: {},
          settings: { autoSync: true, syncInterval: 24 },
          lastSync: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "2",
          name: "Google Analytics 4",
          type: "google_analytics",
          status: "connected",
          credentials: {},
          settings: { autoSync: true, syncInterval: 12 },
          lastSync: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "3",
          name: "Microsoft Clarity",
          type: "microsoft_clarity",
          status: "connected",
          credentials: {},
          settings: { autoSync: true, syncInterval: 12 },
          lastSync: new Date(Date.now() - 5400000).toISOString(),
        },
        {
          id: "4",
          name: "Microsoft Advertising",
          type: "microsoft_ads",
          status: "connected",
          credentials: {},
          settings: { autoSync: true, syncInterval: 24 },
          lastSync: new Date(Date.now() - 9000000).toISOString(),
        },
        {
          id: "5",
          name: "Azure Application Insights",
          type: "azure_insights",
          status: "disconnected",
          credentials: {},
          settings: { autoSync: false, syncInterval: 24 },
        },
        {
          id: "6",
          name: "LinkedIn Ads",
          type: "linkedin_ads",
          status: "connected",
          credentials: {},
          settings: { autoSync: true, syncInterval: 24 },
          lastSync: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: "7",
          name: "SEMrush",
          type: "semrush",
          status: "disconnected",
          credentials: {},
          settings: { autoSync: false, syncInterval: 168 },
        },
        {
          id: "8",
          name: "Ahrefs",
          type: "ahrefs",
          status: "error",
          credentials: {},
          settings: { autoSync: false, syncInterval: 168 },
          lastSync: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "9",
          name: "PageSpeed Insights",
          type: "pagespeed",
          status: "connected",
          credentials: {},
          settings: { autoSync: true, syncInterval: 24 },
          lastSync: new Date(Date.now() - 1800000).toISOString(),
        },
      ];

      setIntegrations(mockIntegrations);
    } catch (error) {
      console.error("Failed to load integrations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Mock dashboard data
      setDashboardData({
        searchConsole: thirdPartyService.generateMockSearchConsoleData(),
        analytics: thirdPartyService.generateMockAnalyticsData(),
        pageSpeed: thirdPartyService.generateMockPageSpeedData(),
        semrush: thirdPartyService.generateMockSEMrushData(),
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
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
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "google_search_console":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Search className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "google_analytics":
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </div>
        );
      case "microsoft_clarity":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
        );
      case "microsoft_ads":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <MousePointer className="h-4 w-4 text-green-600" />
          </div>
        );
      case "azure_insights":
        return (
          <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-cyan-600" />
          </div>
        );
      case "linkedin_ads":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-700" />
          </div>
        );
      case "semrush":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        );
      case "ahrefs":
        return (
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-red-600" />
          </div>
        );
      case "pagespeed":
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Gauge className="h-4 w-4 text-purple-600" />
          </div>
        );
      case "social_media":
        return (
          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
            <Share2 className="h-4 w-4 text-pink-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Globe className="h-4 w-4 text-gray-600" />
          </div>
        );
    }
  };

  const handleConnect = async (service: string, credentials: any) => {
    try {
      console.log("Connecting to", service, credentials);
      await loadIntegrations();
      setShowConnectDialog(false);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      console.log("Syncing integration:", integrationId);
      await loadDashboardData();
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Third-Party Integrations
          </h2>
          <p className="text-muted-foreground">
            Connect with external APIs for comprehensive SEO data
          </p>
        </div>
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Connect Third-Party Service</DialogTitle>
              <DialogDescription>
                Choose a service and provide credentials to access external SEO
                data.
              </DialogDescription>
            </DialogHeader>
            <ConnectServiceForm
              onConnect={handleConnect}
              onCancel={() => setShowConnectDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Services
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter((i) => i.status === "connected").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {integrations.length} total integrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">
              SEO, Analytics & Microsoft platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1h ago</div>
            <p className="text-xs text-muted-foreground">
              Most recent data update
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls Today
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Within rate limits</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search Console Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Search Console
                </CardTitle>
                <Search className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Clicks
                    </span>
                    <span className="text-sm font-medium">
                      {dashboardData.searchConsole?.clicks?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Impressions
                    </span>
                    <span className="text-sm font-medium">
                      {dashboardData.searchConsole?.impressions?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">CTR</span>
                    <span className="text-sm font-medium">
                      {dashboardData.searchConsole?.ctr?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Position
                    </span>
                    <span className="text-sm font-medium">
                      {dashboardData.searchConsole?.position?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Pageviews
                    </span>
                    <span className="text-sm font-medium">
                      {dashboardData.analytics?.pageviews?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Bounce Rate
                    </span>
                    <span className="text-sm font-medium">
                      {dashboardData.analytics?.bounceRate?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Conversions
                    </span>
                    <span className="text-sm font-medium">
                      {dashboardData.analytics?.conversions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Conv. Rate
                    </span>
                    <span className="text-sm font-medium">
                      {dashboardData.analytics?.conversionRate?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PageSpeed Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Page Speed
                </CardTitle>
                <Gauge className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Desktop
                      </span>
                      <span className="text-sm font-medium">
                        {dashboardData.pageSpeed?.desktopScore}
                      </span>
                    </div>
                    <Progress
                      value={dashboardData.pageSpeed?.desktopScore}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        Mobile
                      </span>
                      <span className="text-sm font-medium">
                        {dashboardData.pageSpeed?.mobileScore}
                      </span>
                    </div>
                    <Progress
                      value={dashboardData.pageSpeed?.mobileScore}
                      className="h-2"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>
                      LCP: {dashboardData.pageSpeed?.coreWebVitals?.lcp}s
                    </div>
                    <div>
                      CLS: {dashboardData.pageSpeed?.coreWebVitals?.cls}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => handleSync("all")}
                >
                  <RefreshCw className="h-6 w-6 mb-2" />
                  Sync All Data
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  Configure APIs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getServiceIcon(integration.type)}
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {integration.type.replace(/_/g, " ")}
                      </p>
                      {integration.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last synced:{" "}
                          {new Date(integration.lastSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(integration.status)}

                    {integration.settings?.autoSync && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Auto-sync
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {integration.status === "connected" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(integration.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Data
                      </Button>
                    </>
                  )}

                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>

                  {integration.status !== "connected" && (
                    <Button size="sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {integration.status === "error" ? "Reconnect" : "Connect"}
                    </Button>
                  )}
                </div>

                {/* Service Details */}
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">
                        {integration.type.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto-sync:</span>
                      <p className="font-medium">
                        {integration.settings?.autoSync
                          ? "Enabled"
                          : "Disabled"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interval:</span>
                      <p className="font-medium">
                        {integration.settings?.syncInterval || 0}h
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium capitalize">
                        {integration.status}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span>Search Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboardData.searchConsole?.clicks?.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total Clicks
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardData.searchConsole?.impressions?.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Impressions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average CTR</span>
                      <span className="text-sm font-medium">
                        {dashboardData.searchConsole?.ctr?.toFixed(2)}%
                      </span>
                    </div>
                    <Progress
                      value={dashboardData.searchConsole?.ctr}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Position</span>
                      <span className="text-sm font-medium">
                        {dashboardData.searchConsole?.position?.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={Math.max(
                        0,
                        100 - (dashboardData.searchConsole?.position || 0) * 10,
                      )}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Behavior */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span>User Behavior</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {dashboardData.analytics?.pageviews?.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Pageviews</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboardData.analytics?.uniquePageviews?.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Unique Views
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Bounce Rate</span>
                      <span className="text-sm font-medium">
                        {dashboardData.analytics?.bounceRate?.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={dashboardData.analytics?.bounceRate}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Time on Page</span>
                      <span className="text-sm font-medium">
                        {Math.floor(
                          (dashboardData.analytics?.avgTimeOnPage || 0) / 60,
                        )}
                        m{" "}
                        {Math.round(
                          (dashboardData.analytics?.avgTimeOnPage || 0) % 60,
                        )}
                        s
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Performance Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.pageSpeed?.opportunities?.map(
                  (opportunity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            opportunity.impact === "high"
                              ? "bg-red-500"
                              : opportunity.impact === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {opportunity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {opportunity.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            opportunity.impact === "high"
                              ? "destructive"
                              : opportunity.impact === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {opportunity.impact}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Save {opportunity.savings}s
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4" />
                <p>
                  Global integration settings and API configurations will be
                  available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConnectServiceForm({
  onConnect,
  onCancel,
}: {
  onConnect: (service: string, credentials: any) => void;
  onCancel: () => void;
}) {
  const [service, setService] = useState("");
  const [credentials, setCredentials] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(service, credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Service Type</Label>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger>
            <SelectValue placeholder="Choose service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google_search_console">
              Google Search Console
            </SelectItem>
            <SelectItem value="google_analytics">Google Analytics 4</SelectItem>
            <SelectItem value="microsoft_clarity">Microsoft Clarity</SelectItem>
            <SelectItem value="microsoft_ads">Microsoft Advertising</SelectItem>
            <SelectItem value="azure_insights">Azure Application Insights</SelectItem>
            <SelectItem value="linkedin_ads">LinkedIn Ads</SelectItem>
            <SelectItem value="semrush">SEMrush</SelectItem>
            <SelectItem value="ahrefs">Ahrefs</SelectItem>
            <SelectItem value="facebook">Facebook/Meta</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(service === "semrush" || service === "ahrefs") && (
        <div>
          <Label>API Key</Label>
          <Input
            type="password"
            placeholder="Enter your API key"
            value={credentials.apiKey || ""}
            onChange={(e) =>
              setCredentials({ ...credentials, apiKey: e.target.value })
            }
          />
        </div>
      )}

      {(service === "google_search_console" ||
        service === "google_analytics") && (
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              You'll be redirected to Google to authenticate and grant
              permissions.
            </p>
          </div>
        </div>
      )}

      {(service === "microsoft_clarity" ||
        service === "microsoft_ads" ||
        service === "azure_insights") && (
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              You'll be redirected to Microsoft to authenticate and grant
              permissions to access your {service === "microsoft_clarity" ? "Clarity" :
              service === "microsoft_ads" ? "Advertising" : "Azure"} data.
            </p>
          </div>
        </div>
      )}

      {service === "linkedin_ads" && (
        <div className="space-y-4">
          <div>
            <Label>LinkedIn Access Token</Label>
            <Input
              type="password"
              placeholder="LinkedIn Ads API access token"
              value={credentials.accessToken || ""}
              onChange={(e) =>
                setCredentials({ ...credentials, accessToken: e.target.value })
              }
            />
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Get your access token from LinkedIn Developer Portal under Campaign Manager API.
            </p>
          </div>
        </div>
      )}

      {service === "facebook" && (
        <div>
          <Label>Access Token</Label>
          <Input
            type="password"
            placeholder="Facebook access token"
            value={credentials.accessToken || ""}
            onChange={(e) =>
              setCredentials({ ...credentials, accessToken: e.target.value })
            }
          />
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!service}>
          {service === "google_search_console" || service === "google_analytics"
            ? "Authenticate with Google"
            : "Connect Service"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default ThirdPartyIntegrations;

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
import { IntegrationsTestPanel } from "./IntegrationsTestPanel";
import { showSuccess, showError, showWarning } from "@/hooks/use-notifications";

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
      const response = await fetch('/api/third-party/integrations');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIntegrations(data);
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
      const response = await fetch('/api/third-party/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          credentials,
          settings: { autoSync: true, syncInterval: 24 },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect service');
      }

      const result = await response.json();

      // Show connection result
      if (result.testResult.success) {
        showSuccess(
          `Successfully connected to ${service}!`,
          result.testResult.message
        );
      } else {
        showWarning(
          `Connected with warnings`,
          result.testResult.message
        );
      }

      await loadIntegrations();
      setShowConnectDialog(false);
    } catch (error) {
      console.error("Failed to connect:", error);
      showError(
        'Failed to connect service',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/third-party/integrations/${integrationId}/sync`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync failed');
      }

      const result = await response.json();
      showSuccess(
        'Sync completed!',
        `Processed ${result.recordsProcessed || 0} records. Last sync: ${new Date(result.lastSync).toLocaleString()}`
      );

      await loadIntegrations();
      await loadDashboardData();
    } catch (error) {
      console.error("Sync failed:", error);
      showError(
        'Sync failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const handleDisconnect = async (integrationId: string, integrationName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${integrationName}? This will remove all stored credentials and stop data synchronization.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/third-party/integrations/${integrationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disconnect');
      }

      showSuccess(`Successfully disconnected ${integrationName}`);
      await loadIntegrations();
    } catch (error) {
      console.error("Failed to disconnect:", error);
      showError(
        'Failed to disconnect service',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const handleTestConnection = async (integrationId: string, integrationName: string) => {
    try {
      const response = await fetch(`/api/third-party/integrations/${integrationId}/test`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Test failed');
      }

      const result = await response.json();
      if (result.success) {
        showSuccess(
          `Connection test successful for ${integrationName}!`,
          result.message
        );
      } else {
        showError(
          `Connection test failed for ${integrationName}`,
          result.message
        );
      }

      await loadIntegrations();
    } catch (error) {
      console.error("Test failed:", error);
      alert(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReconnect = async (integrationId: string, integrationName: string) => {
    // For reconnection, we'll use the same connect flow
    setSelectedService(integrations.find(i => i.id === integrationId)?.type || '');
    setShowConnectDialog(true);
  };

  const handleSyncAll = async () => {
    const connectedIntegrations = integrations.filter(i => i.status === 'connected');

    if (connectedIntegrations.length === 0) {
      alert('No connected integrations to sync.');
      return;
    }

    if (!confirm(`Sync data from ${connectedIntegrations.length} connected services? This may take several minutes.`)) {
      return;
    }

    try {
      let totalProcessed = 0;
      let totalErrors = 0;

      for (const integration of connectedIntegrations) {
        try {
          const response = await fetch(`/api/third-party/integrations/${integration.id}/sync`, {
            method: 'POST',
          });

          if (response.ok) {
            const result = await response.json();
            totalProcessed += result.recordsProcessed || 0;
          } else {
            totalErrors++;
          }
        } catch (error) {
          totalErrors++;
        }
      }

      await loadIntegrations();
      await loadDashboardData();

      alert(`✅ Sync completed!
Processed: ${totalProcessed} records
Services synced: ${connectedIntegrations.length}
Errors: ${totalErrors}`);
    } catch (error) {
      console.error('Sync all failed:', error);
      alert('❌ Failed to sync all services. Please try individual sync operations.');
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
          <TabsTrigger value="test">API Test</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Microsoft Clarity Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Microsoft Clarity
                </CardTitle>
                <Eye className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Sessions
                    </span>
                    <span className="text-sm font-medium">8,947</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Dead Clicks
                    </span>
                    <span className="text-sm font-medium">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Rage Clicks
                    </span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Scroll Rate
                    </span>
                    <span className="text-sm font-medium">73.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Microsoft Ads Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Microsoft Ads
                </CardTitle>
                <MousePointer className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Impressions
                    </span>
                    <span className="text-sm font-medium">142,567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Clicks
                    </span>
                    <span className="text-sm font-medium">3,892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">CTR</span>
                    <span className="text-sm font-medium">2.73%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">CPC</span>
                    <span className="text-sm font-medium">$1.24</span>
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
                  onClick={handleSyncAll}
                >
                  <RefreshCw className="h-6 w-6 mb-2" />
                  Sync All Data
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => {
                    const connectedIntegrations = integrations.filter(i => i.status === 'connected');
                    if (connectedIntegrations.length === 0) {
                      alert('No connected integrations to export data from.');
                      return;
                    }
                    alert(`Exporting data from ${connectedIntegrations.length} connected services...`);
                  }}
                >
                  <Download className="h-6 w-6 mb-2" />
                  Export Report
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col"
                  onClick={() => setShowConnectDialog(true)}
                >
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

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestConnection(integration.id, integration.name)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Test Connection
                  </Button>

                  {integration.status === "connected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisconnect(integration.id, integration.name)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Disconnect
                    </Button>
                  )}

                  {integration.status !== "connected" && (
                    <Button
                      size="sm"
                      onClick={() => handleReconnect(integration.id, integration.name)}
                    >
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

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-4">
          <IntegrationsTestPanel />
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!service) {
      errors.service = 'Please select a service type';
    }

    // Service-specific validation
    if (service === 'semrush' || service === 'ahrefs') {
      if (!credentials.apiKey?.trim()) {
        errors.apiKey = 'API key is required';
      }
    }

    if (service === 'linkedin_ads' || service === 'facebook') {
      if (!credentials.accessToken?.trim()) {
        errors.accessToken = 'Access token is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsConnecting(true);
    try {
      await onConnect(service, credentials);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials({ ...credentials, [key]: value });
    // Clear validation error when user starts typing
    if (validationErrors[key]) {
      setValidationErrors({ ...validationErrors, [key]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Service Type</Label>
        <Select value={service} onValueChange={(value) => {
          setService(value);
          setCredentials({});
          setValidationErrors({});
        }}>
          <SelectTrigger className={validationErrors.service ? 'border-red-500' : ''}>
            <SelectValue placeholder="Choose service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google_search_console">
              Google Search Console
            </SelectItem>
            <SelectItem value="google_analytics">Google Analytics 4</SelectItem>
            <SelectItem value="microsoft_clarity">Microsoft Clarity</SelectItem>
            <SelectItem value="microsoft_ads">Microsoft Advertising</SelectItem>
            <SelectItem value="azure_insights">
              Azure Application Insights
            </SelectItem>
            <SelectItem value="linkedin_ads">LinkedIn Ads</SelectItem>
            <SelectItem value="semrush">SEMrush</SelectItem>
            <SelectItem value="ahrefs">Ahrefs</SelectItem>
            <SelectItem value="facebook">Facebook/Meta</SelectItem>
            <SelectItem value="twitter">Twitter/X</SelectItem>
          </SelectContent>
        </Select>
        {validationErrors.service && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.service}</p>
        )}
      </div>

      {(service === "semrush" || service === "ahrefs") && (
        <div>
          <Label>API Key</Label>
          <Input
            type="password"
            placeholder="Enter your API key"
            value={credentials.apiKey || ""}
            onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
            className={validationErrors.apiKey ? 'border-red-500' : ''}
          />
          {validationErrors.apiKey && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.apiKey}</p>
          )}
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
              permissions to access your{" "}
              {service === "microsoft_clarity"
                ? "Clarity"
                : service === "microsoft_ads"
                  ? "Advertising"
                  : "Azure"}{" "}
              data.
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
              onChange={(e) => handleCredentialChange('accessToken', e.target.value)}
              className={validationErrors.accessToken ? 'border-red-500' : ''}
            />
            {validationErrors.accessToken && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.accessToken}</p>
            )}
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Get your access token from LinkedIn Developer Portal under
              Campaign Manager API.
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
            onChange={(e) => handleCredentialChange('accessToken', e.target.value)}
            className={validationErrors.accessToken ? 'border-red-500' : ''}
          />
          {validationErrors.accessToken && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.accessToken}</p>
          )}
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!service || isConnecting}>
          {isConnecting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            service === "google_search_console" || service === "google_analytics"
              ? "Authenticate with Google"
              : service === "microsoft_clarity" ||
                  service === "microsoft_ads" ||
                  service === "azure_insights"
                ? "Authenticate with Microsoft"
                : "Connect Service"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default ThirdPartyIntegrations;

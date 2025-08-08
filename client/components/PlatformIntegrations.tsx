import { useState, useEffect } from "react";
import {
  Store,
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
  ShoppingBag,
  ExternalLink,
  Zap,
  Shield,
  Globe,
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
import { platformService } from "@/services/platformService";
import { PlatformIntegration, SyncHistory } from "@shared/workflows";

export function PlatformIntegrations() {
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([]);
  const [syncHistory, setSyncHistory] = useState<{
    [key: string]: SyncHistory[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [activeSyncs, setActiveSyncs] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      // Using mock data for now
      const mockIntegrations: PlatformIntegration[] = [
        {
          id: "1",
          name: "Main Shopify Store",
          type: "shopify",
          status: "connected",
          credentials: {
            shopifyDomain: "mystore.myshopify.com",
            shopifyAccessToken: "shpat_xxxxxxxxxxxx",
          },
          syncSettings: {
            autoSync: true,
            syncInterval: 60,
            syncFields: ["title", "description", "price", "inventory", "seo"],
            conflictResolution: "newest_wins",
            enableWebhooks: true,
          },
          lastSync: new Date(Date.now() - 1800000).toISOString(),
          syncHistory: [],
        },
        {
          id: "2",
          name: "WooCommerce Store",
          type: "woocommerce",
          status: "disconnected",
          credentials: {
            wooCommerceUrl: "https://mystore.com",
            wooCommerceKey: "ck_xxxxxxxxxxxx",
            wooCommerceSecret: "cs_xxxxxxxxxxxx",
          },
          syncSettings: {
            autoSync: false,
            syncInterval: 120,
            syncFields: ["title", "description", "price"],
            conflictResolution: "manual",
            enableWebhooks: false,
          },
          syncHistory: [],
        },
      ];

      setIntegrations(mockIntegrations);
    } catch (error) {
      console.error("Failed to load integrations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platform: string, credentials: any) => {
    try {
      // Implementation for connecting to platforms
      console.log("Connecting to", platform, credentials);
      await loadIntegrations();
      setShowConnectDialog(false);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleSync = async (
    integrationId: string,
    direction: "import" | "export" | "bidirectional",
  ) => {
    try {
      setActiveSyncs((prev) => ({
        ...prev,
        [integrationId]: { status: "running", progress: 0 },
      }));

      // Simulate sync process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setActiveSyncs((prev) => ({
          ...prev,
          [integrationId]: { ...prev[integrationId], progress: i },
        }));
      }

      setActiveSyncs((prev) => ({
        ...prev,
        [integrationId]: { status: "completed", progress: 100 },
      }));

      // Clear after a short delay
      setTimeout(() => {
        setActiveSyncs((prev) => {
          const { [integrationId]: removed, ...rest } = prev;
          return rest;
        });
      }, 2000);
    } catch (error) {
      console.error("Sync failed:", error);
      setActiveSyncs((prev) => ({
        ...prev,
        [integrationId]: { status: "failed", progress: 0 },
      }));
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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case "shopify":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">S</span>
          </div>
        );
      case "woocommerce":
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">W</span>
          </div>
        );
      case "bigcommerce":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">B</span>
          </div>
        );
      case "magento":
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold text-sm">M</span>
          </div>
        );
      default:
        return <Store className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Platform Integrations
          </h2>
          <p className="text-muted-foreground">
            Connect and sync with your e-commerce platforms
          </p>
        </div>
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Connect E-commerce Platform</DialogTitle>
              <DialogDescription>
                Choose a platform and enter your credentials to start syncing
                products.
              </DialogDescription>
            </DialogHeader>
            <ConnectPlatformForm
              onConnect={handleConnect}
              onCancel={() => setShowConnectDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Platforms
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">
              Auto-Sync Active
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter((i) => i.syncSettings.autoSync).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Platforms with auto-sync enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">
              Most recent synchronization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Webhook Status
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter((i) => i.syncSettings.enableWebhooks).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time sync enabled
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="sync-history">Sync History</TabsTrigger>
          <TabsTrigger value="field-mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          {integrations.map((integration) => {
            const activeSync = activeSyncs[integration.id];

            return (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getPlatformIcon(integration.type)}
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {integration.type.replace("_", " ")}
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

                      {integration.syncSettings.autoSync && (
                        <Badge variant="outline" className="text-xs">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Auto-sync
                        </Badge>
                      )}

                      {integration.syncSettings.enableWebhooks && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Webhooks
                        </Badge>
                      )}
                    </div>
                  </div>

                  {activeSync && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Syncing products...</span>
                        <span>{activeSync.progress}%</span>
                      </div>
                      <Progress value={activeSync.progress} />
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {integration.status === "connected" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSync(integration.id, "import")}
                          disabled={!!activeSync}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Import
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSync(integration.id, "export")}
                          disabled={!!activeSync}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleSync(integration.id, "bidirectional")
                          }
                          disabled={!!activeSync}
                        >
                          <ArrowUpDown className="h-3 w-3 mr-1" />
                          Bi-Sync
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
                          <Activity className="h-4 w-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Test Connection
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Sync
                        </DropdownMenuItem>
                        {integration.status === "connected" ? (
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

                  {/* Integration Details */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Sync Fields:
                        </span>
                        <p className="font-medium">
                          {integration.syncSettings.syncFields.length} fields
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Conflicts:
                        </span>
                        <p className="font-medium capitalize">
                          {integration.syncSettings.conflictResolution.replace(
                            "_",
                            " ",
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Interval:</span>
                        <p className="font-medium">
                          {integration.syncSettings.syncInterval}min
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Domain:</span>
                        <p className="font-medium">
                          {integration.type === "shopify"
                            ? integration.credentials.shopifyDomain
                            : integration.type === "woocommerce"
                              ? new URL(
                                  integration.credentials.wooCommerceUrl || "",
                                ).hostname
                              : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {integrations.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Store className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No platforms connected
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Connect your e-commerce platforms to start syncing products
                  and SEO data.
                </p>
                <Button onClick={() => setShowConnectDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Your First Platform
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sync History Tab */}
        <TabsContent value="sync-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Synchronizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock sync history data */}
                {[
                  {
                    platform: "Shopify",
                    direction: "Import",
                    status: "success",
                    items: 45,
                    time: "2 hours ago",
                    duration: "2m 15s",
                  },
                  {
                    platform: "WooCommerce",
                    direction: "Export",
                    status: "partial",
                    items: 23,
                    time: "1 day ago",
                    duration: "1m 45s",
                  },
                ].map((sync, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          sync.status === "success"
                            ? "bg-green-500"
                            : sync.status === "partial"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">
                          {sync.platform} - {sync.direction}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sync.items} items processed • {sync.duration} •{" "}
                          {sync.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Field Mapping Tab */}
        <TabsContent value="field-mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Map fields between your local product data and platform-specific
                fields.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select a platform to configure field mappings:
                </p>
                <Select
                  value={selectedPlatform}
                  onValueChange={setSelectedPlatform}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrations.map((integration) => (
                      <SelectItem key={integration.id} value={integration.id}>
                        {integration.name} ({integration.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPlatform && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Field Mappings</h4>
                    <div className="space-y-3">
                      {[
                        {
                          local: "title",
                          remote: "title",
                          description: "Product title/name",
                        },
                        {
                          local: "description",
                          remote: "body_html",
                          description: "Product description",
                        },
                        {
                          local: "price",
                          remote: "variants[0].price",
                          description: "Product price",
                        },
                        {
                          local: "inventory",
                          remote: "variants[0].inventory_quantity",
                          description: "Stock quantity",
                        },
                        {
                          local: "sku",
                          remote: "variants[0].sku",
                          description: "SKU identifier",
                        },
                        {
                          local: "metaTitle",
                          remote: "seo.title",
                          description: "SEO meta title",
                        },
                        {
                          local: "metaDescription",
                          remote: "seo.description",
                          description: "SEO meta description",
                        },
                        {
                          local: "handle",
                          remote: "handle",
                          description: "URL handle/slug",
                        },
                        {
                          local: "tags",
                          remote: "tags",
                          description: "Product tags",
                        },
                        {
                          local: "vendor",
                          remote: "vendor",
                          description: "Product vendor/brand",
                        },
                      ].map((mapping, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 gap-4 items-center p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {mapping.local}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {mapping.description}
                            </p>
                          </div>
                          <div className="text-center">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground mx-auto" />
                          </div>
                          <div>
                            <Input
                              value={mapping.remote}
                              placeholder="Platform field name"
                              className="text-sm"
                              readOnly
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reset to Default
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Save Mappings
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Sync Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Global Auto-Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync all connected platforms at regular
                      intervals
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">SEO Data Priority</Label>
                    <p className="text-sm text-muted-foreground">
                      Prioritize SEO field synchronization over other data
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Conflict Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications when sync conflicts occur
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConnectPlatformForm({
  onConnect,
  onCancel,
}: {
  onConnect: (platform: string, credentials: any) => void;
  onCancel: () => void;
}) {
  const [platform, setPlatform] = useState("");
  const [credentials, setCredentials] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(platform, credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Platform Type</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Choose platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shopify">Shopify</SelectItem>
            <SelectItem value="woocommerce">WooCommerce</SelectItem>
            <SelectItem value="bigcommerce">BigCommerce</SelectItem>
            <SelectItem value="magento">Magento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {platform === "shopify" && (
        <div className="space-y-4">
          <div>
            <Label>Store Domain</Label>
            <Input
              placeholder="mystore.myshopify.com"
              value={credentials.domain || ""}
              onChange={(e) =>
                setCredentials({ ...credentials, domain: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Access Token</Label>
            <Input
              type="password"
              placeholder="shpat_..."
              value={credentials.accessToken || ""}
              onChange={(e) =>
                setCredentials({ ...credentials, accessToken: e.target.value })
              }
            />
          </div>
        </div>
      )}

      {platform === "woocommerce" && (
        <div className="space-y-4">
          <div>
            <Label>Store URL</Label>
            <Input
              placeholder="https://yourstore.com"
              value={credentials.url || ""}
              onChange={(e) =>
                setCredentials({ ...credentials, url: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Consumer Key</Label>
            <Input
              placeholder="ck_..."
              value={credentials.consumerKey || ""}
              onChange={(e) =>
                setCredentials({ ...credentials, consumerKey: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Consumer Secret</Label>
            <Input
              type="password"
              placeholder="cs_..."
              value={credentials.consumerSecret || ""}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  consumerSecret: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!platform}>
          Connect Platform
        </Button>
      </DialogFooter>
    </form>
  );
}

export default PlatformIntegrations;

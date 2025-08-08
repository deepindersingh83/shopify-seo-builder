import { useState } from "react";
import { Layout } from "@/components/Layout";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Zap,
  CreditCard,
  Mail,
  Eye,
  EyeOff,
  Key,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
  Info,
  Plus,
  Edit,
  X,
  Save,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface APIIntegration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
  icon: any;
  config: any;
  lastSync?: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [showAPIDialog, setShowAPIDialog] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<APIIntegration | null>(null);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "My Shopify Store",
    siteUrl: "https://mystore.myshopify.com",
    defaultLanguage: "en",
    timezone: "UTC",
    currency: "USD",
    autoBackup: true,
    enableAnalytics: true,
  });

  const [seoSettings, setSeoSettings] = useState({
    autoOptimize: true,
    generateMetaTags: true,
    enableSchemaMarkup: true,
    optimizeImages: true,
    enableSitemap: true,
    enableRobotsTxt: true,
    defaultMetaTitle: "{{product_name}} | {{store_name}}",
    defaultMetaDescription:
      "{{product_description}} - Buy now at {{store_name}}",
    focusKeywordDensity: 2.5,
    maxTitleLength: 60,
    maxDescriptionLength: 160,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    seoAlerts: true,
    workflowNotifications: true,
    weeklyReports: true,
    errorAlerts: true,
    performanceAlerts: true,
    inventoryAlerts: true,
    competitorAlerts: false,
  });

  const [apiIntegrations, setApiIntegrations] = useState<APIIntegration[]>([
    {
      id: "1",
      name: "Google Search Console",
      description: "Monitor search performance and indexing",
      status: "connected",
      icon: Globe,
      config: { siteUrl: "https://mystore.com", verified: true },
      lastSync: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      name: "Google Analytics 4",
      description: "Track website traffic and user behavior",
      status: "connected",
      icon: Database,
      config: { propertyId: "GA4-XXXXXXXXX", trackingId: "G-XXXXXXXXX" },
      lastSync: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "3",
      name: "Semrush",
      description: "Keyword research and competitor analysis",
      status: "disconnected",
      icon: Zap,
      config: {},
    },
    {
      id: "4",
      name: "Ahrefs",
      description: "Backlink analysis and keyword tracking",
      status: "error",
      icon: Shield,
      config: { apiKey: "invalid_key" },
    },
  ]);

  const handleSaveSettings = (section: string) => {
    console.log(`Saving ${section} settings`);
    // Implementation would save to backend
  };

  const handleAPIConnect = (api: APIIntegration) => {
    setSelectedAPI(api);
    setShowAPIDialog(true);
  };

  const handleAPIDisconnect = (apiId: string) => {
    setApiIntegrations((prev) =>
      prev.map((api) =>
        api.id === apiId
          ? { ...api, status: "disconnected" as const, config: {} }
          : api,
      ),
    );
  };

  const renderGeneralSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={generalSettings.siteName}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  siteName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              value={generalSettings.siteUrl}
              onChange={(e) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  siteUrl: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Select
              value={generalSettings.defaultLanguage}
              onValueChange={(value) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  defaultLanguage: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={generalSettings.timezone}
              onValueChange={(value) =>
                setGeneralSettings((prev) => ({ ...prev, timezone: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">Eastern Time</SelectItem>
                <SelectItem value="PST">Pacific Time</SelectItem>
                <SelectItem value="CET">Central European Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={generalSettings.currency}
              onValueChange={(value) =>
                setGeneralSettings((prev) => ({ ...prev, currency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">System Preferences</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup settings daily
                </p>
              </div>
              <Switch
                checked={generalSettings.autoBackup}
                onCheckedChange={(checked) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    autoBackup: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anonymous usage analytics
                </p>
              </div>
              <Switch
                checked={generalSettings.enableAnalytics}
                onCheckedChange={(checked) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    enableAnalytics: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSaveSettings("general")}>
            <Save className="h-4 w-4 mr-2" />
            Save General Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSEOSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>SEO Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Auto-Optimization</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto SEO Optimization</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically optimize new products
                </p>
              </div>
              <Switch
                checked={seoSettings.autoOptimize}
                onCheckedChange={(checked) =>
                  setSeoSettings((prev) => ({ ...prev, autoOptimize: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Generate Meta Tags</Label>
                <p className="text-sm text-muted-foreground">
                  Auto-generate missing meta tags
                </p>
              </div>
              <Switch
                checked={seoSettings.generateMetaTags}
                onCheckedChange={(checked) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    generateMetaTags: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Schema Markup</Label>
                <p className="text-sm text-muted-foreground">
                  Enable structured data generation
                </p>
              </div>
              <Switch
                checked={seoSettings.enableSchemaMarkup}
                onCheckedChange={(checked) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    enableSchemaMarkup: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Image Optimization</Label>
                <p className="text-sm text-muted-foreground">
                  Optimize alt tags and file names
                </p>
              </div>
              <Switch
                checked={seoSettings.optimizeImages}
                onCheckedChange={(checked) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    optimizeImages: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Default Templates</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="defaultMetaTitle">
                Default Meta Title Template
              </Label>
              <Input
                id="defaultMetaTitle"
                value={seoSettings.defaultMetaTitle}
                onChange={(e) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    defaultMetaTitle: e.target.value,
                  }))
                }
                placeholder="{{product_name}} | {{store_name}}"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Available variables: {{ product_name }}, {{ store_name }},{" "}
                {{ category }}, {{ brand }}
              </p>
            </div>
            <div>
              <Label htmlFor="defaultMetaDescription">
                Default Meta Description Template
              </Label>
              <Textarea
                id="defaultMetaDescription"
                value={seoSettings.defaultMetaDescription}
                onChange={(e) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    defaultMetaDescription: e.target.value,
                  }))
                }
                placeholder="{{product_description}} - Buy now at {{store_name}}"
                rows={3}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">SEO Limits</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="keywordDensity">Focus Keyword Density (%)</Label>
              <Input
                id="keywordDensity"
                type="number"
                value={seoSettings.focusKeywordDensity}
                onChange={(e) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    focusKeywordDensity: parseFloat(e.target.value),
                  }))
                }
                min="0.5"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="maxTitleLength">Max Title Length</Label>
              <Input
                id="maxTitleLength"
                type="number"
                value={seoSettings.maxTitleLength}
                onChange={(e) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    maxTitleLength: parseInt(e.target.value),
                  }))
                }
                min="30"
                max="70"
              />
            </div>
            <div>
              <Label htmlFor="maxDescriptionLength">
                Max Description Length
              </Label>
              <Input
                id="maxDescriptionLength"
                type="number"
                value={seoSettings.maxDescriptionLength}
                onChange={(e) =>
                  setSeoSettings((prev) => ({
                    ...prev,
                    maxDescriptionLength: parseInt(e.target.value),
                  }))
                }
                min="120"
                max="200"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSaveSettings("seo")}>
            <Save className="h-4 w-4 mr-2" />
            Save SEO Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Email Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts and updates
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    emailNotifications: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SEO Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alerts for SEO issues and improvements
                </p>
              </div>
              <Switch
                checked={notificationSettings.seoAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    seoAlerts: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Workflow Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Updates on workflow executions
                </p>
              </div>
              <Switch
                checked={notificationSettings.workflowNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    workflowNotifications: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly SEO performance summaries
                </p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    weeklyReports: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Alert Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Error Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Critical system errors and failures
                </p>
              </div>
              <Switch
                checked={notificationSettings.errorAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    errorAlerts: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Performance Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Website performance degradation
                </p>
              </div>
              <Switch
                checked={notificationSettings.performanceAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    performanceAlerts: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Inventory Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Low stock and inventory warnings
                </p>
              </div>
              <Switch
                checked={notificationSettings.inventoryAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    inventoryAlerts: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Competitor Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Competitor analysis updates
                </p>
              </div>
              <Switch
                checked={notificationSettings.competitorAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    competitorAlerts: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSaveSettings("notifications")}>
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAPIIntegrations = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Integrations</CardTitle>
          <Button size="sm" onClick={() => setShowAPIDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiIntegrations.map((api) => (
            <div
              key={api.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <api.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{api.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {api.description}
                  </p>
                  {api.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last sync: {new Date(api.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  variant={
                    api.status === "connected"
                      ? "default"
                      : api.status === "error"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {api.status}
                </Badge>
                {api.status === "connected" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAPIDisconnect(api.id)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleAPIConnect(api)}>
                    {api.status === "error" ? "Reconnect" : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSecurity = () => (
    <Card>
      <CardHeader>
        <CardTitle>Security & Privacy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Account Security</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <Button>
              <Key className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">API Keys</h4>
          <Alert>
            <Key className="h-4 w-4" />
            <AlertTitle>API Key Management</AlertTitle>
            <AlertDescription>
              Your API keys are encrypted and stored securely. Never share your
              API keys publicly.
            </AlertDescription>
          </Alert>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Primary API Key</p>
                <p className="text-sm text-muted-foreground">
                  sk_live_••••••••••••1234
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Data Management</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download all your SEO data
                </p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-muted-foreground">
                  Upload data from another platform
                </p>
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Danger Zone</AlertTitle>
          <AlertDescription>
            <div className="space-y-3">
              <p>
                The following actions are irreversible and will permanently
                delete your data.
              </p>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-4 mb-8">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your SEO Manager configuration
              </p>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="general"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center space-x-2"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="flex items-center space-x-2"
              >
                <Database className="h-4 w-4" />
                <span>APIs</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">{renderGeneralSettings()}</TabsContent>
            <TabsContent value="seo">{renderSEOSettings()}</TabsContent>
            <TabsContent value="notifications">
              {renderNotifications()}
            </TabsContent>
            <TabsContent value="integrations">
              {renderAPIIntegrations()}
            </TabsContent>
            <TabsContent value="security">{renderSecurity()}</TabsContent>
          </Tabs>
        </div>
      </div>

      {/* API Integration Dialog */}
      <Dialog open={showAPIDialog} onOpenChange={setShowAPIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAPI
                ? `Configure ${selectedAPI.name}`
                : "Add API Integration"}
            </DialogTitle>
            <DialogDescription>
              {selectedAPI
                ? selectedAPI.description
                : "Choose an API service to integrate with"}
            </DialogDescription>
          </DialogHeader>

          {selectedAPI ? (
            <div className="space-y-4">
              {selectedAPI.name === "Google Search Console" && (
                <>
                  <div>
                    <Label>Site URL</Label>
                    <Input placeholder="https://yoursite.com" />
                  </div>
                  <div>
                    <Label>Verification Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="html_file">
                          HTML File Upload
                        </SelectItem>
                        <SelectItem value="html_tag">HTML Tag</SelectItem>
                        <SelectItem value="dns">DNS Record</SelectItem>
                        <SelectItem value="google_analytics">
                          Google Analytics
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedAPI.name === "Semrush" && (
                <>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter Semrush API key"
                    />
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      You can find your API key in your Semrush account
                      settings.
                      <Button variant="link" className="p-0 h-auto ml-1">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Get API Key
                      </Button>
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {apiIntegrations
                .filter((api) => api.status === "disconnected")
                .map((api) => (
                  <div
                    key={api.id}
                    className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedAPI(api)}
                  >
                    <api.icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{api.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {api.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAPIDialog(false)}>
              Cancel
            </Button>
            <Button>{selectedAPI ? "Connect" : "Next"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

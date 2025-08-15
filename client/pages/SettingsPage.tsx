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
  Users,
  Crown,
  Building,
  Lock,
  Unlock,
  Copy,
  Search,
  Filter,
  Calendar,
  Clock,
  MessageSquare,
  Webhook,
  Activity,
  BarChart3,
  Smartphone,
  Desktop,
  Server,
  Cloud,
  HardDrive,
  Monitor,
  Cpu,
  Gauge,
  Target,
  TrendingUp,
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface APIIntegration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
  icon: any;
  config: any;
  lastSync?: string;
  category: string;
  rateLimits?: {
    daily: number;
    used: number;
    reset: string;
  };
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  status: "active" | "pending" | "suspended";
  lastActive: string;
  permissions: string[];
}

interface PerformanceProfile {
  id: string;
  name: string;
  description: string;
  maxProducts: number;
  batchSize: number;
  cacheStrategy: string;
  enableVirtualization: boolean;
  lazyLoading: boolean;
  compression: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [showAPIDialog, setShowAPIDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<APIIntegration | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "My Shopify Store",
    siteUrl: "https://mystore.myshopify.com",
    defaultLanguage: "en",
    timezone: "UTC",
    currency: "USD",
    autoBackup: true,
    enableAnalytics: true,
    dataCenterRegion: "us-east-1",
    maintenanceMode: false,
    debugMode: false,
    logLevel: "info",
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
    enableAIOptimization: true,
    contentScoring: true,
    competitorTracking: true,
    autoAltText: true,
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
    slackIntegration: false,
    pushNotifications: true,
    smsAlerts: false,
    webhookNotifications: true,
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    maxProductsPerPage: 50,
    cacheTimeout: 3600,
    enableVirtualization: true,
    lazyLoadImages: true,
    enableCompression: true,
    batchSize: 100,
    maxConcurrentRequests: 10,
    enableCDN: true,
    compressionLevel: 6,
    enablePrefetching: true,
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    host: "localhost",
    port: 3306,
    database: "seo_manager",
    user: "root",
    password: "",
    connectionPoolSize: 10,
    connectionTimeout: 30000,
    enableSSL: false,
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 30,
    enableLogging: true,
    logLevel: "info",
  });

  const [apiIntegrations, setApiIntegrations] = useState<APIIntegration[]>([
    {
      id: "1",
      name: "Google Search Console",
      description: "Monitor search performance and indexing",
      status: "connected",
      icon: Globe,
      category: "Search Analytics",
      config: { siteUrl: "https://mystore.com", verified: true },
      lastSync: new Date(Date.now() - 3600000).toISOString(),
      rateLimits: { daily: 25000, used: 1250, reset: "2024-01-01T00:00:00Z" },
    },
    {
      id: "2",
      name: "Google Analytics 4",
      description: "Track website traffic and user behavior",
      status: "connected",
      icon: BarChart3,
      category: "Analytics",
      config: { propertyId: "GA4-XXXXXXXXX", trackingId: "G-XXXXXXXXX" },
      lastSync: new Date(Date.now() - 1800000).toISOString(),
      rateLimits: { daily: 10000, used: 850, reset: "2024-01-01T00:00:00Z" },
    },
    {
      id: "3",
      name: "Semrush",
      description: "Keyword research and competitor analysis",
      status: "disconnected",
      icon: Zap,
      category: "SEO Tools",
      config: {},
    },
    {
      id: "4",
      name: "Ahrefs",
      description: "Backlink analysis and keyword tracking",
      status: "error",
      icon: Shield,
      category: "SEO Tools",
      config: { apiKey: "invalid_key" },
    },
    {
      id: "5",
      name: "Shopify Admin API",
      description: "Access store data and product information",
      status: "connected",
      icon: Building,
      category: "E-commerce",
      config: {
        storeDomain: "mystore.myshopify.com",
        accessToken: "shpat_...",
      },
      lastSync: new Date(Date.now() - 600000).toISOString(),
      rateLimits: { daily: 40000, used: 3200, reset: "2024-01-01T00:00:00Z" },
    },
    {
      id: "6",
      name: "Slack",
      description: "Send notifications to Slack channels",
      status: "disconnected",
      icon: MessageSquare,
      category: "Communication",
      config: {},
    },
    {
      id: "7",
      name: "Zapier",
      description: "Automate workflows with other apps",
      status: "disconnected",
      icon: Webhook,
      category: "Automation",
      config: {},
    },
    {
      id: "8",
      name: "Microsoft Clarity",
      description: "User behavior insights and heatmaps",
      status: "connected",
      icon: Monitor,
      category: "Analytics",
      config: { projectId: "clarity_project_123" },
      lastSync: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@company.com",
      role: "owner",
      status: "active",
      lastActive: new Date(Date.now() - 1800000).toISOString(),
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@company.com",
      role: "admin",
      status: "active",
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      permissions: ["manage_seo", "view_analytics", "manage_workflows"],
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@company.com",
      role: "editor",
      status: "pending",
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      permissions: ["edit_products", "view_analytics"],
    },
  ]);

  const [performanceProfiles, setPerformanceProfiles] = useState<
    PerformanceProfile[]
  >([
    {
      id: "1",
      name: "Standard (Up to 10K Products)",
      description: "Balanced performance for small to medium stores",
      maxProducts: 10000,
      batchSize: 50,
      cacheStrategy: "memory",
      enableVirtualization: false,
      lazyLoading: true,
      compression: true,
    },
    {
      id: "2",
      name: "High Performance (Up to 100K Products)",
      description: "Optimized for large stores with extensive catalogs",
      maxProducts: 100000,
      batchSize: 100,
      cacheStrategy: "redis",
      enableVirtualization: true,
      lazyLoading: true,
      compression: true,
    },
    {
      id: "3",
      name: "Enterprise (500K+ Products)",
      description: "Maximum performance for enterprise-scale operations",
      maxProducts: 500000,
      batchSize: 200,
      cacheStrategy: "distributed",
      enableVirtualization: true,
      lazyLoading: true,
      compression: true,
    },
  ]);

  const handleSaveSettings = async (section: string) => {
    try {
      // In a real app, this would save to the backend
      console.log(`Saving ${section} settings`);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`${section} settings saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      alert(`Failed to save ${section} settings. Please try again.`);
    }
  };

  const handleShowApiKey = () => {
    alert("API Key: sk_live_4f3e2d1c9b8a7g6h5j4k3l2m1n0p9o8i");
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(
        "sk_live_4f3e2d1c9b8a7g6h5j4k3l2m1n0p9o8i",
      );
      alert("API key copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy API key. Please copy manually.");
    }
  };

  const handleRegenerateApiKey = () => {
    if (
      confirm(
        "Are you sure you want to regenerate your API key? This will invalidate the current key.",
      )
    ) {
      alert(
        "API key regenerated successfully! New key: sk_live_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k",
      );
    }
  };

  const handleShowWebhookSecret = () => {
    alert("Webhook Secret: whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6");
  };

  const handleCopyWebhookSecret = async () => {
    try {
      await navigator.clipboard.writeText(
        "whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      );
      alert("Webhook secret copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy webhook secret. Please copy manually.");
    }
  };

  const handleRegenerateWebhookSecret = () => {
    if (
      confirm(
        "Are you sure you want to regenerate your webhook secret? This will invalidate the current secret.",
      )
    ) {
      alert(
        "Webhook secret regenerated successfully! New secret: whsec_p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
      );
    }
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

  const handleInviteTeamMember = () => {
    setSelectedMember(null);
    setShowTeamDialog(true);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowTeamDialog(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "editor":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
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
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
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
                  <SelectItem value="JST">Japan Standard Time</SelectItem>
                  <SelectItem value="AEST">Australian Eastern Time</SelectItem>
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
                  <SelectItem value="EUR">EUR (���)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataCenterRegion">Data Center Region</Label>
              <Select
                value={generalSettings.dataCenterRegion}
                onValueChange={(value) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    dataCenterRegion: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east-1">
                    US East (N. Virginia)
                  </SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                  <SelectItem value="ap-southeast-1">
                    Asia Pacific (Singapore)
                  </SelectItem>
                  <SelectItem value="ap-northeast-1">
                    Asia Pacific (Tokyo)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">System Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode for updates
                  </p>
                </div>
                <Switch
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      maintenanceMode: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging and debugging
                  </p>
                </div>
                <Switch
                  checked={generalSettings.debugMode}
                  onCheckedChange={(checked) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      debugMode: checked,
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
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Auto-Optimization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    setSeoSettings((prev) => ({
                      ...prev,
                      autoOptimize: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>AI-Powered Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Use AI for content optimization
                  </p>
                </div>
                <Switch
                  checked={seoSettings.enableAIOptimization}
                  onCheckedChange={(checked) =>
                    setSeoSettings((prev) => ({
                      ...prev,
                      enableAIOptimization: checked,
                    }))
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
                  <Label>Content Scoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable SEO content scoring
                  </p>
                </div>
                <Switch
                  checked={seoSettings.contentScoring}
                  onCheckedChange={(checked) =>
                    setSeoSettings((prev) => ({
                      ...prev,
                      contentScoring: checked,
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
                  <Label>Auto Alt Text</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate alt text using AI
                  </p>
                </div>
                <Switch
                  checked={seoSettings.autoAltText}
                  onCheckedChange={(checked) =>
                    setSeoSettings((prev) => ({
                      ...prev,
                      autoAltText: checked,
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
                  Available variables: {"{{ product_name }}"},{" "}
                  {"{{ store_name }}"},{"{{ category }}"}, {"{{ brand }}"}
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

          <div className="flex justify-end">
            <Button onClick={() => handleSaveSettings("seo")}>
              <Save className="h-4 w-4 mr-2" />
              Save SEO Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Optimization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Performance Profiles</h4>
            <div className="grid gap-4">
              {performanceProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{profile.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {profile.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          Max Products: {profile.maxProducts.toLocaleString()}
                        </span>
                        <span>Batch Size: {profile.batchSize}</span>
                        <span>Cache: {profile.cacheStrategy}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {profile.enableVirtualization && (
                        <Badge variant="outline">Virtualization</Badge>
                      )}
                      {profile.lazyLoading && (
                        <Badge variant="outline">Lazy Loading</Badge>
                      )}
                      <Button size="sm">Select</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Custom Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="maxProductsPerPage">Products Per Page</Label>
                <Input
                  id="maxProductsPerPage"
                  type="number"
                  value={performanceSettings.maxProductsPerPage}
                  onChange={(e) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      maxProductsPerPage: parseInt(e.target.value),
                    }))
                  }
                  min="10"
                  max="500"
                />
              </div>
              <div>
                <Label htmlFor="batchSize">Batch Processing Size</Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={performanceSettings.batchSize}
                  onChange={(e) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      batchSize: parseInt(e.target.value),
                    }))
                  }
                  min="10"
                  max="1000"
                />
              </div>
              <div>
                <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                <Input
                  id="cacheTimeout"
                  type="number"
                  value={performanceSettings.cacheTimeout}
                  onChange={(e) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      cacheTimeout: parseInt(e.target.value),
                    }))
                  }
                  min="60"
                  max="86400"
                />
              </div>
              <div>
                <Label htmlFor="maxConcurrentRequests">
                  Max Concurrent Requests
                </Label>
                <Input
                  id="maxConcurrentRequests"
                  type="number"
                  value={performanceSettings.maxConcurrentRequests}
                  onChange={(e) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      maxConcurrentRequests: parseInt(e.target.value),
                    }))
                  }
                  min="1"
                  max="50"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Optimization Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Virtualization</Label>
                  <p className="text-sm text-muted-foreground">
                    Virtual scrolling for large lists
                  </p>
                </div>
                <Switch
                  checked={performanceSettings.enableVirtualization}
                  onCheckedChange={(checked) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      enableVirtualization: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Lazy Load Images</Label>
                  <p className="text-sm text-muted-foreground">
                    Load images only when visible
                  </p>
                </div>
                <Switch
                  checked={performanceSettings.lazyLoadImages}
                  onCheckedChange={(checked) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      lazyLoadImages: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress API responses
                  </p>
                </div>
                <Switch
                  checked={performanceSettings.enableCompression}
                  onCheckedChange={(checked) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      enableCompression: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable CDN</Label>
                  <p className="text-sm text-muted-foreground">
                    Use Content Delivery Network
                  </p>
                </div>
                <Switch
                  checked={performanceSettings.enableCDN}
                  onCheckedChange={(checked) =>
                    setPerformanceSettings((prev) => ({
                      ...prev,
                      enableCDN: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSaveSettings("performance")}>
              <Save className="h-4 w-4 mr-2" />
              Save Performance Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Communication Channels</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
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
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Browser push notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      pushNotifications: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Critical alerts via SMS
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.smsAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      smsAlerts: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Slack Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to Slack
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.slackIntegration}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      slackIntegration: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Alert Types</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );

  const renderAPIIntegrations = () => (
    <div className="space-y-6">
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
          <div className="space-y-6">
            {/* Group by category */}
            {[
              "Search Analytics",
              "Analytics",
              "SEO Tools",
              "E-commerce",
              "Communication",
              "Automation",
            ].map((category) => {
              const categoryAPIs = apiIntegrations.filter(
                (api) => api.category === category,
              );
              if (categoryAPIs.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="font-medium mb-3">{category}</h4>
                  <div className="space-y-3">
                    {categoryAPIs.map((api) => (
                      <div
                        key={api.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <api.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium">{api.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {api.description}
                            </p>
                            {api.lastSync && (
                              <p className="text-xs text-muted-foreground">
                                Last sync:{" "}
                                {new Date(api.lastSync).toLocaleString()}
                              </p>
                            )}
                            {api.rateLimits && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    API Usage: {api.rateLimits.used} /{" "}
                                    {api.rateLimits.daily}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (api.rateLimits.used /
                                      api.rateLimits.daily) *
                                    100
                                  }
                                  className="h-1 mt-1"
                                />
                              </div>
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
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAPIConnect(api)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAPIDisconnect(api.id)}
                              >
                                Disconnect
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAPIConnect(api)}
                            >
                              {api.status === "error" ? "Reconnect" : "Connect"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Management</CardTitle>
            <Button size="sm" onClick={handleInviteTeamMember}>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTeamMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {member.role !== "owner" && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
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
                Your API keys are encrypted and stored securely. Never share
                your API keys publicly.
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShowApiKey}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyApiKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRegenerateApiKey}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Webhook Secret</p>
                  <p className="text-sm text-muted-foreground">
                    whsec_•���••••••••••5678
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShowWebhookSecret}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyWebhookSecret}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRegenerateWebhookSecret}
                  >
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
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MariaDB Database Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Connection Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="db-host">Database Host</Label>
                <Input
                  id="db-host"
                  value={databaseSettings.host}
                  onChange={(e) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      host: e.target.value,
                    }))
                  }
                  placeholder="localhost"
                />
              </div>
              <div>
                <Label htmlFor="db-port">Port</Label>
                <Input
                  id="db-port"
                  type="number"
                  value={databaseSettings.port}
                  onChange={(e) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      port: parseInt(e.target.value),
                    }))
                  }
                  placeholder="3306"
                />
              </div>
              <div>
                <Label htmlFor="db-name">Database Name</Label>
                <Input
                  id="db-name"
                  value={databaseSettings.database}
                  onChange={(e) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      database: e.target.value,
                    }))
                  }
                  placeholder="seo_manager"
                />
              </div>
              <div>
                <Label htmlFor="db-user">Username</Label>
                <Input
                  id="db-user"
                  value={databaseSettings.user}
                  onChange={(e) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      user: e.target.value,
                    }))
                  }
                  placeholder="root"
                />
              </div>
              <div>
                <Label htmlFor="db-password">Password</Label>
                <Input
                  id="db-password"
                  type="password"
                  value={databaseSettings.password}
                  onChange={(e) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter database password"
                />
              </div>
              <div>
                <Label htmlFor="db-pool-size">Connection Pool Size</Label>
                <Input
                  id="db-pool-size"
                  type="number"
                  value={databaseSettings.connectionPoolSize}
                  onChange={(e) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      connectionPoolSize: parseInt(e.target.value),
                    }))
                  }
                  min="1"
                  max="50"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Advanced Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Use SSL/TLS encryption for database connections
                  </p>
                </div>
                <Switch
                  checked={databaseSettings.enableSSL}
                  onCheckedChange={(checked) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      enableSSL: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup database
                  </p>
                </div>
                <Switch
                  checked={databaseSettings.autoBackup}
                  onCheckedChange={(checked) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      autoBackup: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Query Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log database queries for debugging
                  </p>
                </div>
                <Switch
                  checked={databaseSettings.enableLogging}
                  onCheckedChange={(checked) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      enableLogging: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Backup Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select
                  value={databaseSettings.backupFrequency}
                  onValueChange={(value) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      backupFrequency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="retention-days">Retention Days</Label>
                <Input
                  id="retention-days"
                  type="number"
                  value={databaseSettings.retentionDays}
                  onChange={(e) =>
                    setDatabaseSettings((prev) => ({
                      ...prev,
                      retentionDays: parseInt(e.target.value),
                    }))
                  }
                  min="1"
                  max="365"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Database Actions</h4>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Backup Now
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Restore Backup
              </Button>
              <Button variant="outline" className="flex-1">
                <Activity className="h-4 w-4 mr-2" />
                View Logs
              </Button>
            </div>
          </div>

          <Alert>
            <HardDrive className="h-4 w-4" />
            <AlertTitle>Database Information</AlertTitle>
            <AlertDescription>
              The application uses MariaDB for data storage. Ensure your
              database server is running and accessible. Connection settings are
              applied immediately and may require an application restart.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={() => handleSaveSettings("database")}>
              <Save className="h-4 w-4 mr-2" />
              Save Database Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center space-x-4 mb-8">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your SEO Manager configuration and team
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-8">
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
              value="performance"
              className="flex items-center space-x-2"
            >
              <Gauge className="h-4 w-4" />
              <span>Performance</span>
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
              value="database"
              className="flex items-center space-x-2"
            >
              <HardDrive className="h-4 w-4" />
              <span>Database</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team</span>
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
          <TabsContent value="performance">
            {renderPerformanceSettings()}
          </TabsContent>
          <TabsContent value="notifications">
            {renderNotifications()}
          </TabsContent>
          <TabsContent value="integrations">
            {renderAPIIntegrations()}
          </TabsContent>
          <TabsContent value="database">{renderDatabaseSettings()}</TabsContent>
          <TabsContent value="team">{renderTeamManagement()}</TabsContent>
          <TabsContent value="security">{renderSecurity()}</TabsContent>
        </Tabs>
      </div>

      {/* API Integration Dialog */}
      <Dialog open={showAPIDialog} onOpenChange={setShowAPIDialog}>
        <DialogContent className="max-w-2xl">
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

              {selectedAPI.name === "Slack" && (
                <>
                  <div>
                    <Label>Webhook URL</Label>
                    <Input placeholder="https://hooks.slack.com/services/..." />
                  </div>
                  <div>
                    <Label>Default Channel</Label>
                    <Input placeholder="#seo-alerts" />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
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
                      <p className="text-xs text-muted-foreground">
                        Category: {api.category}
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

      {/* Team Member Dialog */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? "Edit Team Member" : "Invite Team Member"}
            </DialogTitle>
            <DialogDescription>
              {selectedMember
                ? "Update team member permissions and role"
                : "Send an invitation to join your team"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Email Address</Label>
              <Input
                placeholder="member@company.com"
                defaultValue={selectedMember?.email}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select defaultValue={selectedMember?.role || "viewer"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="space-y-2 mt-2">
                {[
                  "View Analytics",
                  "Manage SEO",
                  "Edit Products",
                  "Manage Workflows",
                  "Access Settings",
                ].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input type="checkbox" id={permission} />
                    <Label htmlFor={permission}>{permission}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
              Cancel
            </Button>
            <Button>
              {selectedMember ? "Update Member" : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

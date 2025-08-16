import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  Calendar,
  Activity,
  Target,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  BarChart3,
  Filter,
  Search,
  Download,
  Upload,
  Shield,
  Globe,
  Smartphone,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  WorkflowRule,
  WorkflowExecution,
  BulkOperation,
  SEOAudit,
  AuditResult,
  PlatformIntegration,
  ThirdPartyIntegration,
} from "@shared/workflows";
import { workflowService } from "@/services/workflowService";

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [audits, setAudits] = useState<SEOAudit[]>([]);
  const [platforms, setPlatforms] = useState<PlatformIntegration[]>([]);
  const [thirdParty, setThirdParty] = useState<ThirdPartyIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        workflowData,
        executionData,
        bulkData,
        auditData,
        platformData,
        thirdPartyData,
      ] = await Promise.all([
        workflowService.getWorkflowRules(),
        workflowService.getWorkflowExecutions(),
        workflowService.getBulkOperations(),
        workflowService.getSEOAudits(),
        workflowService.getPlatformIntegrations(),
        workflowService.getThirdPartyIntegrations(),
      ]);

      setWorkflows(workflowData);
      setExecutions(executionData);
      setBulkOperations(bulkData);
      setAudits(auditData);
      setPlatforms(platformData);
      setThirdParty(thirdPartyData);
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load workflow data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find((w) => w.id === workflowId);
      if (!workflow) return;

      alert(
        `Running workflow: ${workflow.name}. This would trigger the workflow execution.`,
      );
      // In a real app, this would call the workflow execution API
      await workflowService.executeWorkflow(workflowId, {});
      loadData(); // Refresh data
    } catch (error) {
      console.error("Failed to run workflow:", error);
      alert("Failed to run workflow. Please try again.");
    }
  };

  const handleSyncPlatform = async (platformId: string) => {
    try {
      const platform = platforms.find((p) => p.id === platformId);
      if (!platform) return;

      alert(
        `Syncing with ${platform.platform}. This would trigger a platform sync.`,
      );
      // In a real app, this would call the platform sync API
    } catch (error) {
      console.error("Failed to sync platform:", error);
      alert("Failed to sync platform. Please try again.");
    }
  };

  const handleCreateWorkflow = () => {
    alert("This would open the workflow builder to create a new workflow.");
    // In a real app, this would navigate to the workflow builder
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Activity className="h-3 w-3 mr-1" />
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case "connected":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
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

  // Mock data for demonstration
  const mockWorkflows: WorkflowRule[] = [
    {
      id: "1",
      name: "Auto SEO Optimization",
      description: "Automatically optimize SEO fields for new products",
      enabled: true,
      trigger: { type: "event", event: "product_created" },
      conditions: [],
      actions: [
        {
          id: "1",
          type: "generate_meta",
          config: { metaType: "both", useAI: true },
        },
        { id: "2", type: "generate_schema", config: {} },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 156,
    },
    {
      id: "2",
      name: "Weekly SEO Audit",
      description: "Comprehensive SEO audit with email report",
      enabled: true,
      trigger: {
        type: "scheduled",
        schedule: {
          type: "weekly",
          time: "09:00",
          timezone: "UTC",
          daysOfWeek: [1],
        },
      },
      conditions: [],
      actions: [
        { id: "1", type: "audit_seo", config: {} },
        {
          id: "2",
          type: "send_email",
          config: {
            recipients: ["admin@example.com"],
            subject: "Weekly SEO Report",
          },
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 8,
    },
    {
      id: "3",
      name: "Fix Missing Meta Tags",
      description: "Automatically fix products with missing meta descriptions",
      enabled: true,
      trigger: { type: "manual" },
      conditions: [
        {
          id: "1",
          field: "metaDescription",
          operator: "is_empty",
          value: null,
        },
      ],
      actions: [
        {
          id: "1",
          type: "generate_meta",
          config: { metaType: "description", useAI: true },
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 42,
    },
  ];

  const mockExecutions: WorkflowExecution[] = [
    {
      id: "1",
      workflowId: "1",
      status: "completed",
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3000000).toISOString(),
      progress: 100,
      totalItems: 25,
      processedItems: 25,
      errors: [],
      results: [],
      canCancel: false,
    },
    {
      id: "2",
      workflowId: "2",
      status: "running",
      startedAt: new Date(Date.now() - 900000).toISOString(),
      progress: 65,
      totalItems: 1000,
      processedItems: 650,
      errors: [],
      results: [],
      canCancel: true,
    },
  ];

  const mockPlatforms: PlatformIntegration[] = [
    {
      id: "1",
      name: "Main Shopify Store",
      type: "shopify",
      status: "connected",
      credentials: { shopifyDomain: "mystore.myshopify.com" },
      syncSettings: {
        autoSync: true,
        syncInterval: 60,
        syncFields: ["title", "description", "price", "inventory"],
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
      credentials: { wooCommerceUrl: "https://mystore.com" },
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

  const mockThirdParty: ThirdPartyIntegration[] = [
    {
      id: "1",
      name: "Google Search Console",
      type: "google_search_console",
      status: "connected",
      credentials: {},
      settings: {},
      lastSync: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      name: "Google Analytics 4",
      type: "google_analytics",
      status: "connected",
      credentials: {},
      settings: {},
      lastSync: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "3",
      name: "SEMrush",
      type: "semrush",
      status: "disconnected",
      credentials: {},
      settings: {},
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Zap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Workflow Automation
              </h1>
              <p className="text-sm text-muted-foreground">
                Automate SEO optimization and manage integrations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Link to="/workflow-builder">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Workflow Builder
              </Button>
            </Link>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Workflows
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockWorkflows.filter((w) => w.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockWorkflows.length} total workflows
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Running Tasks
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockExecutions.filter((e) => e.status === "running").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockExecutions.length} total executions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Connected Platforms
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockPlatforms.filter((p) => p.status === "connected").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockPlatforms.length} total integrations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                API Integrations
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockThirdParty.filter((t) => t.status === "connected").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockThirdParty.length} total services
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="workflows" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
            <TabsTrigger value="audits">SEO Audits</TabsTrigger>
            <TabsTrigger value="platforms">E-commerce</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Workflow Rules</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search workflows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="border rounded-lg p-4 hover:bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{workflow.name}</h3>
                            <Badge
                              variant={
                                workflow.enabled ? "default" : "secondary"
                              }
                            >
                              {workflow.enabled ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {workflow.trigger.type === "scheduled" ? (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Scheduled
                                </>
                              ) : workflow.trigger.type === "event" ? (
                                <>
                                  <Zap className="h-3 w-3 mr-1" />
                                  Event-based
                                </>
                              ) : (
                                <>
                                  <Bot className="h-3 w-3 mr-1" />
                                  Manual
                                </>
                              )}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {workflow.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>
                              Executed {workflow.executionCount} times
                            </span>
                            <span>•</span>
                            <span>{workflow.actions.length} actions</span>
                            <span>•</span>
                            <span>
                              Last updated{" "}
                              {new Date(
                                workflow.updatedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRunWorkflow(workflow.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Run Now
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {workflow.enabled ? (
                                  <Pause className="h-4 w-4 mr-2" />
                                ) : (
                                  <Play className="h-4 w-4 mr-2" />
                                )}
                                {workflow.enabled ? "Disable" : "Enable"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Executions Tab */}
          <TabsContent value="executions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExecutions.map((execution) => {
                    const workflow = mockWorkflows.find(
                      (w) => w.id === execution.workflowId,
                    );
                    return (
                      <div key={execution.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">
                              {workflow?.name || "Unknown Workflow"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Started{" "}
                              {new Date(execution.startedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusBadge(execution.status)}
                            {execution.canCancel && (
                              <Button size="sm" variant="outline">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>

                        {execution.status === "running" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {execution.processedItems}/
                                {execution.totalItems} items
                              </span>
                            </div>
                            <Progress value={execution.progress} />
                          </div>
                        )}

                        {execution.status === "completed" && (
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              Processed {execution.processedItems} items
                            </span>
                            <span>•</span>
                            <span>
                              Completed in{" "}
                              {Math.round(
                                (new Date(execution.completedAt!).getTime() -
                                  new Date(execution.startedAt).getTime()) /
                                  60000,
                              )}{" "}
                              minutes
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* E-commerce Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>E-commerce Platform Integrations</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Platform
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPlatforms.map((platform) => (
                    <div key={platform.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            {platform.type === "shopify" && (
                              <span className="text-green-600 font-bold">
                                S
                              </span>
                            )}
                            {platform.type === "woocommerce" && (
                              <span className="text-purple-600 font-bold">
                                W
                              </span>
                            )}
                            {platform.type === "bigcommerce" && (
                              <span className="text-blue-600 font-bold">B</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{platform.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {platform.type.replace("_", " ")}
                            </p>
                            {platform.lastSync && (
                              <p className="text-xs text-muted-foreground">
                                Last synced{" "}
                                {new Date(platform.lastSync).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(platform.status)}
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Now
                          </Button>
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
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Disconnect
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {platform.syncSettings.autoSync && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Auto-sync enabled
                            </span>
                            <span className="text-muted-foreground">
                              Every {platform.syncSettings.syncInterval} minutes
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Third-party APIs Tab */}
          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Third-party API Integrations</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect API
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockThirdParty.map((integration) => (
                    <div key={integration.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {integration.type === "google_search_console" && (
                              <Search className="h-5 w-5 text-blue-600" />
                            )}
                            {integration.type === "google_analytics" && (
                              <BarChart3 className="h-5 w-5 text-orange-600" />
                            )}
                            {integration.type === "semrush" && (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            )}
                            {integration.type === "ahrefs" && (
                              <Target className="h-5 w-5 text-red-600" />
                            )}
                            {integration.type === "pagespeed" && (
                              <Smartphone className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {integration.lastSync
                                ? `Last sync ${new Date(integration.lastSync).toLocaleString()}`
                                : "Never synced"}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(integration.status)}
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        {integration.status === "connected" && (
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Target className="h-6 w-6 mb-2" />
                    Run SEO Audit
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Bot className="h-6 w-6 mb-2" />
                    AI Optimize
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <RefreshCw className="h-6 w-6 mb-2" />
                    Sync All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

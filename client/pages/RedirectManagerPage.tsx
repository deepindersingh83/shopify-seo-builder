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
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle,
  XCircle,
  Link2,
  Globe,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Upload,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Settings,
  BarChart3,
  Clock,
  Target,
  FileText,
  Zap,
  Info
} from "lucide-react";

interface Redirect {
  id: string;
  sourceUrl: string;
  destinationUrl: string;
  redirectType: "301" | "302" | "307" | "308";
  status: "active" | "inactive" | "error";
  createdDate: string;
  lastAccessed?: string;
  hits: number;
  notes?: string;
  createdBy: string;
  isWildcard: boolean;
  priority: number;
}

interface RedirectStats {
  totalRedirects: number;
  activeRedirects: number;
  totalHits: number;
  errorRedirects: number;
  monthlyHits: number;
  averageResponseTime: number;
}

export default function RedirectManagerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedRedirects, setSelectedRedirects] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bulkImportData, setBulkImportData] = useState("");

  // Mock redirect data
  const redirectStats: RedirectStats = {
    totalRedirects: 156,
    activeRedirects: 142,
    totalHits: 45230,
    errorRedirects: 3,
    monthlyHits: 8940,
    averageResponseTime: 45
  };

  const redirects: Redirect[] = [
    {
      id: "1",
      sourceUrl: "/old-product-page",
      destinationUrl: "/products/new-product",
      redirectType: "301",
      status: "active",
      createdDate: "2024-01-15",
      lastAccessed: "2024-01-20 14:30",
      hits: 2450,
      notes: "Product page restructuring",
      createdBy: "admin",
      isWildcard: false,
      priority: 1
    },
    {
      id: "2",
      sourceUrl: "/blog/old-category/*",
      destinationUrl: "/blog/new-category/*",
      redirectType: "301",
      status: "active",
      createdDate: "2024-01-10",
      lastAccessed: "2024-01-20 13:45",
      hits: 1890,
      notes: "Blog category migration",
      createdBy: "admin",
      isWildcard: true,
      priority: 2
    },
    {
      id: "3",
      sourceUrl: "/pricing-old",
      destinationUrl: "/pricing",
      redirectType: "301",
      status: "active",
      createdDate: "2024-01-08",
      lastAccessed: "2024-01-20 12:15",
      hits: 3240,
      notes: "Pricing page update",
      createdBy: "marketing",
      isWildcard: false,
      priority: 1
    },
    {
      id: "4",
      sourceUrl: "/temporary-sale",
      destinationUrl: "/sale-ended",
      redirectType: "302",
      status: "inactive",
      createdDate: "2023-12-20",
      lastAccessed: "2024-01-05 10:30",
      hits: 560,
      notes: "Temporary holiday sale redirect",
      createdBy: "marketing",
      isWildcard: false,
      priority: 3
    },
    {
      id: "5",
      sourceUrl: "/broken-api-endpoint",
      destinationUrl: "/api/v2/endpoint",
      redirectType: "301",
      status: "error",
      createdDate: "2024-01-12",
      lastAccessed: "2024-01-18 16:20",
      hits: 120,
      notes: "API migration",
      createdBy: "dev-team",
      isWildcard: false,
      priority: 1
    }
  ];

  const filteredRedirects = redirects.filter(redirect => {
    const matchesSearch = searchTerm === "" || 
      redirect.sourceUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redirect.destinationUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      redirect.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || redirect.status === filterStatus;
    const matchesType = filterType === "all" || redirect.redirectType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRedirectTypeColor = (type: string) => {
    switch (type) {
      case "301":
        return "bg-green-100 text-green-800";
      case "302":
        return "bg-blue-100 text-blue-800";
      case "307":
        return "bg-orange-100 text-orange-800";
      case "308":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRedirectTypeDescription = (type: string) => {
    switch (type) {
      case "301":
        return "Permanent redirect - passes SEO value";
      case "302":
        return "Temporary redirect - does not pass SEO value";
      case "307":
        return "Temporary redirect (HTTP/1.1)";
      case "308":
        return "Permanent redirect (HTTP/1.1)";
      default:
        return "Unknown redirect type";
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on redirects:`, selectedRedirects);
    // Implementation would handle bulk operations
  };

  const handleBulkImport = () => {
    // Parse CSV or bulk data
    console.log("Importing bulk redirects:", bulkImportData);
    setBulkImportData("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Redirect Manager</h1>
            <p className="text-muted-foreground mt-2">
              Manage URL redirects to maintain SEO value when changing URLs and prevent 404 errors
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Redirects
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Redirect
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Redirect</DialogTitle>
                  <DialogDescription>
                    Create a new URL redirect to maintain SEO value and user experience
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source" className="text-right">
                      Source URL
                    </Label>
                    <Input id="source" placeholder="/old-page" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="destination" className="text-right">
                      Destination URL
                    </Label>
                    <Input id="destination" placeholder="/new-page" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Redirect Type
                    </Label>
                    <Select defaultValue="301">
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="301">301 - Permanent</SelectItem>
                        <SelectItem value="302">302 - Temporary</SelectItem>
                        <SelectItem value="307">307 - Temporary (HTTP/1.1)</SelectItem>
                        <SelectItem value="308">308 - Permanent (HTTP/1.1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Input id="notes" placeholder="Optional description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select defaultValue="1">
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">High (1)</SelectItem>
                        <SelectItem value="2">Medium (2)</SelectItem>
                        <SelectItem value="3">Low (3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>
                    Create Redirect
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Redirects</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{redirectStats.totalRedirects}</div>
              <div className="text-xs text-muted-foreground">
                {redirectStats.activeRedirects} active
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{redirectStats.totalHits.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{redirectStats.monthlyHits.toLocaleString()} this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Redirects</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{redirectStats.errorRedirects}</div>
              <div className="text-xs text-muted-foreground">
                Need attention
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{redirectStats.averageResponseTime}ms</div>
              <div className="text-xs text-muted-foreground">
                Average response
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common redirect management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Upload className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Bulk Import</div>
                  <div className="text-sm text-muted-foreground">Import redirects from CSV</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Target className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">404 to Redirects</div>
                  <div className="text-sm text-muted-foreground">Convert 404s to redirects</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <BarChart3 className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Analytics Report</div>
                  <div className="text-sm text-muted-foreground">Generate redirect analytics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="redirects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="redirects">All Redirects</TabsTrigger>
            <TabsTrigger value="errors">Error Redirects</TabsTrigger>
            <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="redirects" className="space-y-6">
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
                        placeholder="Search redirects..."
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
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="301">301 Permanent</SelectItem>
                      <SelectItem value="302">302 Temporary</SelectItem>
                      <SelectItem value="307">307 Temporary</SelectItem>
                      <SelectItem value="308">308 Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedRedirects.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedRedirects.length} redirect(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate")}>
                        Deactivate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                        Activate
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Redirects Table */}
            <Card>
              <CardHeader>
                <CardTitle>URL Redirects ({filteredRedirects.length})</CardTitle>
                <CardDescription>
                  Manage your URL redirects and monitor their performance
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
                                setSelectedRedirects(filteredRedirects.map(r => r.id));
                              } else {
                                setSelectedRedirects([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Source URL</TableHead>
                        <TableHead>Destination URL</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hits</TableHead>
                        <TableHead>Last Accessed</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRedirects.map((redirect) => (
                        <TableRow key={redirect.id}>
                          <TableCell>
                            <input 
                              type="checkbox" 
                              checked={selectedRedirects.includes(redirect.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRedirects([...selectedRedirects, redirect.id]);
                                } else {
                                  setSelectedRedirects(selectedRedirects.filter(id => id !== redirect.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center">
                                {redirect.sourceUrl}
                                {redirect.isWildcard && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Wildcard
                                  </Badge>
                                )}
                              </div>
                              {redirect.notes && (
                                <div className="text-sm text-muted-foreground">
                                  {redirect.notes}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {redirect.destinationUrl}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Created by {redirect.createdBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRedirectTypeColor(redirect.redirectType)}>
                              {redirect.redirectType}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {getRedirectTypeDescription(redirect.redirectType)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(redirect.status)}
                              <Badge 
                                variant={getStatusBadgeVariant(redirect.status)}
                                className="ml-2"
                              >
                                {redirect.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {redirect.hits.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              total hits
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {redirect.lastAccessed || 'Never'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              P{redirect.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Edit Redirect">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Test Redirect">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Delete">
                                <Trash2 className="h-4 w-4" />
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

          <TabsContent value="errors" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have {redirectStats.errorRedirects} redirects with errors that need immediate attention.
                These may be causing 404 errors or infinite redirect loops.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Error Redirects</CardTitle>
                <CardDescription>Redirects that are not working correctly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {redirects.filter(r => r.status === "error").map((redirect) => (
                    <div key={redirect.id} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex-1">
                        <div className="font-medium text-red-900">{redirect.sourceUrl}</div>
                        <div className="text-sm text-red-700">→ {redirect.destinationUrl}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-red-600">
                          <span>Type: {redirect.redirectType}</span>
                          <span>Hits: {redirect.hits.toLocaleString()}</span>
                          <span>Created: {redirect.createdDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Error</Badge>
                        <Button size="sm" variant="outline">Fix Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk-import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import Redirects</CardTitle>
                <CardDescription>Import multiple redirects from CSV or paste data directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csv-data">CSV Data</Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    Format: source_url,destination_url,redirect_type,notes
                  </div>
                  <Textarea 
                    id="csv-data"
                    placeholder="Example:&#10;/old-page,/new-page,301,Page migration&#10;/old-blog/*,/blog/*,301,Blog restructure"
                    value={bulkImportData}
                    onChange={(e) => setBulkImportData(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV File
                  </Button>
                  <Button onClick={handleBulkImport} disabled={!bulkImportData.trim()}>
                    Import Redirects
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Templates</CardTitle>
                <CardDescription>Pre-built templates for common redirect scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Domain Migration",
                      description: "Redirect all pages from old domain to new domain",
                      template: "/*,https://newdomain.com/*,301,Domain migration"
                    },
                    {
                      name: "HTTPS Migration",
                      description: "Redirect HTTP to HTTPS",
                      template: "http://domain.com/*,https://domain.com/*,301,HTTPS migration"
                    },
                    {
                      name: "Page Restructure",
                      description: "Redirect old page structure to new",
                      template: "/old-section/*,/new-section/*,301,Site restructure"
                    },
                    {
                      name: "Blog Migration",
                      description: "Move blog to subdirectory",
                      template: "/blog/*,/content/blog/*,301,Blog migration"
                    }
                  ].map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{template.description}</div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                        {template.template}
                      </code>
                      <Button size="sm" variant="outline">Use Template</Button>
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
                  <CardTitle>Top Performing Redirects</CardTitle>
                  <CardDescription>Redirects with the most traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {redirects.sort((a, b) => b.hits - a.hits).slice(0, 5).map((redirect) => (
                      <div key={redirect.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{redirect.sourceUrl}</div>
                          <div className="text-xs text-muted-foreground">→ {redirect.destinationUrl}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{redirect.hits.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">hits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Redirect Types Distribution</CardTitle>
                  <CardDescription>Breakdown by redirect type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["301", "302", "307", "308"].map((type) => {
                      const count = redirects.filter(r => r.redirectType === type).length;
                      const percentage = (count / redirects.length) * 100;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{type} {getRedirectTypeDescription(type).split(' - ')[1]}</span>
                            <span>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Redirect Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your redirects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">98.1%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{redirectStats.averageResponseTime}ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">89%</div>
                    <div className="text-sm text-muted-foreground">SEO Value Preserved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Redirect Settings</CardTitle>
                <CardDescription>Configure how redirects are handled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="default-type">Default Redirect Type</Label>
                      <Select defaultValue="301">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="301">301 - Permanent</SelectItem>
                          <SelectItem value="302">302 - Temporary</SelectItem>
                          <SelectItem value="307">307 - Temporary (HTTP/1.1)</SelectItem>
                          <SelectItem value="308">308 - Permanent (HTTP/1.1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cache-duration">Cache Duration (seconds)</Label>
                      <Input type="number" defaultValue="3600" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="max-redirects">Max Redirect Chain Length</Label>
                      <Input type="number" defaultValue="5" className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Redirect Monitoring</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Monitor redirect performance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Track redirect analytics</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Alert on redirect errors</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Configuration</CardTitle>
                <CardDescription>Advanced redirect rules and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="global-rules">Global Redirect Rules</Label>
                    <Textarea 
                      id="global-rules"
                      placeholder="Enter global redirect patterns (one per line)&#10;Example: /blog/(.*) -> /content/blog/$1"
                      className="mt-2 min-h-[100px] font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exclude-patterns">Exclude Patterns</Label>
                    <Textarea 
                      id="exclude-patterns"
                      placeholder="URLs to exclude from redirects (one per line)&#10;Example: /api/*&#10;/admin/*"
                      className="mt-2 min-h-[100px] font-mono text-sm"
                    />
                  </div>
                  <Button variant="outline">Save Advanced Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

import { Layout } from "../components/Layout";
import { useState } from "react";
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
import { Textarea } from "../components/ui/textarea";
import {
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Link2,
  Globe,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  BarChart3,
  Clock,
  Target,
  ArrowRight,
  FileText,
  Zap,
} from "lucide-react";

interface BrokenLink {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  linkText: string;
  errorCode: number;
  errorType: "404" | "403" | "500" | "timeout" | "redirect_loop" | "ssl_error";
  foundOn: string;
  lastChecked: string;
  status: "broken" | "fixed" | "ignored" | "redirected";
  suggestedFix?: string;
  priority: "high" | "medium" | "low";
  linkType: "internal" | "external";
  pageTitle?: string;
  traffic: number;
}

interface ScanProgress {
  totalPages: number;
  pagesScanned: number;
  linksFound: number;
  brokenLinksFound: number;
  isScanning: boolean;
  currentPage?: string;
}

export default function BrokenLinksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);

  // Mock scan progress data
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    totalPages: 1247,
    pagesScanned: 1247,
    linksFound: 15632,
    brokenLinksFound: 23,
    isScanning: false,
  });

  // Mock broken links data
  const brokenLinks: BrokenLink[] = [
    {
      id: "1",
      sourceUrl: "/products/automation-tools",
      targetUrl: "https://old-partner-site.com/api-docs",
      linkText: "API Documentation",
      errorCode: 404,
      errorType: "404",
      foundOn: "2024-01-20",
      lastChecked: "2024-01-20 14:30",
      status: "broken",
      suggestedFix: "https://new-partner-site.com/api-docs",
      priority: "high",
      linkType: "external",
      pageTitle: "Automation Tools - SEO Manager",
      traffic: 1250,
    },
    {
      id: "2",
      sourceUrl: "/blog/seo-best-practices",
      targetUrl: "/tools/deprecated-feature",
      linkText: "Old SEO Tool",
      errorCode: 404,
      errorType: "404",
      foundOn: "2024-01-19",
      lastChecked: "2024-01-20 14:25",
      status: "broken",
      suggestedFix: "/tools/advanced-seo",
      priority: "medium",
      linkType: "internal",
      pageTitle: "SEO Best Practices Guide",
      traffic: 890,
    },
    {
      id: "3",
      sourceUrl: "/pricing",
      targetUrl: "https://payment-gateway.com/checkout",
      linkText: "Upgrade Now",
      errorCode: 403,
      errorType: "403",
      foundOn: "2024-01-18",
      lastChecked: "2024-01-20 14:20",
      status: "broken",
      priority: "high",
      linkType: "external",
      pageTitle: "Pricing - SEO Manager",
      traffic: 2100,
    },
    {
      id: "4",
      sourceUrl: "/help/tutorials",
      targetUrl: "/videos/tutorial-2023.mp4",
      linkText: "Video Tutorial",
      errorCode: 404,
      errorType: "404",
      foundOn: "2024-01-17",
      lastChecked: "2024-01-20 14:15",
      status: "fixed",
      suggestedFix: "/videos/tutorial-2024.mp4",
      priority: "low",
      linkType: "internal",
      pageTitle: "Help & Tutorials",
      traffic: 320,
    },
    {
      id: "5",
      sourceUrl: "/features",
      targetUrl: "https://slow-service.com/data",
      linkText: "External Data Source",
      errorCode: 0,
      errorType: "timeout",
      foundOn: "2024-01-16",
      lastChecked: "2024-01-20 14:10",
      status: "broken",
      priority: "medium",
      linkType: "external",
      pageTitle: "Features Overview",
      traffic: 650,
    },
  ];

  const filteredLinks = brokenLinks.filter((link) => {
    const matchesSearch =
      searchTerm === "" ||
      link.sourceUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.linkText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || link.status === filterStatus;
    const matchesType = filterType === "all" || link.linkType === filterType;
    const matchesPriority =
      filterPriority === "all" || link.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "broken":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "fixed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ignored":
        return <Eye className="h-4 w-4 text-gray-500" />;
      case "redirected":
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "broken":
        return "destructive";
      case "fixed":
        return "success";
      case "ignored":
        return "secondary";
      case "redirected":
        return "default";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getErrorTypeDescription = (errorType: string) => {
    switch (errorType) {
      case "404":
        return "Page not found";
      case "403":
        return "Access forbidden";
      case "500":
        return "Server error";
      case "timeout":
        return "Connection timeout";
      case "redirect_loop":
        return "Redirect loop detected";
      case "ssl_error":
        return "SSL certificate error";
      default:
        return "Unknown error";
    }
  };

  const startScan = () => {
    setScanProgress((prev) => ({ ...prev, isScanning: true, pagesScanned: 0 }));
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev.pagesScanned >= prev.totalPages) {
          clearInterval(interval);
          return { ...prev, isScanning: false };
        }
        return { ...prev, pagesScanned: prev.pagesScanned + 25 };
      });
    }, 500);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on links:`, selectedLinks);
    // Implementation would handle bulk operations
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Broken Links</h1>
            <p className="text-muted-foreground mt-2">
              Find and fix broken links to improve user experience and SEO
              performance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={startScan} disabled={scanProgress.isScanning}>
              {scanProgress.isScanning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Scan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Scan Progress */}
        {scanProgress.isScanning && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Scanning Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {scanProgress.pagesScanned} / {scanProgress.totalPages}{" "}
                    pages
                  </span>
                </div>
                <Progress
                  value={
                    (scanProgress.pagesScanned / scanProgress.totalPages) * 100
                  }
                  className="h-2"
                />
                <div className="text-sm text-muted-foreground">
                  Found {scanProgress.brokenLinksFound} broken links so far...
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Links Scanned
              </CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scanProgress.linksFound.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Across {scanProgress.totalPages.toLocaleString()} pages
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Broken Links
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {brokenLinks.filter((l) => l.status === "broken").length}
              </div>
              <div className="text-xs text-muted-foreground">
                {(
                  (brokenLinks.filter((l) => l.status === "broken").length /
                    scanProgress.linksFound) *
                  100
                ).toFixed(2)}
                % error rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fixed Links</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {brokenLinks.filter((l) => l.status === "fixed").length}
              </div>
              <div className="text-xs text-muted-foreground">
                Recently resolved
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Priority
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {brokenLinks.filter((l) => l.priority === "high").length}
              </div>
              <div className="text-xs text-muted-foreground">
                Require immediate attention
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="broken" className="space-y-6">
          <TabsList>
            <TabsTrigger value="broken">Broken Links</TabsTrigger>
            <TabsTrigger value="fixed">Fixed Links</TabsTrigger>
            <TabsTrigger value="bulk-fix">Bulk Fix</TabsTrigger>
            <TabsTrigger value="settings">Scan Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="broken" className="space-y-6">
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
                        placeholder="Search URLs or link text..."
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
                      <SelectItem value="broken">Broken</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="ignored">Ignored</SelectItem>
                      <SelectItem value="redirected">Redirected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Link Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedLinks.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedLinks.length} link(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("ignore")}
                      >
                        Ignore Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("recheck")}
                      >
                        Recheck Selected
                      </Button>
                      <Button size="sm" onClick={() => handleBulkAction("fix")}>
                        Fix Selected
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Broken Links Table */}
            <Card>
              <CardHeader>
                <CardTitle>Broken Links ({filteredLinks.length})</CardTitle>
                <CardDescription>
                  Links that are returning errors and need attention
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
                                setSelectedLinks(
                                  filteredLinks.map((l) => l.id),
                                );
                              } else {
                                setSelectedLinks([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Source Page</TableHead>
                        <TableHead>Broken Link</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Traffic Impact</TableHead>
                        <TableHead>Last Checked</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedLinks.includes(link.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLinks([...selectedLinks, link.id]);
                                } else {
                                  setSelectedLinks(
                                    selectedLinks.filter(
                                      (id) => id !== link.id,
                                    ),
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div
                                className="font-medium truncate max-w-[200px]"
                                title={link.sourceUrl}
                              >
                                {link.sourceUrl}
                              </div>
                              {link.pageTitle && (
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {link.pageTitle}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div
                                className="font-medium truncate max-w-[200px]"
                                title={link.targetUrl}
                              >
                                {link.targetUrl}
                              </div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {link.linkText}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="destructive" className="mb-1">
                                {link.errorCode || link.errorType.toUpperCase()}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {getErrorTypeDescription(link.errorType)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(link.priority)}>
                              {link.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(link.status)}
                              <Badge
                                variant={getStatusBadgeVariant(link.status)}
                                className="ml-2"
                              >
                                {link.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {link.traffic.toLocaleString()} visitors
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{link.lastChecked}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Edit Link"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Recheck">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Ignore">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Suggested Fixes */}
                {filteredLinks.filter((l) => l.suggestedFix).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">
                      Suggested Fixes
                    </h4>
                    <div className="space-y-2">
                      {filteredLinks
                        .filter((l) => l.suggestedFix)
                        .map((link) => (
                          <Alert key={link.id}>
                            <Target className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Replace{" "}
                                  <code className="text-xs bg-muted px-1 rounded">
                                    {link.targetUrl}
                                  </code>{" "}
                                  with{" "}
                                  <code className="text-xs bg-muted px-1 rounded">
                                    {link.suggestedFix}
                                  </code>
                                </span>
                                <Button size="sm" variant="outline">
                                  Apply Fix
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recently Fixed Links</CardTitle>
                <CardDescription>
                  Links that have been successfully resolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brokenLinks
                    .filter((l) => l.status === "fixed")
                    .map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{link.sourceUrl}</div>
                          <div className="text-sm text-muted-foreground">
                            {link.targetUrl}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Fixed on: {link.lastChecked}</span>
                            <span>
                              Traffic saved: {link.traffic.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <Badge variant="success">Fixed</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk-fix" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Link Replacement</CardTitle>
                <CardDescription>
                  Replace multiple broken links at once using patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Find URLs containing:
                    </label>
                    <Input placeholder="e.g., old-domain.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Replace with:</label>
                    <Input placeholder="e.g., new-domain.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Preview Changes:
                  </label>
                  <Textarea
                    className="mt-2"
                    placeholder="Changes will be previewed here..."
                    readOnly
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Preview Changes</Button>
                  <Button>Apply Bulk Fix</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>URL Pattern Fixes</CardTitle>
                <CardDescription>
                  Common patterns for bulk fixing broken links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "HTTP to HTTPS",
                      description: "Convert all HTTP links to HTTPS",
                      pattern: "http://",
                      replacement: "https://",
                      affected: 12,
                    },
                    {
                      name: "Domain Migration",
                      description: "Update links to new domain",
                      pattern: "old-site.com",
                      replacement: "new-site.com",
                      affected: 8,
                    },
                    {
                      name: "Remove WWW",
                      description: "Remove www prefix from URLs",
                      pattern: "www.",
                      replacement: "",
                      affected: 5,
                    },
                  ].map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {pattern.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {pattern.affected} links affected
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Apply Pattern
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Configuration</CardTitle>
                <CardDescription>
                  Configure how broken link scans are performed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Scan Frequency
                      </label>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="manual">Manual Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Timeout (seconds)
                      </label>
                      <Input type="number" defaultValue="30" className="mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">User Agent</label>
                      <Input defaultValue="SEO Manager Bot" className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Check External Links
                      </label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">
                          Include external links in scans
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Follow Redirects
                      </label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">
                          Follow up to 5 redirects
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Email Notifications
                      </label>
                      <div className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">
                          Send alerts for new broken links
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exclusion Rules</CardTitle>
                <CardDescription>
                  URLs or patterns to exclude from broken link scanning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter URLs or patterns to exclude (one per line)&#10;e.g., /admin/*&#10;mailto:*&#10;tel:*"
                    className="min-h-[100px]"
                  />
                  <Button variant="outline">Add Exclusion Rules</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

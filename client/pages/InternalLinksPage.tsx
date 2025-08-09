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
  Link2,
  ExternalLink,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Globe,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Upload,
  Target,
  BarChart3,
  Clock,
  Settings,
  FileText,
  Zap,
  Info,
  Network,
  Share2,
  ArrowRight,
  MapPin,
  Users
} from "lucide-react";

interface InternalLink {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  linkPosition: "header" | "content" | "footer" | "sidebar" | "navigation";
  linkType: "text" | "image" | "button";
  status: "active" | "broken" | "redirect" | "nofollow";
  pageAuthority: number;
  linkEquity: number;
  clickThroughRate: number;
  lastCrawled: string;
  isOptimized: boolean;
  sourcePageTitle?: string;
  targetPageTitle?: string;
  depth: number;
}

interface LinkMetrics {
  totalInternalLinks: number;
  orphanPages: number;
  averageLinksPerPage: number;
  deepestPage: number;
  linkEquityDistribution: number;
  crawlDepth: number;
}

interface LinkOpportunity {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  suggestedAnchor: string;
  reason: string;
  priority: "high" | "medium" | "low";
  potentialImpact: number;
}

export default function InternalLinksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock metrics data
  const linkMetrics: LinkMetrics = {
    totalInternalLinks: 3847,
    orphanPages: 23,
    averageLinksPerPage: 12.4,
    deepestPage: 6,
    linkEquityDistribution: 78,
    crawlDepth: 5
  };

  // Mock internal links data
  const internalLinks: InternalLink[] = [
    {
      id: "1",
      sourceUrl: "/",
      targetUrl: "/products/automation-tools",
      anchorText: "automation tools",
      linkPosition: "content",
      linkType: "text",
      status: "active",
      pageAuthority: 85,
      linkEquity: 92,
      clickThroughRate: 12.5,
      lastCrawled: "2024-01-20 14:30",
      isOptimized: true,
      sourcePageTitle: "Homepage - SEO Manager",
      targetPageTitle: "Automation Tools - SEO Manager",
      depth: 1
    },
    {
      id: "2",
      sourceUrl: "/blog/seo-best-practices",
      targetUrl: "/tools/keyword-research",
      anchorText: "keyword research tool",
      linkPosition: "content",
      linkType: "text",
      status: "active",
      pageAuthority: 72,
      linkEquity: 85,
      clickThroughRate: 8.3,
      lastCrawled: "2024-01-20 13:45",
      isOptimized: true,
      sourcePageTitle: "SEO Best Practices Guide",
      targetPageTitle: "Keyword Research Tool",
      depth: 2
    },
    {
      id: "3",
      sourceUrl: "/pricing",
      targetUrl: "/features",
      anchorText: "see all features",
      linkPosition: "content",
      linkType: "button",
      status: "active",
      pageAuthority: 78,
      linkEquity: 88,
      clickThroughRate: 15.7,
      lastCrawled: "2024-01-20 12:30",
      isOptimized: false,
      sourcePageTitle: "Pricing - SEO Manager",
      targetPageTitle: "Features Overview",
      depth: 1
    },
    {
      id: "4",
      sourceUrl: "/help/tutorials",
      targetUrl: "/non-existent-page",
      anchorText: "advanced tutorial",
      linkPosition: "content",
      linkType: "text",
      status: "broken",
      pageAuthority: 45,
      linkEquity: 0,
      clickThroughRate: 0,
      lastCrawled: "2024-01-20 11:15",
      isOptimized: false,
      sourcePageTitle: "Help & Tutorials",
      targetPageTitle: "Page Not Found",
      depth: 3
    },
    {
      id: "5",
      sourceUrl: "/blog/automation-guide",
      targetUrl: "/integrations",
      anchorText: "integrations",
      linkPosition: "sidebar",
      linkType: "text",
      status: "active",
      pageAuthority: 68,
      linkEquity: 75,
      clickThroughRate: 6.2,
      lastCrawled: "2024-01-20 10:45",
      isOptimized: false,
      sourcePageTitle: "Automation Guide",
      targetPageTitle: "Integrations",
      depth: 2
    }
  ];

  // Mock link opportunities data
  const linkOpportunities: LinkOpportunity[] = [
    {
      id: "1",
      sourceUrl: "/blog/seo-tips",
      targetUrl: "/tools/serp-preview",
      suggestedAnchor: "SERP preview tool",
      reason: "High relevance between content and target page",
      priority: "high",
      potentialImpact: 85
    },
    {
      id: "2",
      sourceUrl: "/features",
      targetUrl: "/case-studies",
      suggestedAnchor: "customer success stories",
      reason: "Social proof opportunity on features page",
      priority: "medium",
      potentialImpact: 72
    },
    {
      id: "3",
      sourceUrl: "/pricing",
      targetUrl: "/demo",
      suggestedAnchor: "try our demo",
      reason: "Conversion opportunity from pricing page",
      priority: "high",
      potentialImpact: 90
    }
  ];

  const filteredLinks = internalLinks.filter(link => {
    const matchesSearch = searchTerm === "" || 
      link.sourceUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.anchorText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || link.status === filterStatus;
    const matchesPosition = filterPosition === "all" || link.linkPosition === filterPosition;
    const matchesType = filterType === "all" || link.linkType === filterType;
    
    return matchesSearch && matchesStatus && matchesPosition && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "broken":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "redirect":
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case "nofollow":
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "broken":
        return "destructive";
      case "redirect":
        return "default";
      case "nofollow":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "header":
        return "bg-blue-100 text-blue-800";
      case "content":
        return "bg-green-100 text-green-800";
      case "footer":
        return "bg-gray-100 text-gray-800";
      case "sidebar":
        return "bg-orange-100 text-orange-800";
      case "navigation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
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
            <h1 className="text-3xl font-bold">Internal Links</h1>
            <p className="text-muted-foreground mt-2">
              Manage and optimize your internal linking structure to improve SEO and user navigation
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link Suggestion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Link Suggestion</DialogTitle>
                  <DialogDescription>
                    Suggest an internal link to improve your site's linking structure
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source" className="text-right">Source Page</Label>
                    <Input id="source" placeholder="/blog/article" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="target" className="text-right">Target Page</Label>
                    <Input id="target" placeholder="/products/tool" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="anchor" className="text-right">Anchor Text</Label>
                    <Input id="anchor" placeholder="relevant keyword" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">Position</Label>
                    <Select defaultValue="content">
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="footer">Footer</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="navigation">Navigation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Add Suggestion</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Internal Links</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{linkMetrics.totalInternalLinks.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {linkMetrics.averageLinksPerPage.toFixed(1)} avg per page
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orphan Pages</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{linkMetrics.orphanPages}</div>
              <div className="text-xs text-muted-foreground">
                Pages with no internal links
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Link Equity Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{linkMetrics.linkEquityDistribution}%</div>
              <div className="text-xs text-muted-foreground">
                Well distributed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Depth</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{linkMetrics.deepestPage}</div>
              <div className="text-xs text-muted-foreground">
                Clicks from homepage
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Link Health Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Status Distribution</CardTitle>
              <CardDescription>Health of your internal links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Active Links</span>
                </div>
                <span className="text-sm font-medium">
                  {internalLinks.filter(l => l.status === "active").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm">Broken Links</span>
                </div>
                <span className="text-sm font-medium">
                  {internalLinks.filter(l => l.status === "broken").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm">Redirected Links</span>
                </div>
                <span className="text-sm font-medium">
                  {internalLinks.filter(l => l.status === "redirect").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Position Analysis</CardTitle>
              <CardDescription>Where your links are placed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["content", "header", "navigation", "sidebar", "footer"].map((position) => {
                  const count = internalLinks.filter(l => l.linkPosition === position).length;
                  const percentage = (count / internalLinks.length) * 100;
                  return (
                    <div key={position} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{position}</span>
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

        {/* Main Content */}
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList>
            <TabsTrigger value="links">All Links</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="orphans">Orphan Pages</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-6">
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
                        placeholder="Search links, URLs, or anchor text..."
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
                      <SelectItem value="broken">Broken</SelectItem>
                      <SelectItem value="redirect">Redirected</SelectItem>
                      <SelectItem value="nofollow">No Follow</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPosition} onValueChange={setFilterPosition}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="navigation">Navigation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="text">Text Link</SelectItem>
                      <SelectItem value="image">Image Link</SelectItem>
                      <SelectItem value="button">Button Link</SelectItem>
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
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("optimize")}>
                        Optimize Selected
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("analyze")}>
                        Analyze Selected
                      </Button>
                      <Button size="sm" onClick={() => handleBulkAction("export")}>
                        Export Selected
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Internal Links Table */}
            <Card>
              <CardHeader>
                <CardTitle>Internal Links ({filteredLinks.length})</CardTitle>
                <CardDescription>
                  Complete overview of your internal linking structure
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
                                setSelectedLinks(filteredLinks.map(l => l.id));
                              } else {
                                setSelectedLinks([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Source → Target</TableHead>
                        <TableHead>Anchor Text</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Link Equity</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Depth</TableHead>
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
                                  setSelectedLinks(selectedLinks.filter(id => id !== link.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{link.sourceUrl}</div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <ArrowRight className="h-3 w-3 mx-1" />
                                {link.targetUrl}
                              </div>
                              {link.sourcePageTitle && (
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {link.sourcePageTitle}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="truncate max-w-[150px]">{link.anchorText}</span>
                              {link.isOptimized && (
                                <Badge variant="success" className="ml-2 text-xs">
                                  Optimized
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPositionColor(link.linkPosition)}>
                              {link.linkPosition}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {link.linkType}
                            </div>
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
                              <div className="font-medium">{link.linkEquity}%</div>
                              <div className="text-xs text-muted-foreground">
                                PA: {link.pageAuthority}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {link.clickThroughRate.toFixed(1)}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {link.depth}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Edit Link">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Analyze">
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Open Link">
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

          <TabsContent value="opportunities" className="space-y-6">
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                We've identified {linkOpportunities.length} internal linking opportunities that could boost your SEO performance.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Link Building Opportunities</CardTitle>
                <CardDescription>Suggested internal links to improve your site structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {linkOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">
                            Add link from <code className="bg-muted px-1 rounded">{opportunity.sourceUrl}</code>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            to <code className="bg-muted px-1 rounded">{opportunity.targetUrl}</code>
                          </div>
                          <div className="text-sm mb-2">
                            <strong>Suggested anchor:</strong> "{opportunity.suggestedAnchor}"
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {opportunity.reason}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getPriorityColor(opportunity.priority)}>
                            {opportunity.priority}
                          </Badge>
                          <div className="text-sm font-medium text-green-600">
                            +{opportunity.potentialImpact}% impact
                          </div>
                          <Button size="sm" variant="outline">Implement</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automated Suggestions</CardTitle>
                <CardDescription>AI-powered internal linking recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-2">
                      <Zap className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">Content-Based Suggestions</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      Based on content analysis, we recommend adding 12 contextual links between related blog posts and product pages.
                    </div>
                    <Button size="sm" className="mt-2" variant="outline">
                      Review Suggestions
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center mb-2">
                      <Network className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">Structure Optimization</span>
                    </div>
                    <div className="text-sm text-green-800">
                      Add hub pages and topic clusters to improve your site's topical authority and link equity distribution.
                    </div>
                    <Button size="sm" className="mt-2" variant="outline">
                      Create Hub Pages
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orphans" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have {linkMetrics.orphanPages} orphan pages with no internal links pointing to them. 
                These pages may not be discovered by search engines or users.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Orphan Pages</CardTitle>
                <CardDescription>Pages with no internal links pointing to them</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      url: "/hidden-product-page",
                      title: "Hidden Product Features",
                      lastModified: "2024-01-15",
                      pageAuthority: 15,
                      organicTraffic: 0
                    },
                    {
                      url: "/old-blog-post",
                      title: "Outdated SEO Techniques",
                      lastModified: "2023-12-20",
                      pageAuthority: 8,
                      organicTraffic: 12
                    },
                    {
                      url: "/test-landing-page",
                      title: "Test Landing Page",
                      lastModified: "2024-01-10",
                      pageAuthority: 5,
                      organicTraffic: 0
                    }
                  ].map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{page.url}</div>
                        <div className="text-sm text-muted-foreground">{page.title}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>PA: {page.pageAuthority}</span>
                          <span>Traffic: {page.organicTraffic}/month</span>
                          <span>Modified: {page.lastModified}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Orphan</Badge>
                        <Button size="sm" variant="outline">Add Links</Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Link Depth Analysis</CardTitle>
                  <CardDescription>How deep your pages are from the homepage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((depth) => {
                      const count = internalLinks.filter(l => l.depth === depth).length;
                      const percentage = count > 0 ? (count / internalLinks.length) * 100 : 0;
                      return (
                        <div key={depth} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Level {depth}</span>
                            <span>{count} pages ({percentage.toFixed(1)}%)</span>
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
                  <CardTitle>Link Equity Flow</CardTitle>
                  <CardDescription>How link equity is distributed across your site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-green-600">
                      {linkMetrics.linkEquityDistribution}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Link equity distribution score
                    </div>
                    <div className="text-xs text-muted-foreground">
                      A score above 70% indicates well-distributed link equity across your site structure.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Site Architecture Recommendations</CardTitle>
                <CardDescription>Suggestions to improve your internal link structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium text-green-900">Good: Flat Site Architecture</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Most of your pages are within 3 clicks from the homepage, which is excellent for SEO.
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="font-medium text-orange-900">Improve: Add Contextual Links</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Add more contextual links within your blog content to distribute link equity more effectively.
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="font-medium text-red-900">Fix: Orphan Pages</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {linkMetrics.orphanPages} pages have no internal links pointing to them and need attention.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Internal Link Monitoring</CardTitle>
                <CardDescription>Configure how internal links are tracked and analyzed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="crawl-frequency">Crawl Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="max-depth">Maximum Crawl Depth</Label>
                      <Input type="number" defaultValue="10" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="min-equity">Minimum Link Equity Threshold</Label>
                      <Input type="number" defaultValue="5" className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Link Analysis Options</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Track click-through rates</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Monitor link equity distribution</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Alert on broken internal links</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Auto-suggest optimization opportunities</span>
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
                <CardTitle>Exclusion Rules</CardTitle>
                <CardDescription>URLs or patterns to exclude from internal link analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Enter URLs or patterns to exclude (one per line)&#10;e.g., /admin/*&#10;/api/*&#10;/temp/*"
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

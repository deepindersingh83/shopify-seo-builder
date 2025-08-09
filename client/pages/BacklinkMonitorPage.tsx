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
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Globe,
  Calendar,
  Eye,
  Zap,
  Target,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

interface Backlink {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number;
  pageAuthority: number;
  linkType: "dofollow" | "nofollow";
  status: "active" | "lost" | "new" | "broken";
  firstSeen: string;
  lastSeen: string;
  traffic: number;
  category: string;
  spamScore: number;
}

interface DomainMetrics {
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  trustFlow: number;
  citationFlow: number;
  organicTraffic: number;
  monthlyChange: {
    backlinks: number;
    domains: number;
    authority: number;
  };
}

export default function BacklinkMonitorPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Mock data - in a real app, this would come from your analytics service
  const domainMetrics: DomainMetrics = {
    totalBacklinks: 1247,
    referringDomains: 345,
    domainAuthority: 68,
    trustFlow: 45,
    citationFlow: 52,
    organicTraffic: 125000,
    monthlyChange: {
      backlinks: 23,
      domains: 8,
      authority: 2
    }
  };

  const backlinks: Backlink[] = [
    {
      id: "1",
      sourceUrl: "https://techcrunch.com/2024/ecommerce-trends",
      sourceDomain: "techcrunch.com",
      targetUrl: "/products/automation-tools",
      anchorText: "best ecommerce automation tools",
      domainAuthority: 94,
      pageAuthority: 78,
      linkType: "dofollow",
      status: "active",
      firstSeen: "2024-01-15",
      lastSeen: "2024-01-20",
      traffic: 1250,
      category: "Technology",
      spamScore: 1
    },
    {
      id: "2",
      sourceUrl: "https://shopify.com/blog/seo-optimization",
      sourceDomain: "shopify.com",
      targetUrl: "/seo/tools",
      anchorText: "advanced SEO tools",
      domainAuthority: 91,
      pageAuthority: 72,
      linkType: "dofollow",
      status: "active",
      firstSeen: "2024-01-10",
      lastSeen: "2024-01-19",
      traffic: 2100,
      category: "E-commerce",
      spamScore: 0
    },
    {
      id: "3",
      sourceUrl: "https://example-blog.com/shopify-apps",
      sourceDomain: "example-blog.com",
      targetUrl: "/",
      anchorText: "homepage link",
      domainAuthority: 32,
      pageAuthority: 28,
      linkType: "nofollow",
      status: "lost",
      firstSeen: "2023-12-20",
      lastSeen: "2024-01-01",
      traffic: 120,
      category: "Blog",
      spamScore: 15
    },
    {
      id: "4",
      sourceUrl: "https://ecommercenews.co/seo-tools-review",
      sourceDomain: "ecommercenews.co",
      targetUrl: "/features",
      anchorText: "comprehensive SEO features",
      domainAuthority: 58,
      pageAuthority: 45,
      linkType: "dofollow",
      status: "new",
      firstSeen: "2024-01-18",
      lastSeen: "2024-01-20",
      traffic: 580,
      category: "News",
      spamScore: 3
    },
    {
      id: "5",
      sourceUrl: "https://broken-site.com/resources",
      sourceDomain: "broken-site.com",
      targetUrl: "/tools/seo",
      anchorText: "SEO tools",
      domainAuthority: 41,
      pageAuthority: 35,
      linkType: "dofollow",
      status: "broken",
      firstSeen: "2023-11-15",
      lastSeen: "2023-12-10",
      traffic: 250,
      category: "Resources",
      spamScore: 8
    }
  ];

  const filteredBacklinks = backlinks.filter(backlink => {
    const matchesSearch = searchTerm === "" || 
      backlink.sourceDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backlink.anchorText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || backlink.status === filterStatus;
    const matchesType = filterType === "all" || backlink.linkType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "lost":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "new":
        return <Zap className="h-4 w-4 text-blue-500" />;
      case "broken":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "lost":
        return "destructive";
      case "new":
        return "default";
      case "broken":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Backlink Monitor</h1>
            <p className="text-muted-foreground mt-2">
              Track and analyze your backlink profile to improve domain authority and search rankings
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              New Outreach Campaign
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backlinks</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{domainMetrics.totalBacklinks.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getTrendIcon(domainMetrics.monthlyChange.backlinks)}
                <span className="ml-1">
                  {domainMetrics.monthlyChange.backlinks > 0 ? '+' : ''}
                  {domainMetrics.monthlyChange.backlinks} this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referring Domains</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{domainMetrics.referringDomains}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getTrendIcon(domainMetrics.monthlyChange.domains)}
                <span className="ml-1">
                  {domainMetrics.monthlyChange.domains > 0 ? '+' : ''}
                  {domainMetrics.monthlyChange.domains} this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domain Authority</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{domainMetrics.domainAuthority}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getTrendIcon(domainMetrics.monthlyChange.authority)}
                <span className="ml-1">
                  {domainMetrics.monthlyChange.authority > 0 ? '+' : ''}
                  {domainMetrics.monthlyChange.authority} this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{domainMetrics.organicTraffic.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Monthly visitors</div>
            </CardContent>
          </Card>
        </div>

        {/* Authority Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust & Citation Flow</CardTitle>
              <CardDescription>Domain trust and citation flow metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Trust Flow</span>
                  <span className="font-medium">{domainMetrics.trustFlow}/100</span>
                </div>
                <Progress value={domainMetrics.trustFlow} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Citation Flow</span>
                  <span className="font-medium">{domainMetrics.citationFlow}/100</span>
                </div>
                <Progress value={domainMetrics.citationFlow} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Status Distribution</CardTitle>
              <CardDescription>Current status of your backlinks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Active Links</span>
                  </div>
                  <span className="text-sm font-medium">
                    {backlinks.filter(b => b.status === "active").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">New Links</span>
                  </div>
                  <span className="text-sm font-medium">
                    {backlinks.filter(b => b.status === "new").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm">Lost Links</span>
                  </div>
                  <span className="text-sm font-medium">
                    {backlinks.filter(b => b.status === "lost").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-sm">Broken Links</span>
                  </div>
                  <span className="text-sm font-medium">
                    {backlinks.filter(b => b.status === "broken").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="backlinks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="backlinks">All Backlinks</TabsTrigger>
            <TabsTrigger value="new">New Links</TabsTrigger>
            <TabsTrigger value="lost">Lost Links</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="backlinks" className="space-y-6">
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
                        placeholder="Search domains or anchor text..."
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
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="broken">Broken</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Link Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="dofollow">Dofollow</SelectItem>
                      <SelectItem value="nofollow">Nofollow</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Backlinks Table */}
            <Card>
              <CardHeader>
                <CardTitle>Backlink Portfolio ({filteredBacklinks.length})</CardTitle>
                <CardDescription>
                  Comprehensive view of your backlink profile and link metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Domain</TableHead>
                        <TableHead>Anchor Text</TableHead>
                        <TableHead>DA/PA</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Traffic</TableHead>
                        <TableHead>Spam Score</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBacklinks.map((backlink) => (
                        <TableRow key={backlink.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{backlink.sourceDomain}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {backlink.sourceUrl}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[150px] truncate" title={backlink.anchorText}>
                              {backlink.anchorText}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>DA: {backlink.domainAuthority}</div>
                              <div className="text-muted-foreground">PA: {backlink.pageAuthority}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={backlink.linkType === "dofollow" ? "default" : "secondary"}>
                              {backlink.linkType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(backlink.status)}
                              <Badge 
                                variant={getStatusBadgeVariant(backlink.status)}
                                className="ml-2"
                              >
                                {backlink.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {backlink.traffic.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={backlink.spamScore <= 5 ? "success" : 
                                     backlink.spamScore <= 15 ? "secondary" : "destructive"}
                            >
                              {backlink.spamScore}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{backlink.lastSeen}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
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

          <TabsContent value="new" className="space-y-6">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                You have {backlinks.filter(b => b.status === "new").length} new backlinks discovered in the last 30 days.
                Review these links to ensure they're beneficial for your SEO strategy.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Recently Discovered Backlinks</CardTitle>
                <CardDescription>New backlinks found in the last {selectedTimeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backlinks.filter(b => b.status === "new").map((backlink) => (
                    <div key={backlink.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{backlink.sourceDomain}</div>
                        <div className="text-sm text-muted-foreground">{backlink.anchorText}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>DA: {backlink.domainAuthority}</span>
                          <span>Traffic: {backlink.traffic.toLocaleString()}</span>
                          <span>First seen: {backlink.firstSeen}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">New</Badge>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lost" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have {backlinks.filter(b => b.status === "lost").length} lost backlinks.
                Consider reaching out to these domains to restore the links or find alternatives.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Lost Backlinks</CardTitle>
                <CardDescription>Backlinks that are no longer active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backlinks.filter(b => b.status === "lost").map((backlink) => (
                    <div key={backlink.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{backlink.sourceDomain}</div>
                        <div className="text-sm text-muted-foreground">{backlink.anchorText}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>DA: {backlink.domainAuthority}</span>
                          <span>Was bringing: {backlink.traffic.toLocaleString()} traffic</span>
                          <span>Lost on: {backlink.lastSeen}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Lost</Badge>
                        <Button size="sm" variant="outline">Reclaim</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Link Building Opportunities</CardTitle>
                <CardDescription>Potential domains and strategies for new backlinks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Competitor Backlinks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">High-value domains</span>
                            <Badge>47 opportunities</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Industry publications</span>
                            <Badge>23 opportunities</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Resource pages</span>
                            <Badge>31 opportunities</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Broken Link Building</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Broken external links</span>
                            <Badge>12 opportunities</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Dead resource links</span>
                            <Badge>8 opportunities</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">404 mentions</span>
                            <Badge>5 opportunities</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommended Outreach Targets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            domain: "ecommerce-weekly.com",
                            da: 72,
                            traffic: 450000,
                            opportunity: "Guest post about automation trends",
                            difficulty: "Medium"
                          },
                          {
                            domain: "shopifypartners.com",
                            da: 88,
                            traffic: 1200000,
                            opportunity: "App directory listing",
                            difficulty: "Easy"
                          },
                          {
                            domain: "seo-news.org",
                            da: 65,
                            traffic: 230000,
                            opportunity: "Tool review and mention",
                            difficulty: "Hard"
                          }
                        ].map((target, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{target.domain}</div>
                              <div className="text-sm text-muted-foreground">{target.opportunity}</div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>DA: {target.da}</span>
                                <span>Traffic: {target.traffic.toLocaleString()}</span>
                                <Badge variant={
                                  target.difficulty === "Easy" ? "success" :
                                  target.difficulty === "Medium" ? "secondary" : "destructive"
                                }>
                                  {target.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">Start Outreach</Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

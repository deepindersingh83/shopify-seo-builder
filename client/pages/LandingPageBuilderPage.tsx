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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Layout as LayoutIcon,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  Search,
  Target,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Type,
  Image,
  Video,
  Code,
  Settings,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Award,
  Zap,
  Lightbulb,
  MousePointer,
  Activity,
  Calendar,
  ExternalLink,
  Share2,
  Filter,
} from "lucide-react";

interface LandingPage {
  id: string;
  name: string;
  url: string;
  status: "draft" | "published" | "archived" | "testing";
  template: string;
  targetKeywords: string[];
  category: string;
  campaign: string;
  createdDate: string;
  lastModified: string;
  views: number;
  conversions: number;
  conversionRate: number;
  seoScore: number;
  pageSpeed: number;
  mobileOptimized: boolean;
  publishedBy: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category:
    | "ecommerce"
    | "lead_generation"
    | "event"
    | "product_launch"
    | "seasonal";
  preview: string;
  seoOptimized: boolean;
  mobileFirst: boolean;
  conversionFocused: boolean;
  features: string[];
  estimatedConversionRate: number;
}

interface SEOElement {
  id: string;
  type:
    | "title"
    | "meta_description"
    | "heading"
    | "content"
    | "image_alt"
    | "schema";
  content: string;
  optimizationScore: number;
  suggestions: string[];
  status: "optimized" | "needs_work" | "critical";
}

interface ConversionElement {
  id: string;
  type:
    | "cta_button"
    | "form"
    | "headline"
    | "value_proposition"
    | "testimonial"
    | "trust_signal";
  content: string;
  position: "above_fold" | "middle" | "below_fold";
  performance: number;
  testVariants?: string[];
}

export default function LandingPageBuilderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Mock landing pages data
  const landingPages: LandingPage[] = [
    {
      id: "1",
      name: "Black Friday Electronics Sale",
      url: "/landing/black-friday-electronics",
      status: "published",
      template: "seasonal-sale",
      targetKeywords: [
        "black friday electronics",
        "tech deals",
        "discount electronics",
      ],
      category: "Seasonal",
      campaign: "Black Friday 2024",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      views: 15400,
      conversions: 892,
      conversionRate: 5.8,
      seoScore: 94,
      pageSpeed: 87,
      mobileOptimized: true,
      publishedBy: "Marketing Team",
    },
    {
      id: "2",
      name: "Premium Headphones Landing",
      url: "/landing/premium-headphones",
      status: "published",
      template: "product-showcase",
      targetKeywords: [
        "premium headphones",
        "wireless audio",
        "noise cancelling",
      ],
      category: "Product",
      campaign: "Product Launch Q1",
      createdDate: "2024-01-10",
      lastModified: "2024-01-18",
      views: 8920,
      conversions: 445,
      conversionRate: 5.0,
      seoScore: 91,
      pageSpeed: 82,
      mobileOptimized: true,
      publishedBy: "Product Team",
    },
    {
      id: "3",
      name: "Home Office Setup Guide",
      url: "/landing/home-office-guide",
      status: "testing",
      template: "content-lead",
      targetKeywords: [
        "home office setup",
        "remote work essentials",
        "office furniture",
      ],
      category: "Lead Generation",
      campaign: "Content Marketing",
      createdDate: "2024-01-08",
      lastModified: "2024-01-19",
      views: 5680,
      conversions: 234,
      conversionRate: 4.1,
      seoScore: 88,
      pageSpeed: 79,
      mobileOptimized: false,
      publishedBy: "Content Team",
    },
    {
      id: "4",
      name: "Summer Fashion Collection",
      url: "/landing/summer-fashion",
      status: "draft",
      template: "collection-showcase",
      targetKeywords: ["summer fashion", "seasonal clothing", "trendy outfits"],
      category: "Collection",
      campaign: "Summer 2024",
      createdDate: "2024-01-12",
      lastModified: "2024-01-20",
      views: 0,
      conversions: 0,
      conversionRate: 0,
      seoScore: 72,
      pageSpeed: 0,
      mobileOptimized: true,
      publishedBy: "Design Team",
    },
  ];

  // Mock templates
  const templates: Template[] = [
    {
      id: "1",
      name: "Product Showcase",
      description:
        "Perfect for highlighting a single product with detailed features and benefits",
      category: "ecommerce",
      preview: "/templates/product-showcase.jpg",
      seoOptimized: true,
      mobileFirst: true,
      conversionFocused: true,
      features: [
        "Hero section",
        "Product gallery",
        "Feature highlights",
        "Customer reviews",
        "CTA section",
      ],
      estimatedConversionRate: 4.8,
    },
    {
      id: "2",
      name: "Seasonal Sale",
      description:
        "High-converting template for limited-time offers and seasonal campaigns",
      category: "seasonal",
      preview: "/templates/seasonal-sale.jpg",
      seoOptimized: true,
      mobileFirst: true,
      conversionFocused: true,
      features: [
        "Countdown timer",
        "Deal highlights",
        "Product grid",
        "Urgency messaging",
        "Social proof",
      ],
      estimatedConversionRate: 6.2,
    },
    {
      id: "3",
      name: "Lead Generation",
      description:
        "Optimized for capturing leads with compelling value propositions",
      category: "lead_generation",
      preview: "/templates/lead-generation.jpg",
      seoOptimized: true,
      mobileFirst: true,
      conversionFocused: true,
      features: [
        "Lead magnet section",
        "Benefits list",
        "Form optimization",
        "Trust signals",
        "Thank you page",
      ],
      estimatedConversionRate: 3.5,
    },
    {
      id: "4",
      name: "Event Landing",
      description: "Perfect for webinars, product launches, and special events",
      category: "event",
      preview: "/templates/event-landing.jpg",
      seoOptimized: true,
      mobileFirst: true,
      conversionFocused: true,
      features: [
        "Event details",
        "Speaker profiles",
        "Registration form",
        "Schedule",
        "FAQ section",
      ],
      estimatedConversionRate: 4.1,
    },
  ];

  // Mock SEO elements for page optimization
  const seoElements: SEOElement[] = [
    {
      id: "1",
      type: "title",
      content: "Black Friday Electronics Sale - Up to 70% Off Tech Deals",
      optimizationScore: 92,
      suggestions: ["Consider adding brand name", "Include year for freshness"],
      status: "optimized",
    },
    {
      id: "2",
      type: "meta_description",
      content:
        "Discover amazing Black Friday deals on electronics. Premium headphones, laptops, and tech accessories at unbeatable prices. Limited time offer!",
      optimizationScore: 88,
      suggestions: ["Add call-to-action", "Include shipping info"],
      status: "optimized",
    },
    {
      id: "3",
      type: "heading",
      content: "Unbeatable Black Friday Tech Deals",
      optimizationScore: 85,
      suggestions: ["Include specific discount percentage", "Add urgency"],
      status: "needs_work",
    },
  ];

  // Mock conversion elements
  const conversionElements: ConversionElement[] = [
    {
      id: "1",
      type: "cta_button",
      content: "Shop Now - Save 70%",
      position: "above_fold",
      performance: 8.5,
      testVariants: ["Get Deal Now", "Save Big Today", "Shop Sale"],
    },
    {
      id: "2",
      type: "headline",
      content: "Black Friday Mega Sale - Limited Time Only!",
      position: "above_fold",
      performance: 7.2,
      testVariants: ["Biggest Sale of the Year", "Black Friday Blowout"],
    },
    {
      id: "3",
      type: "value_proposition",
      content:
        "Premium electronics at wholesale prices. Free shipping on orders over $50.",
      position: "above_fold",
      performance: 6.8,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "testing":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "archived":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "testing":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ecommerce":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "lead_generation":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "product_launch":
        return <Star className="h-4 w-4 text-orange-500" />;
      case "seasonal":
        return <Award className="h-4 w-4 text-red-500" />;
      default:
        return <LayoutIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSEOStatusColor = (status: string) => {
    switch (status) {
      case "optimized":
        return "text-green-600 bg-green-50 border-green-200";
      case "needs_work":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const filteredPages = landingPages.filter((page) => {
    const matchesSearch =
      searchTerm === "" ||
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.campaign.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || page.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || page.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on pages:`, selectedPages);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Landing Page Builder</h1>
            <p className="text-muted-foreground mt-2">
              Create SEO-optimized landing pages for campaigns with AI-powered
              conversion optimization
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Pages
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Landing Page
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Create New Landing Page</DialogTitle>
                  <DialogDescription>
                    Start with a template optimized for conversions and SEO
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="page-name">Page Name</Label>
                      <Input
                        id="page-name"
                        placeholder="My Campaign Landing Page"
                      />
                    </div>
                    <div>
                      <Label htmlFor="campaign">Campaign</Label>
                      <Input id="campaign" placeholder="Q1 2024 Launch" />
                    </div>
                  </div>
                  <div>
                    <Label>Choose Template</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {templates.slice(0, 4).map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-center mb-2">
                            {getCategoryIcon(template.category)}
                            <span className="font-medium ml-2">
                              {template.name}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              {template.estimatedConversionRate}% CVR
                            </Badge>
                            <div className="flex gap-1">
                              {template.seoOptimized && (
                                <Badge variant="success" className="text-xs">
                                  SEO
                                </Badge>
                              )}
                              {template.mobileFirst && (
                                <Badge variant="default" className="text-xs">
                                  Mobile
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="target-keywords">Target Keywords</Label>
                    <Input
                      id="target-keywords"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Page
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <LayoutIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{landingPages.length}</div>
              <div className="text-xs text-muted-foreground">
                {landingPages.filter((p) => p.status === "published").length}{" "}
                published
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversions
              </CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {landingPages
                  .reduce((sum, p) => sum + p.conversions, 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  landingPages.reduce((sum, p) => sum + p.conversionRate, 0) /
                  landingPages.filter((p) => p.conversionRate > 0).length
                ).toFixed(1)}
                %
              </div>
              <div className="text-xs text-muted-foreground">
                Across all pages
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg SEO Score
              </CardTitle>
              <Search className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  landingPages.reduce((sum, p) => sum + p.seoScore, 0) /
                    landingPages.length,
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Overall optimization
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common landing page management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Zap className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">A/B Test Pages</div>
                  <div className="text-sm text-muted-foreground">
                    Optimize conversion rates
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Search className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">SEO Audit</div>
                  <div className="text-sm text-muted-foreground">
                    Check page optimization
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <BarChart3 className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Analytics Report</div>
                  <div className="text-sm text-muted-foreground">
                    View performance data
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Copy className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Clone Best Page</div>
                  <div className="text-sm text-muted-foreground">
                    Replicate top performer
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pages">All Pages</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="seo-optimization">SEO Optimization</TabsTrigger>
            <TabsTrigger value="conversion-testing">A/B Testing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
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
                        placeholder="Search pages..."
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
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Seasonal">Seasonal</SelectItem>
                      <SelectItem value="Lead Generation">
                        Lead Generation
                      </SelectItem>
                      <SelectItem value="Collection">Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedPages.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedPages.length} page(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("publish")}
                      >
                        Publish Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("test")}
                      >
                        Start A/B Test
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBulkAction("clone")}
                      >
                        Clone Selected
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Landing Pages Table */}
            <Card>
              <CardHeader>
                <CardTitle>Landing Pages ({filteredPages.length})</CardTitle>
                <CardDescription>
                  Manage and optimize your landing pages for maximum conversions
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
                                setSelectedPages(
                                  filteredPages.map((p) => p.id),
                                );
                              } else {
                                setSelectedPages([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Page Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>SEO Score</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedPages.includes(page.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPages([...selectedPages, page.id]);
                                } else {
                                  setSelectedPages(
                                    selectedPages.filter(
                                      (id) => id !== page.id,
                                    ),
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{page.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {page.url}
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline">{page.category}</Badge>
                                <span className="text-muted-foreground">
                                  {page.campaign}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Keywords: {page.targetKeywords.join(", ")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(page.status)}
                              <Badge
                                variant={getStatusBadgeVariant(page.status)}
                                className="ml-2"
                              >
                                {page.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {page.views.toLocaleString()} views
                              </div>
                              <div className="flex items-center">
                                <Target className="h-3 w-3 mr-1" />
                                {page.conversions.toLocaleString()} conversions
                              </div>
                              <div className="font-medium text-green-600">
                                {page.conversionRate}% CVR
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">
                                {page.seoScore}
                              </span>
                              <Progress
                                value={page.seoScore}
                                className="w-16 h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                {page.mobileOptimized ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-1" />
                                )}
                                <span className="text-xs">Mobile</span>
                              </div>
                              <div className="flex items-center">
                                <Activity className="h-3 w-3 mr-1" />
                                <span className="text-xs">
                                  {page.pageSpeed} speed
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{page.lastModified}</div>
                              <div className="text-muted-foreground text-xs">
                                by {page.publishedBy}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="Preview">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Clone">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Analytics"
                              >
                                <BarChart3 className="h-4 w-4" />
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

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Landing Page Templates</CardTitle>
                <CardDescription>
                  Pre-built templates optimized for different use cases and
                  industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Image className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getCategoryIcon(template.category)}
                            <h3 className="font-semibold ml-2">
                              {template.name}
                            </h3>
                          </div>
                          <Badge variant="outline">
                            {template.estimatedConversionRate}% CVR
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.seoOptimized && (
                            <Badge variant="success" className="text-xs">
                              SEO Optimized
                            </Badge>
                          )}
                          {template.mobileFirst && (
                            <Badge variant="default" className="text-xs">
                              Mobile First
                            </Badge>
                          )}
                          {template.conversionFocused && (
                            <Badge variant="secondary" className="text-xs">
                              Conversion Focused
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Features:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {template.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Plus className="h-3 w-3 mr-1" />
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo-optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Optimization Center</CardTitle>
                <CardDescription>
                  Optimize your landing pages for search engines with AI-powered
                  suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {seoElements.map((element) => (
                    <div key={element.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              className={getSEOStatusColor(element.status)}
                            >
                              {element.type.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline">
                              Score: {element.optimizationScore}
                            </Badge>
                          </div>
                          <div className="font-medium mb-2">
                            {element.content}
                          </div>
                        </div>
                        <Progress
                          value={element.optimizationScore}
                          className="w-24 h-2"
                        />
                      </div>

                      {element.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Suggestions:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {element.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-center">
                                <Lightbulb className="h-3 w-3 text-yellow-500 mr-2" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-optimize
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion-testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>A/B Testing & Conversion Optimization</CardTitle>
                <CardDescription>
                  Test different elements to maximize conversion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {conversionElements.map((element) => (
                    <div key={element.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="default">
                              {element.type.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline">
                              {element.position.replace("_", " ")}
                            </Badge>
                            <Badge variant="success">
                              Performance: {element.performance}
                            </Badge>
                          </div>
                          <div className="font-medium mb-2">
                            {element.content}
                          </div>
                        </div>
                      </div>

                      {element.testVariants &&
                        element.testVariants.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                              Test Variants:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {element.testVariants.map((variant, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-gray-50 rounded text-sm"
                                >
                                  {variant}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Activity className="h-3 w-3 mr-1" />
                          Start A/B Test
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Element
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          View Results
                        </Button>
                      </div>
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
                  <CardTitle>Conversion Rate Trends</CardTitle>
                  <CardDescription>
                    Landing page performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mr-4" />
                    <div>
                      <div className="font-medium">Conversion Rate Chart</div>
                      <div className="text-sm">
                        Interactive chart would be rendered here
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Pages</CardTitle>
                  <CardDescription>
                    Pages with highest conversion rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {landingPages
                      .filter((p) => p.conversionRate > 0)
                      .sort((a, b) => b.conversionRate - a.conversionRate)
                      .slice(0, 5)
                      .map((page, index) => (
                        <div
                          key={page.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {page.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {page.conversions} conversions
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">
                              {page.conversionRate}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {page.views.toLocaleString()} views
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  Key metrics and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      $
                      {landingPages
                        .reduce((sum, p) => sum + p.conversions * 50, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Revenue
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Based on $50 avg order value
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(
                        landingPages.reduce((sum, p) => sum + p.pageSpeed, 0) /
                          landingPages.length,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Page Speed
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Google PageSpeed score
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round(
                        (landingPages.filter((p) => p.mobileOptimized).length /
                          landingPages.length) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mobile Optimized
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Pages optimized for mobile
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

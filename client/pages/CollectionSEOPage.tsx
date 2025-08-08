import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Folder,
  Tags,
  FileText,
  Star,
  Search,
  Target,
  BarChart3,
  Edit,
  Plus,
  ArrowLeft,
  Zap,
  Bot,
  Globe,
  Crown,
  Navigation,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Collection {
  id: string;
  name: string;
  type: "collection" | "category" | "cms_page" | "brand_page";
  slug: string;
  products: number;
  seoScore: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  lastOptimized: string;
  status: "optimized" | "needs_work" | "critical";
}

interface SEORecommendation {
  id: string;
  type: "title" | "description" | "keywords" | "content" | "breadcrumbs";
  priority: "high" | "medium" | "low";
  description: string;
  impact: string;
}

export default function CollectionSEOPage() {
  const [activeTab, setActiveTab] = useState("collections");
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const collections: Collection[] = [
    {
      id: "1",
      name: "Premium Electronics",
      type: "collection",
      slug: "premium-electronics",
      products: 247,
      seoScore: 78,
      metaTitle: "Premium Electronics | High-End Tech Gadgets",
      metaDescription: "Discover premium electronics and high-end tech gadgets...",
      keywords: ["premium electronics", "high-end gadgets", "luxury tech"],
      lastOptimized: "2024-01-15",
      status: "optimized",
    },
    {
      id: "2",
      name: "Men's Fashion",
      type: "category",
      slug: "mens-fashion",
      products: 892,
      seoScore: 45,
      keywords: ["mens fashion", "menswear", "style"],
      lastOptimized: "2023-12-20",
      status: "needs_work",
    },
    {
      id: "3",
      name: "About Our Brand",
      type: "cms_page",
      slug: "about-brand",
      products: 0,
      seoScore: 32,
      keywords: ["brand story", "company history"],
      lastOptimized: "2023-11-10",
      status: "critical",
    },
    {
      id: "4",
      name: "Apple Products",
      type: "brand_page",
      slug: "apple-products",
      products: 156,
      seoScore: 85,
      metaTitle: "Apple Products | Official Apple Store",
      metaDescription: "Shop the latest Apple products including iPhone, iPad, Mac...",
      keywords: ["apple products", "iphone", "ipad", "macbook"],
      lastOptimized: "2024-01-18",
      status: "optimized",
    },
  ];

  const recommendations: SEORecommendation[] = [
    {
      id: "1",
      type: "title",
      priority: "high",
      description: "Add target keywords to meta title",
      impact: "Can improve rankings by 15-25%",
    },
    {
      id: "2",
      type: "description",
      priority: "medium",
      description: "Optimize meta description length (120-160 chars)",
      impact: "Better CTR from search results",
    },
    {
      id: "3",
      type: "keywords",
      priority: "high",
      description: "Add long-tail keyword variations",
      impact: "Capture more specific search queries",
    },
    {
      id: "4",
      type: "breadcrumbs",
      priority: "low",
      description: "Implement breadcrumb schema markup",
      impact: "Enhanced search result display",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "collection": return <Folder className="h-4 w-4" />;
      case "category": return <Tags className="h-4 w-4" />;
      case "cms_page": return <FileText className="h-4 w-4" />;
      case "brand_page": return <Crown className="h-4 w-4" />;
      default: return <Folder className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimized": return "text-green-600";
      case "needs_work": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collection & Category SEO</h1>
            <p className="text-muted-foreground">
              Optimize collections, categories, CMS pages, and brand pages for maximum search visibility
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              🤖 AI-Powered SEO
            </Badge>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="cms">CMS Pages</TabsTrigger>
            <TabsTrigger value="brands">Brand Pages</TabsTrigger>
            <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      Smart Collections
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      SEO-optimized collections based on keyword data and search trends
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {collections
                        .filter(c => c.type === "collection")
                        .map((collection) => (
                          <div
                            key={collection.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => setSelectedCollection(collection)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(collection.type)}
                                <div>
                                  <h3 className="font-medium">{collection.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    /{collection.slug} • {collection.products} products
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className={`text-lg font-bold ${getStatusColor(collection.status)}`}>
                                  {collection.seoScore}/100
                                </div>
                                <div className="text-xs text-muted-foreground">SEO Score</div>
                              </div>
                              <Badge variant={collection.status === "optimized" ? "default" : "destructive"}>
                                {collection.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Bot className="h-4 w-4 mr-2" />
                      AI Collection Generator
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Keyword Clustering
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      Bulk SEO Optimization
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Breadcrumb Optimizer
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>SEO Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Average SEO Score</span>
                          <span className="font-medium">67/100</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Optimized Collections</span>
                          <span className="font-medium">12/28</span>
                        </div>
                        <Progress value={43} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Category SEO Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collections
                    .filter(c => c.type === "category")
                    .map((category) => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.products} products • Last optimized: {category.lastOptimized}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={category.status === "optimized" ? "default" : "destructive"}>
                              SEO Score: {category.seoScore}/100
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Category Keywords:</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Quick Actions:</label>
                            <div className="flex gap-2 mt-1">
                              <Button size="sm" variant="outline">Generate Description</Button>
                              <Button size="sm" variant="outline">Optimize Keywords</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CMS Pages Tab */}
          <TabsContent value="cms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CMS Page SEO
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optimize your About, Contact, and other content pages
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {collections
                    .filter(c => c.type === "cms_page")
                    .map((page) => (
                      <div key={page.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{page.name}</h3>
                            <p className="text-sm text-muted-foreground">/{page.slug}</p>
                          </div>
                          <Badge variant="destructive">
                            Critical: {page.seoScore}/100
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Meta Title:</label>
                              <Input
                                placeholder="Add compelling meta title..."
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Meta Description:</label>
                              <Textarea
                                placeholder="Add engaging meta description..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Target Keywords:</label>
                              <Input
                                placeholder="brand story, company history..."
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">SEO Recommendations:</label>
                              <div className="space-y-2 mt-1">
                                <div className="flex items-center justify-between text-sm p-2 border rounded">
                                  <span>Add schema markup</span>
                                  <Badge variant="destructive" className="text-xs">High</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 border rounded">
                                  <span>Optimize content length</span>
                                  <Badge variant="secondary" className="text-xs">Medium</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button>Save Changes</Button>
                          <Button variant="outline">Preview</Button>
                          <Button variant="outline">
                            <Bot className="h-4 w-4 mr-2" />
                            AI Optimize
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brand Pages Tab */}
          <TabsContent value="brands" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Brand Page Optimization
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create SEO-optimized brand landing pages
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collections
                    .filter(c => c.type === "brand_page")
                    .map((brand) => (
                      <div key={brand.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Crown className="h-8 w-8 text-yellow-600" />
                            <div>
                              <h3 className="font-semibold">{brand.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {brand.products} products • Excellent SEO performance
                              </p>
                            </div>
                          </div>
                          <Badge variant="default">
                            Optimized: {brand.seoScore}/100
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium">Brand Keywords:</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {brand.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Meta Title:</label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {brand.metaTitle}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Actions:</label>
                            <div className="flex gap-2 mt-1">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">Analytics</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI SEO Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{rec.description}</h4>
                          <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.impact}</p>
                        <div className="flex gap-2">
                          <Button size="sm">Apply Fix</Button>
                          <Button size="sm" variant="outline">Learn More</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    SEO Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Potential Traffic Increase</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Collections Optimization</span>
                            <span className="font-medium">+25%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Category Pages</span>
                            <span className="font-medium">+18%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Brand Pages</span>
                            <span className="font-medium">+35%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Implementation Priority</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm p-2 bg-red-50 rounded">
                          <span>Fix critical CMS pages</span>
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded">
                          <span>Optimize category structure</span>
                          <Badge variant="secondary" className="text-xs">High</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                          <span>Enhance brand pages</span>
                          <Badge variant="outline" className="text-xs">Medium</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

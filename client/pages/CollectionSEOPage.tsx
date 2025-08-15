import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Folder,
  Tags,
  FileText,
  Search,
  Target,
  BarChart3,
  Edit,
  Plus,
  ArrowLeft,
  Zap,
  Bot,
  Crown,
  Navigation,
  RefreshCw,
  Save,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import { collectionService, Collection, SEORecommendation, CollectionSEOData } from "@/services/collectionService";
import { useNotifications } from "@/hooks/use-notifications";
import { useLoading } from "@/hooks/use-loading";
import { useConfirmation } from "@/hooks/use-confirmation";

export default function CollectionSEOPage() {
  const [activeTab, setActiveTab] = useState("collections");
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [seoData, setSeoData] = useState<CollectionSEOData | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    content: "",
  });

  const notifications = useNotifications();
  const loading = useLoading();
  const confirmation = useConfirmation();

  // Load collections data
  useEffect(() => {
    loadCollectionsData();
  }, []);

  const loadCollectionsData = async () => {
    loading.start("loadCollections");
    try {
      const data = await collectionService.getCollectionsSEOData();
      setSeoData(data);
    } catch (error) {
      console.error("Failed to load collections data:", error);
    } finally {
      loading.stop("loadCollections");
    }
  };

  const handleSyncFromPlatforms = async () => {
    const confirmed = await confirmation.confirm({
      title: "Sync Collections from Platforms",
      description: "This will fetch and sync collections, categories, CMS pages, and brand pages from your connected platforms. This may take a few minutes.",
      confirmText: "Sync Now",
    });

    if (!confirmed) return;

    loading.start("syncPlatforms");
    try {
      const result = await collectionService.syncCollectionsFromPlatforms();
      
      if (result.success) {
        notifications.showSuccess(`Successfully synced ${result.synced} collections`);
        await loadCollectionsData(); // Reload data
      } else {
        notifications.showWarning("Sync completed with some issues");
        result.errors.forEach(error => notifications.showError(error));
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      loading.stop("syncPlatforms");
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setEditForm({
      metaTitle: collection.metaTitle || "",
      metaDescription: collection.metaDescription || "",
      keywords: collection.keywords || [],
      content: collection.content || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveCollection = async () => {
    if (!editingCollection) return;

    loading.start("saveCollection");
    try {
      const updated = await collectionService.updateCollectionSEO(editingCollection.id, editForm);
      
      // Update local data
      if (seoData) {
        const updatedCollections = seoData.collections.map(c => 
          c.id === editingCollection.id ? updated : c
        );
        setSeoData({
          ...seoData,
          collections: updatedCollections,
        });
      }

      setIsEditDialogOpen(false);
      setEditingCollection(null);
    } catch (error) {
      console.error("Failed to save collection:", error);
    } finally {
      loading.stop("saveCollection");
    }
  };

  const handleApplyAIOptimization = async (collectionId: string, type: "title" | "description" | "keywords" | "all") => {
    loading.start(`optimize_${collectionId}`);
    try {
      const optimized = await collectionService.applySEOOptimization(collectionId, type);
      
      // Update local data
      if (seoData) {
        const updatedCollections = seoData.collections.map(c => 
          c.id === collectionId ? optimized : c
        );
        setSeoData({
          ...seoData,
          collections: updatedCollections,
        });
      }
    } catch (error) {
      console.error("Failed to apply AI optimization:", error);
    } finally {
      loading.stop(`optimize_${collectionId}`);
    }
  };

  const handleBulkOptimize = async () => {
    const collectionsToOptimize = seoData?.collections.filter(c => c.status !== "optimized") || [];
    
    if (collectionsToOptimize.length === 0) {
      notifications.showInfo("All collections are already optimized!");
      return;
    }

    const confirmed = await confirmation.confirm({
      title: "Bulk SEO Optimization",
      description: `This will apply AI optimization to ${collectionsToOptimize.length} collections that need improvement. Continue?`,
      confirmText: "Optimize All",
    });

    if (!confirmed) return;

    loading.start("bulkOptimize");
    try {
      const result = await collectionService.bulkOptimizeCollections(
        collectionsToOptimize.map(c => c.id),
        "all"
      );
      
      if (result.success) {
        notifications.showSuccess(`Successfully optimized ${result.processed} collections`);
        await loadCollectionsData(); // Reload data
      } else {
        notifications.showWarning("Bulk optimization completed with some issues");
        result.errors.forEach(error => notifications.showError(error));
      }
    } catch (error) {
      console.error("Bulk optimization failed:", error);
    } finally {
      loading.stop("bulkOptimize");
    }
  };

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

  const getFilteredCollections = (type: string) => {
    if (!seoData) return [];
    return seoData.collections.filter(c => c.type === type);
  };

  if (loading.isLoading("loadCollections")) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading collections data...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
            <Button 
              onClick={handleSyncFromPlatforms}
              disabled={loading.isLoading("syncPlatforms")}
            >
              {loading.isLoading("syncPlatforms") ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync from Platforms
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="collections">Collections ({getFilteredCollections("collection").length})</TabsTrigger>
            <TabsTrigger value="categories">Categories ({getFilteredCollections("category").length})</TabsTrigger>
            <TabsTrigger value="cms">CMS Pages ({getFilteredCollections("cms_page").length})</TabsTrigger>
            <TabsTrigger value="brands">Brand Pages ({getFilteredCollections("brand_page").length})</TabsTrigger>
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
                      {getFilteredCollections("collection").length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No collections found. Sync from your connected platforms to get started.</p>
                        </div>
                      ) : (
                        getFilteredCollections("collection").map((collection) => (
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
                                    {collection.platform && ` • ${collection.platform}`}
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCollection(collection);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
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
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleBulkOptimize}
                      disabled={loading.isLoading("bulkOptimize")}
                    >
                      {loading.isLoading("bulkOptimize") ? (
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4 mr-2" />
                      )}
                      Bulk SEO Optimization
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Keyword Clustering
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      SEO Analysis Report
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Breadcrumb Optimizer
                    </Button>
                  </CardContent>
                </Card>

                {seoData && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>SEO Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Average SEO Score</span>
                            <span className="font-medium">{seoData.stats.averageScore}/100</span>
                          </div>
                          <Progress value={seoData.stats.averageScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Optimized Collections</span>
                            <span className="font-medium">{seoData.stats.optimizedCount}/{seoData.stats.totalCollections}</span>
                          </div>
                          <Progress 
                            value={seoData.stats.totalCollections > 0 ? (seoData.stats.optimizedCount / seoData.stats.totalCollections) * 100 : 0} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                  {getFilteredCollections("category").length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No categories found. Sync from your connected platforms to get started.</p>
                    </div>
                  ) : (
                    getFilteredCollections("category").map((category) => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.products} products • Last optimized: {new Date(category.lastOptimized).toLocaleDateString()}
                              {category.platform && ` • Platform: ${category.platform}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={category.status === "optimized" ? "default" : "destructive"}>
                              SEO Score: {category.seoScore}/100
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditCollection(category)}
                            >
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
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApplyAIOptimization(category.id, "description")}
                                disabled={loading.isLoading(`optimize_${category.id}`)}
                              >
                                {loading.isLoading(`optimize_${category.id}`) ? (
                                  <Loader className="h-3 w-3 animate-spin" />
                                ) : (
                                  "Generate Description"
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApplyAIOptimization(category.id, "keywords")}
                                disabled={loading.isLoading(`optimize_${category.id}`)}
                              >
                                Optimize Keywords
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                  {getFilteredCollections("cms_page").length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No CMS pages found. Sync from your connected platforms to get started.</p>
                    </div>
                  ) : (
                    getFilteredCollections("cms_page").map((page) => (
                      <div key={page.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{page.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              /{page.slug}
                              {page.platform && ` • Platform: ${page.platform}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={page.status === "critical" ? "destructive" : page.status === "optimized" ? "default" : "secondary"}>
                              {page.status === "critical" ? "Critical" : `SEO Score`}: {page.seoScore}/100
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditCollection(page)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Meta Title:</label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {page.metaTitle || "Not set"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Meta Description:</label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {page.metaDescription || "Not set"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Target Keywords:</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {page.keywords.length > 0 ? (
                                  page.keywords.map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">No keywords set</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Quick Actions:</label>
                              <div className="flex gap-2 mt-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleApplyAIOptimization(page.id, "all")}
                                  disabled={loading.isLoading(`optimize_${page.id}`)}
                                >
                                  {loading.isLoading(`optimize_${page.id}`) ? (
                                    <Loader className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <Bot className="h-3 w-3 mr-1" />
                                  )}
                                  AI Optimize
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                  {getFilteredCollections("brand_page").length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No brand pages found. Sync from your connected platforms to get started.</p>
                    </div>
                  ) : (
                    getFilteredCollections("brand_page").map((brand) => (
                      <div key={brand.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Crown className="h-8 w-8 text-yellow-600" />
                            <div>
                              <h3 className="font-semibold">{brand.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {brand.products} products • SEO Score: {brand.seoScore}/100
                                {brand.platform && ` • Platform: ${brand.platform}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={brand.status === "optimized" ? "default" : "secondary"}>
                              {brand.status}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditCollection(brand)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
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
                              {brand.metaTitle || "Not set"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Actions:</label>
                            <div className="flex gap-2 mt-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApplyAIOptimization(brand.id, "all")}
                                disabled={loading.isLoading(`optimize_${brand.id}`)}
                              >
                                {loading.isLoading(`optimize_${brand.id}`) ? (
                                  <Loader className="h-3 w-3 animate-spin" />
                                ) : (
                                  "Optimize"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                    {seoData?.recommendations.map((rec) => (
                      <div key={rec.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{rec.description}</h4>
                          <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.impact}</p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleBulkOptimize}>Apply Fix</Button>
                          <Button size="sm" variant="outline">Learn More</Button>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recommendations available. Add some collections first.</p>
                      </div>
                    )}
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
                  {seoData ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Collection Status Overview</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Optimized</span>
                              <span className="font-medium">{seoData.stats.optimizedCount}</span>
                            </div>
                            <Progress value={seoData.stats.totalCollections > 0 ? (seoData.stats.optimizedCount / seoData.stats.totalCollections) * 100 : 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Needs Work</span>
                              <span className="font-medium">{seoData.stats.needsWorkCount}</span>
                            </div>
                            <Progress value={seoData.stats.totalCollections > 0 ? (seoData.stats.needsWorkCount / seoData.stats.totalCollections) * 100 : 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Critical</span>
                              <span className="font-medium">{seoData.stats.criticalCount}</span>
                            </div>
                            <Progress value={seoData.stats.totalCollections > 0 ? (seoData.stats.criticalCount / seoData.stats.totalCollections) * 100 : 0} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Implementation Priority</h4>
                        <div className="space-y-2">
                          {seoData.stats.criticalCount > 0 && (
                            <div className="flex items-center justify-between text-sm p-2 bg-red-50 rounded">
                              <span>Fix critical pages ({seoData.stats.criticalCount})</span>
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            </div>
                          )}
                          {seoData.stats.needsWorkCount > 0 && (
                            <div className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded">
                              <span>Optimize pages needing work ({seoData.stats.needsWorkCount})</span>
                              <Badge variant="secondary" className="text-xs">High</Badge>
                            </div>
                          )}
                          {seoData.stats.optimizedCount > 0 && (
                            <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                              <span>Maintain optimized pages ({seoData.stats.optimizedCount})</span>
                              <Badge variant="outline" className="text-xs">Low</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No data available. Sync collections first.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Collection Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Collection SEO</DialogTitle>
              <DialogDescription>
                Update the SEO settings for {editingCollection?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="metaTitle">Meta Title</label>
                <Input
                  id="metaTitle"
                  value={editForm.metaTitle}
                  onChange={(e) => setEditForm({ ...editForm, metaTitle: e.target.value })}
                  placeholder="Enter compelling meta title..."
                />
                <p className="text-xs text-muted-foreground">
                  {editForm.metaTitle.length}/60 characters
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="metaDescription">Meta Description</label>
                <Textarea
                  id="metaDescription"
                  value={editForm.metaDescription}
                  onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })}
                  placeholder="Enter engaging meta description..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {editForm.metaDescription.length}/160 characters
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="keywords">Keywords (comma-separated)</label>
                <Input
                  id="keywords"
                  value={editForm.keywords.join(", ")}
                  onChange={(e) => setEditForm({ 
                    ...editForm, 
                    keywords: e.target.value.split(",").map(k => k.trim()).filter(k => k.length > 0)
                  })}
                  placeholder="keyword1, keyword2, keyword3..."
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content">Content</label>
                <Textarea
                  id="content"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Enter collection description/content..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveCollection}
                disabled={loading.isLoading("saveCollection")}
              >
                {loading.isLoading("saveCollection") ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

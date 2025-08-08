import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Eye, Target, AlertCircle, CheckCircle, Upload, X, Plus, Globe, Share2, Code, BarChart3, Settings2, Image, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
  title: string;
  handle: string;
  status: "active" | "draft" | "archived";
  vendor: string;
  productType: string;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  inventory: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  searchKeywords?: string;
  // Advanced SEO fields
  canonicalUrl?: string;
  robotsMeta?: string;
  focusKeyword?: string;
  altText?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: {
    enableProductSchema: boolean;
    enableBrandSchema: boolean;
    enableReviewSchema: boolean;
    customSchema?: string;
  };
  technicalSeo?: {
    enableLazyLoading: boolean;
    enableAMP: boolean;
    excludeFromSitemap: boolean;
    customMetaTags?: string;
  };
  contentAnalysis?: {
    keywordDensity: number;
    readabilityScore: number;
    contentLength: number;
  };
  isVisible: boolean;
  trackQuantity: boolean;
  sku?: string;
  barcode?: string;
  seoScore: number;
}

// SEO Score calculation function
const calculateSEOScore = (product: Partial<Product>): number => {
  let score = 0;

  // Title optimization (25 points)
  if (product.title && product.title.length >= 10 && product.title.length <= 60) {
    score += 25;
  } else if (product.title && product.title.length > 0) {
    score += 10;
  }

  // Meta title (20 points)
  if (product.metaTitle && product.metaTitle.length >= 30 && product.metaTitle.length <= 60) {
    score += 20;
  } else if (product.metaTitle && product.metaTitle.length > 0) {
    score += 10;
  }

  // Meta description (20 points)
  if (product.metaDescription && product.metaDescription.length >= 120 && product.metaDescription.length <= 160) {
    score += 20;
  } else if (product.metaDescription && product.metaDescription.length > 0) {
    score += 10;
  }

  // Product description (15 points)
  if (product.description && product.description.length >= 100) {
    score += 15;
  } else if (product.description && product.description.length > 0) {
    score += 8;
  }

  // Handle/URL optimization (10 points)
  if (product.handle && product.handle.length <= 50 && !product.handle.includes('_')) {
    score += 10;
  } else if (product.handle) {
    score += 5;
  }

  // Tags optimization (10 points)
  if (product.tags && product.tags.length >= 3 && product.tags.length <= 10) {
    score += 10;
  } else if (product.tags && product.tags.length > 0) {
    score += 5;
  }

  return Math.min(score, 100);
};

const getSEOScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getSEOScoreBadge = (score: number) => {
  if (score >= 80) return { variant: "default" as const, label: "Excellent" };
  if (score >= 60) return { variant: "secondary" as const, label: "Good" };
  return { variant: "destructive" as const, label: "Needs Work" };
};

// Mock function to get product by ID
const getProductById = (id: string): Product => {
  return {
    id,
    title: `Product ${id} - Electronics Device`,
    handle: `product-${id}`,
    status: "active",
    vendor: "Apple",
    productType: "Electronics",
    tags: ["electronics", "apple", "device", "premium"],
    price: 299.99,
    compareAtPrice: 399.99,
    costPerItem: 150.00,
    inventory: 25,
    weight: 0.5,
    dimensions: {
      length: 10,
      width: 7,
      height: 1
    },
    images: [
      `https://picsum.photos/600/600?random=${id}1`,
      `https://picsum.photos/600/600?random=${id}2`,
      `https://picsum.photos/600/600?random=${id}3`
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "High-quality electronics device designed for modern consumers with exceptional durability and style. Features cutting-edge technology and premium materials.",
    metaTitle: "Premium Electronics Device | Apple | Best Quality",
    metaDescription: "Discover our premium electronics device featuring cutting-edge technology, exceptional durability, and modern design. Perfect for tech enthusiasts.",
    searchKeywords: "electronics, device, premium, apple, technology",
    isVisible: true,
    trackQuantity: true,
    sku: `SKU-${id}`,
    barcode: `123456789${id}`,
    seoScore: 0
  };
};

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (id) {
      // Simulate loading
      setTimeout(() => {
        const loadedProduct = getProductById(id);
        loadedProduct.seoScore = calculateSEOScore(loadedProduct);
        setProduct(loadedProduct);
        setIsLoading(false);
      }, 500);
    }
  }, [id]);

  const handleSave = async () => {
    if (!product) return;
    
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Recalculate SEO score
    const updatedProduct = {
      ...product,
      seoScore: calculateSEOScore(product),
      updatedAt: new Date().toISOString()
    };
    setProduct(updatedProduct);
    setIsSaving(false);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    if (!product) return;
    
    setProduct(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      // Recalculate SEO score in real-time
      updated.seoScore = calculateSEOScore(updated);
      return updated;
    });
  };

  const addTag = () => {
    if (newTag.trim() && product && !product.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...product.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (product) {
      handleInputChange('tags', product.tags.filter(tag => tag !== tagToRemove));
    }
  };

  const removeImage = (index: number) => {
    if (product) {
      const newImages = product.images.filter((_, i) => i !== index);
      handleInputChange('images', newImages);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <Button asChild className="mt-4">
            <Link to="/">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold">{product.title}</h1>
                <p className="text-sm text-muted-foreground">Edit product details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Product Title</Label>
                      <Input
                        id="title"
                        value={product.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter product title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={product.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your product"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendor">Vendor</Label>
                        <Input
                          id="vendor"
                          value={product.vendor}
                          onChange={(e) => handleInputChange('vendor', e.target.value)}
                          placeholder="Product vendor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productType">Product Type</Label>
                        <Input
                          id="productType"
                          value={product.productType}
                          onChange={(e) => handleInputChange('productType', e.target.value)}
                          placeholder="Product category"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="px-2 py-1">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        />
                        <Button onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center hover:bg-muted/50 cursor-pointer">
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Add Image</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={product.price}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="compareAtPrice">Compare at Price</Label>
                        <Input
                          id="compareAtPrice"
                          type="number"
                          step="0.01"
                          value={product.compareAtPrice || ''}
                          onChange={(e) => handleInputChange('compareAtPrice', parseFloat(e.target.value) || undefined)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="costPerItem">Cost per Item</Label>
                      <Input
                        id="costPerItem"
                        type="number"
                        step="0.01"
                        value={product.costPerItem || ''}
                        onChange={(e) => handleInputChange('costPerItem', parseFloat(e.target.value) || undefined)}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.price && product.costPerItem && 
                          `Margin: ${(((product.price - product.costPerItem) / product.price) * 100).toFixed(1)}%`
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="trackQuantity"
                        checked={product.trackQuantity}
                        onCheckedChange={(checked) => handleInputChange('trackQuantity', checked)}
                      />
                      <Label htmlFor="trackQuantity">Track quantity</Label>
                    </div>

                    {product.trackQuantity && (
                      <div>
                        <Label htmlFor="inventory">Quantity</Label>
                        <Input
                          id="inventory"
                          type="number"
                          value={product.inventory}
                          onChange={(e) => handleInputChange('inventory', parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={product.sku || ''}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          placeholder="SKU"
                        />
                      </div>
                      <div>
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                          id="barcode"
                          value={product.barcode || ''}
                          onChange={(e) => handleInputChange('barcode', e.target.value)}
                          placeholder="Barcode"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        value={product.weight || ''}
                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label>Dimensions (cm)</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <Input
                          type="number"
                          step="0.1"
                          value={product.dimensions?.length || ''}
                          onChange={(e) => handleInputChange('dimensions', {
                            ...product.dimensions,
                            length: parseFloat(e.target.value) || 0
                          })}
                          placeholder="Length"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={product.dimensions?.width || ''}
                          onChange={(e) => handleInputChange('dimensions', {
                            ...product.dimensions,
                            width: parseFloat(e.target.value) || 0
                          })}
                          placeholder="Width"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={product.dimensions?.height || ''}
                          onChange={(e) => handleInputChange('dimensions', {
                            ...product.dimensions,
                            height: parseFloat(e.target.value) || 0
                          })}
                          placeholder="Height"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-primary" />
                        <span>SEO Optimization</span>
                      </CardTitle>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getSEOScoreColor(product.seoScore)}`}>
                          {product.seoScore}/100
                        </div>
                        <Badge variant={getSEOScoreBadge(product.seoScore).variant}>
                          {getSEOScoreBadge(product.seoScore).label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Progress value={product.seoScore} className="mb-4" />
                    </div>

                    <div>
                      <Label htmlFor="handle">URL Handle</Label>
                      <Input
                        id="handle"
                        value={product.handle}
                        onChange={(e) => handleInputChange('handle', e.target.value)}
                        placeholder="product-url-handle"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        yourstore.com/products/{product.handle}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={product.metaTitle || ''}
                        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        placeholder="SEO optimized title"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Recommended: 30-60 characters</span>
                        <span className={product.metaTitle && product.metaTitle.length > 60 ? 'text-destructive' : ''}>
                          {product.metaTitle?.length || 0}/60
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={product.metaDescription || ''}
                        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                        placeholder="SEO optimized description"
                        rows={3}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Recommended: 120-160 characters</span>
                        <span className={product.metaDescription && product.metaDescription.length > 160 ? 'text-destructive' : ''}>
                          {product.metaDescription?.length || 0}/160
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="searchKeywords">Search Keywords</Label>
                      <Input
                        id="searchKeywords"
                        value={product.searchKeywords || ''}
                        onChange={(e) => handleInputChange('searchKeywords', e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Comma-separated keywords for search optimization
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Visibility */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={product.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVisible"
                    checked={product.isVisible}
                    onCheckedChange={(checked) => handleInputChange('isVisible', checked)}
                  />
                  <Label htmlFor="isVisible">Visible in store</Label>
                </div>
              </CardContent>
            </Card>

            {/* SEO Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Title Optimization</span>
                  <div className="flex items-center space-x-2">
                    {product.title && product.title.length >= 10 && product.title.length <= 60 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>{product.title && product.title.length >= 10 && product.title.length <= 60 ? '25' : '10'}/25</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Meta Title</span>
                  <div className="flex items-center space-x-2">
                    {product.metaTitle && product.metaTitle.length >= 30 && product.metaTitle.length <= 60 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>{product.metaTitle && product.metaTitle.length >= 30 && product.metaTitle.length <= 60 ? '20' : (product.metaTitle ? '10' : '0')}/20</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Meta Description</span>
                  <div className="flex items-center space-x-2">
                    {product.metaDescription && product.metaDescription.length >= 120 && product.metaDescription.length <= 160 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>{product.metaDescription && product.metaDescription.length >= 120 && product.metaDescription.length <= 160 ? '20' : (product.metaDescription ? '10' : '0')}/20</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Description Quality</span>
                  <div className="flex items-center space-x-2">
                    {product.description && product.description.length >= 100 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>{product.description && product.description.length >= 100 ? '15' : (product.description ? '8' : '0')}/15</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>URL Handle</span>
                  <div className="flex items-center space-x-2">
                    {product.handle && product.handle.length <= 50 && !product.handle.includes('_') ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>{product.handle && product.handle.length <= 50 && !product.handle.includes('_') ? '10' : '5'}/10</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Tags</span>
                  <div className="flex items-center space-x-2">
                    {product.tags && product.tags.length >= 3 && product.tags.length <= 10 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>{product.tags && product.tags.length >= 3 && product.tags.length <= 10 ? '10' : (product.tags?.length ? '5' : '0')}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product ID:</span>
                  <span className="font-mono">{product.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

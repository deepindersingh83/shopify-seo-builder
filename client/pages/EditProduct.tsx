import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  Target,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Plus,
  Globe,
  Share2,
  Code,
  BarChart3,
  Settings2,
  Image,
  Zap,
  Search,
  Users,
  Monitor,
  Bot,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/Layout";
import SEOAutomation from "@/components/SEOAutomation";

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
    focusKeywordInTitle: boolean;
    focusKeywordInMeta: boolean;
    focusKeywordInContent: boolean;
    internalLinkCount: number;
    outboundLinkCount: number;
    wordCount: number;
    sentenceLength: number;
  };
  keywordResearch?: {
    suggestedKeywords: string[];
    searchVolume: { [key: string]: number };
    competition: { [key: string]: "low" | "medium" | "high" };
    difficulty: { [key: string]: number };
    relatedKeywords: string[];
    longtailSuggestions: string[];
  };
  serpPreview?: {
    title: string;
    url: string;
    description: string;
    richSnippets: boolean;
    featuredSnippet: boolean;
  };
  competitorAnalysis?: {
    competitorUrls: string[];
    competitorKeywords: string[];
    contentGaps: string[];
    backlinksComparison: number;
    priceComparison: { competitor: string; price: number }[];
  };
  performance?: {
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    pageSpeed: {
      desktop: number;
      mobile: number;
    };
    mobileOptimization: {
      mobileUsability: number;
      ampEnabled: boolean;
      responsiveDesign: boolean;
    };
  };
  linkManagement?: {
    internalLinks: { url: string; anchor: string; title: string }[];
    backlinks: { domain: string; url: string; authority: number }[];
    brokenLinks: string[];
    redirectChains: string[];
  };
  internationalSeo?: {
    hreflangTags: { [lang: string]: string };
    targetCountries: string[];
    currencyOptimization: string;
    localSeoEnabled: boolean;
    geoTargeting: string;
  };
  aiOptimization?: {
    contentSuggestions: string[];
    metaOptimization: {
      suggestedTitle: string;
      suggestedDescription: string;
    };
    semanticKeywords: string[];
    voiceSearchOptimization: boolean;
    featuredSnippetOptimization: string;
  };
  automation?: {
    seoRules: { rule: string; enabled: boolean }[];
    scheduledAudits: boolean;
    autoMetaGeneration: boolean;
    bulkOptimizationRules: string[];
  };
  isVisible: boolean;
  trackQuantity: boolean;
  sku?: string;
  barcode?: string;
  seoScore: number;
}

// Advanced SEO Score calculation function
const calculateSEOScore = (product: Partial<Product>): number => {
  let score = 0;

  // Basic SEO (60 points total)
  // Title optimization (15 points)
  if (
    product.title &&
    product.title.length >= 10 &&
    product.title.length <= 60
  ) {
    score += 15;
  } else if (product.title && product.title.length > 0) {
    score += 8;
  }

  // Meta title (12 points)
  if (
    product.metaTitle &&
    product.metaTitle.length >= 30 &&
    product.metaTitle.length <= 60
  ) {
    score += 12;
  } else if (product.metaTitle && product.metaTitle.length > 0) {
    score += 6;
  }

  // Meta description (12 points)
  if (
    product.metaDescription &&
    product.metaDescription.length >= 120 &&
    product.metaDescription.length <= 160
  ) {
    score += 12;
  } else if (product.metaDescription && product.metaDescription.length > 0) {
    score += 6;
  }

  // Product description (8 points)
  if (product.description && product.description.length >= 100) {
    score += 8;
  } else if (product.description && product.description.length > 0) {
    score += 4;
  }

  // Handle/URL optimization (8 points)
  if (
    product.handle &&
    product.handle.length <= 50 &&
    !product.handle.includes("_")
  ) {
    score += 8;
  } else if (product.handle) {
    score += 4;
  }

  // Tags optimization (5 points)
  if (product.tags && product.tags.length >= 3 && product.tags.length <= 10) {
    score += 5;
  } else if (product.tags && product.tags.length > 0) {
    score += 2;
  }

  // Advanced SEO Features (40 points total)
  // Focus keyword (5 points)
  if (product.focusKeyword) {
    score += 5;
  }

  // Alt text for images (5 points)
  if (product.altText) {
    score += 5;
  }

  // Open Graph optimization (10 points)
  if (product.ogTitle && product.ogDescription) {
    score += 10;
  } else if (product.ogTitle || product.ogDescription) {
    score += 5;
  }

  // Structured data (8 points)
  if (product.structuredData?.enableProductSchema) {
    score += 8;
  }

  // Technical SEO (7 points)
  if (product.technicalSeo?.enableLazyLoading) score += 2;
  if (product.canonicalUrl) score += 3;
  if (product.robotsMeta && product.robotsMeta !== "index,follow") score += 2;

  // Content analysis bonus (5 points)
  if (
    product.contentAnalysis?.readabilityScore &&
    product.contentAnalysis.readabilityScore >= 70
  ) {
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
    costPerItem: 150.0,
    inventory: 25,
    weight: 0.5,
    dimensions: {
      length: 10,
      width: 7,
      height: 1,
    },
    images: [
      `https://picsum.photos/600/600?random=${id}1`,
      `https://picsum.photos/600/600?random=${id}2`,
      `https://picsum.photos/600/600?random=${id}3`,
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description:
      "High-quality electronics device designed for modern consumers with exceptional durability and style. Features cutting-edge technology and premium materials. This innovative product combines functionality with aesthetic appeal, making it perfect for professionals and enthusiasts alike. Built with sustainable materials and designed to last.",
    metaTitle: "Premium Electronics Device | Apple | Best Quality",
    metaDescription:
      "Discover our premium electronics device featuring cutting-edge technology, exceptional durability, and modern design. Perfect for tech enthusiasts seeking quality.",
    searchKeywords: "electronics, device, premium, apple, technology",
    // Advanced SEO fields
    canonicalUrl: `https://yourstore.com/products/product-${id}`,
    robotsMeta: "index,follow",
    focusKeyword: "premium electronics device",
    altText:
      "Premium electronics device with modern design and cutting-edge technology",
    ogTitle: "Premium Electronics Device - Advanced Technology",
    ogDescription:
      "Experience the latest in electronics technology with our premium device featuring exceptional durability and modern design.",
    ogImage: `https://picsum.photos/1200/630?random=${id}`,
    twitterTitle: "Premium Electronics Device - Tech Innovation",
    twitterDescription:
      "Cutting-edge electronics device with premium quality and modern design. Perfect for tech enthusiasts.",
    twitterImage: `https://picsum.photos/1200/600?random=${id}`,
    structuredData: {
      enableProductSchema: true,
      enableBrandSchema: true,
      enableReviewSchema: false,
      customSchema: "",
    },
    technicalSeo: {
      enableLazyLoading: true,
      enableAMP: false,
      excludeFromSitemap: false,
      customMetaTags: "",
    },
    contentAnalysis: {
      keywordDensity: 2.5,
      readabilityScore: 78,
      contentLength: 245,
      focusKeywordInTitle: true,
      focusKeywordInMeta: true,
      focusKeywordInContent: true,
      internalLinkCount: 3,
      outboundLinkCount: 1,
      wordCount: 245,
      sentenceLength: 15.2,
    },
    keywordResearch: {
      suggestedKeywords: [
        "premium electronics",
        "apple device",
        "tech gadget",
        "professional tools",
        "innovation technology",
      ],
      searchVolume: {
        "premium electronics": 12000,
        "apple device": 8500,
        "tech gadget": 15000,
        "professional tools": 6800,
        "innovation technology": 4200,
      },
      competition: {
        "premium electronics": "high",
        "apple device": "high",
        "tech gadget": "medium",
        "professional tools": "medium",
        "innovation technology": "low",
      },
      difficulty: {
        "premium electronics": 75,
        "apple device": 82,
        "tech gadget": 65,
        "professional tools": 58,
        "innovation technology": 45,
      },
      relatedKeywords: [
        "electronics store",
        "tech reviews",
        "gadget comparison",
        "apple products",
        "premium tech",
      ],
      longtailSuggestions: [
        "best premium electronics device 2024",
        "apple professional electronics review",
        "high quality tech gadgets for professionals",
      ],
    },
    serpPreview: {
      title: "Premium Electronics Device | Apple | Best Quality",
      url: `https://yourstore.com/products/product-${id}`,
      description:
        "Discover our premium electronics device featuring cutting-edge technology, exceptional durability, and modern design. Perfect for tech enthusiasts seeking quality.",
      richSnippets: true,
      featuredSnippet: false,
    },
    competitorAnalysis: {
      competitorUrls: [
        "https://competitor1.com/similar-product",
        "https://competitor2.com/electronics-device",
        "https://competitor3.com/premium-gadget",
      ],
      competitorKeywords: [
        "premium tech",
        "electronics",
        "apple alternative",
        "professional device",
      ],
      contentGaps: [
        "sustainability features",
        "warranty information",
        "technical specifications",
      ],
      backlinksComparison: 156,
      priceComparison: [
        { competitor: "Competitor A", price: 329.99 },
        { competitor: "Competitor B", price: 279.99 },
        { competitor: "Competitor C", price: 349.99 },
      ],
    },
    performance: {
      coreWebVitals: {
        lcp: 2.1, // Good < 2.5s
        fid: 85, // Good < 100ms
        cls: 0.08, // Good < 0.1
      },
      pageSpeed: {
        desktop: 94,
        mobile: 87,
      },
      mobileOptimization: {
        mobileUsability: 92,
        ampEnabled: false,
        responsiveDesign: true,
      },
    },
    linkManagement: {
      internalLinks: [
        {
          url: "/category/electronics",
          anchor: "Electronics Category",
          title: "Browse Electronics",
        },
        {
          url: "/brand/apple",
          anchor: "Apple Products",
          title: "Apple Brand Page",
        },
        {
          url: "/reviews",
          anchor: "Customer Reviews",
          title: "Product Reviews",
        },
      ],
      backlinks: [
        {
          domain: "techreview.com",
          url: "https://techreview.com/apple-products",
          authority: 85,
        },
        {
          domain: "gadgetblog.net",
          url: "https://gadgetblog.net/premium-electronics",
          authority: 72,
        },
        {
          domain: "electronics-news.com",
          url: "https://electronics-news.com/featured",
          authority: 68,
        },
      ],
      brokenLinks: [],
      redirectChains: [],
    },
    internationalSeo: {
      hreflangTags: {
        "en-US": `https://yourstore.com/products/product-${id}`,
        "en-GB": `https://yourstore.co.uk/products/product-${id}`,
        "fr-FR": `https://yourstore.fr/produits/product-${id}`,
        "de-DE": `https://yourstore.de/produkte/product-${id}`,
      },
      targetCountries: ["US", "UK", "France", "Germany", "Canada"],
      currencyOptimization: "USD",
      localSeoEnabled: false,
      geoTargeting: "global",
    },
    aiOptimization: {
      contentSuggestions: [
        "Add more details about sustainability and environmental impact",
        "Include technical specifications table for better comparison",
        "Add FAQ section addressing common customer questions",
        "Include warranty and support information",
      ],
      metaOptimization: {
        suggestedTitle:
          "Premium Electronics Device 2024 | Apple Quality | Professional Grade",
        suggestedDescription:
          "Experience cutting-edge technology with our premium electronics device. Features exceptional durability, modern design, and professional-grade performance for tech enthusiasts.",
      },
      semanticKeywords: [
        "innovative technology",
        "cutting-edge device",
        "premium quality",
        "professional grade",
        "exceptional durability",
      ],
      voiceSearchOptimization: true,
      featuredSnippetOptimization:
        "What makes this electronics device premium? Our device combines cutting-edge technology with exceptional durability and modern design, making it perfect for professionals who demand quality and reliability.",
    },
    automation: {
      seoRules: [
        {
          rule: "Auto-generate meta descriptions from product description",
          enabled: true,
        },
        {
          rule: "Optimize images with ALT text based on product title",
          enabled: true,
        },
        { rule: "Generate structured data for product schema", enabled: true },
        {
          rule: "Update internal links when categories change",
          enabled: false,
        },
      ],
      scheduledAudits: true,
      autoMetaGeneration: false,
      bulkOptimizationRules: [
        "Apply focus keyword to meta title",
        "Ensure meta description length 120-160 chars",
        "Add structured data to all products",
      ],
    },
    isVisible: true,
    trackQuantity: true,
    sku: `SKU-${id}`,
    barcode: `123456789${id}`,
    seoScore: 0,
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Recalculate SEO score
    const updatedProduct = {
      ...product,
      seoScore: calculateSEOScore(product),
      updatedAt: new Date().toISOString(),
    };
    setProduct(updatedProduct);
    setIsSaving(false);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    if (!product) return;

    setProduct((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      // Recalculate SEO score in real-time
      updated.seoScore = calculateSEOScore(updated);
      return updated;
    });
  };

  const addTag = () => {
    if (newTag.trim() && product && !product.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...product.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (product) {
      handleInputChange(
        "tags",
        product.tags.filter((tag) => tag !== tagToRemove),
      );
    }
  };

  const removeImage = (index: number) => {
    if (product) {
      const newImages = product.images.filter((_, i) => i !== index);
      handleInputChange("images", newImages);
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
                <p className="text-sm text-muted-foreground">
                  Edit product details
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={isSaving} size="sm">
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
              <TabsList className="grid w-full grid-cols-9">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="ai">AI Tools</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
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
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter product title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={product.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
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
                          onChange={(e) =>
                            handleInputChange("vendor", e.target.value)
                          }
                          placeholder="Product vendor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productType">Product Type</Label>
                        <Input
                          id="productType"
                          value={product.productType}
                          onChange={(e) =>
                            handleInputChange("productType", e.target.value)
                          }
                          placeholder="Product category"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {product.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-2 py-1"
                          >
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
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
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
                          <p className="text-sm text-muted-foreground">
                            Add Image
                          </p>
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
                          onChange={(e) =>
                            handleInputChange(
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="compareAtPrice">Compare at Price</Label>
                        <Input
                          id="compareAtPrice"
                          type="number"
                          step="0.01"
                          value={product.compareAtPrice || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "compareAtPrice",
                              parseFloat(e.target.value) || undefined,
                            )
                          }
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
                        value={product.costPerItem || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "costPerItem",
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.price &&
                          product.costPerItem &&
                          `Margin: ${(((product.price - product.costPerItem) / product.price) * 100).toFixed(1)}%`}
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
                        onCheckedChange={(checked) =>
                          handleInputChange("trackQuantity", checked)
                        }
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
                          onChange={(e) =>
                            handleInputChange(
                              "inventory",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          placeholder="0"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={product.sku || ""}
                          onChange={(e) =>
                            handleInputChange("sku", e.target.value)
                          }
                          placeholder="SKU"
                        />
                      </div>
                      <div>
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                          id="barcode"
                          value={product.barcode || ""}
                          onChange={(e) =>
                            handleInputChange("barcode", e.target.value)
                          }
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
                        value={product.weight || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "weight",
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label>Dimensions (cm)</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <Input
                          type="number"
                          step="0.1"
                          value={product.dimensions?.length || ""}
                          onChange={(e) =>
                            handleInputChange("dimensions", {
                              ...product.dimensions,
                              length: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Length"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={product.dimensions?.width || ""}
                          onChange={(e) =>
                            handleInputChange("dimensions", {
                              ...product.dimensions,
                              width: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Width"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={product.dimensions?.height || ""}
                          onChange={(e) =>
                            handleInputChange("dimensions", {
                              ...product.dimensions,
                              height: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Height"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                {/* SEO Overview Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-primary" />
                        <span>SEO Score & Overview</span>
                      </CardTitle>
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${getSEOScoreColor(product.seoScore)}`}
                        >
                          {product.seoScore}/100
                        </div>
                        <Badge
                          variant={getSEOScoreBadge(product.seoScore).variant}
                        >
                          {getSEOScoreBadge(product.seoScore).label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={product.seoScore} className="mb-4" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {product.contentAnalysis?.readabilityScore || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Readability
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {product.contentAnalysis?.keywordDensity || 0}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Keyword Density
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {product.contentAnalysis?.contentLength || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Content Length
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic SEO Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Basic SEO Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="handle">URL Handle</Label>
                        <Input
                          id="handle"
                          value={product.handle}
                          onChange={(e) =>
                            handleInputChange("handle", e.target.value)
                          }
                          placeholder="product-url-handle"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          yourstore.com/products/{product.handle}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="focusKeyword">Focus Keyword</Label>
                        <Input
                          id="focusKeyword"
                          value={product.focusKeyword || ""}
                          onChange={(e) =>
                            handleInputChange("focusKeyword", e.target.value)
                          }
                          placeholder="main target keyword"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Primary keyword to optimize for
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={product.metaTitle || ""}
                        onChange={(e) =>
                          handleInputChange("metaTitle", e.target.value)
                        }
                        placeholder="SEO optimized title"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Recommended: 30-60 characters</span>
                        <span
                          className={
                            product.metaTitle && product.metaTitle.length > 60
                              ? "text-destructive"
                              : ""
                          }
                        >
                          {product.metaTitle?.length || 0}/60
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={product.metaDescription || ""}
                        onChange={(e) =>
                          handleInputChange("metaDescription", e.target.value)
                        }
                        placeholder="SEO optimized description"
                        rows={3}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Recommended: 120-160 characters</span>
                        <span
                          className={
                            product.metaDescription &&
                            product.metaDescription.length > 160
                              ? "text-destructive"
                              : ""
                          }
                        >
                          {product.metaDescription?.length || 0}/160
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="altText">Image Alt Text</Label>
                      <Input
                        id="altText"
                        value={product.altText || ""}
                        onChange={(e) =>
                          handleInputChange("altText", e.target.value)
                        }
                        placeholder="Descriptive alt text for main image"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Describe the main product image for accessibility and
                        SEO
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media & Open Graph */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Share2 className="h-4 w-4" />
                      <span>Social Media Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">
                        Open Graph (Facebook, LinkedIn)
                      </h4>
                      <div>
                        <Label htmlFor="ogTitle">Open Graph Title</Label>
                        <Input
                          id="ogTitle"
                          value={product.ogTitle || ""}
                          onChange={(e) =>
                            handleInputChange("ogTitle", e.target.value)
                          }
                          placeholder="Title for social media sharing"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ogDescription">
                          Open Graph Description
                        </Label>
                        <Textarea
                          id="ogDescription"
                          value={product.ogDescription || ""}
                          onChange={(e) =>
                            handleInputChange("ogDescription", e.target.value)
                          }
                          placeholder="Description for social media sharing"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ogImage">Open Graph Image URL</Label>
                        <Input
                          id="ogImage"
                          value={product.ogImage || ""}
                          onChange={(e) =>
                            handleInputChange("ogImage", e.target.value)
                          }
                          placeholder="https://example.com/image.jpg (1200x630 recommended)"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Twitter Cards</h4>
                      <div>
                        <Label htmlFor="twitterTitle">Twitter Title</Label>
                        <Input
                          id="twitterTitle"
                          value={product.twitterTitle || ""}
                          onChange={(e) =>
                            handleInputChange("twitterTitle", e.target.value)
                          }
                          placeholder="Title for Twitter sharing"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitterDescription">
                          Twitter Description
                        </Label>
                        <Textarea
                          id="twitterDescription"
                          value={product.twitterDescription || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "twitterDescription",
                              e.target.value,
                            )
                          }
                          placeholder="Description for Twitter sharing"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitterImage">Twitter Image URL</Label>
                        <Input
                          id="twitterImage"
                          value={product.twitterImage || ""}
                          onChange={(e) =>
                            handleInputChange("twitterImage", e.target.value)
                          }
                          placeholder="https://example.com/image.jpg (1200x600 recommended)"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Structured Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-4 w-4" />
                      <span>Structured Data (Schema Markup)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableProductSchema"
                          checked={
                            product.structuredData?.enableProductSchema || false
                          }
                          onCheckedChange={(checked) =>
                            handleInputChange("structuredData", {
                              ...product.structuredData,
                              enableProductSchema: checked,
                            })
                          }
                        />
                        <Label htmlFor="enableProductSchema">
                          Enable Product Schema
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Helps search engines understand your product details
                        (price, availability, reviews)
                      </p>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableBrandSchema"
                          checked={
                            product.structuredData?.enableBrandSchema || false
                          }
                          onCheckedChange={(checked) =>
                            handleInputChange("structuredData", {
                              ...product.structuredData,
                              enableBrandSchema: checked,
                            })
                          }
                        />
                        <Label htmlFor="enableBrandSchema">
                          Enable Brand Schema
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Provides brand information to search engines for better
                        recognition
                      </p>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableReviewSchema"
                          checked={
                            product.structuredData?.enableReviewSchema || false
                          }
                          onCheckedChange={(checked) =>
                            handleInputChange("structuredData", {
                              ...product.structuredData,
                              enableReviewSchema: checked,
                            })
                          }
                        />
                        <Label htmlFor="enableReviewSchema">
                          Enable Review Schema
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Shows star ratings in search results when reviews are
                        available
                      </p>

                      <div>
                        <Label htmlFor="customSchema">
                          Custom Schema (JSON-LD)
                        </Label>
                        <Textarea
                          id="customSchema"
                          value={product.structuredData?.customSchema || ""}
                          onChange={(e) =>
                            handleInputChange("structuredData", {
                              ...product.structuredData,
                              customSchema: e.target.value,
                            })
                          }
                          placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
                          rows={4}
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Advanced: Add custom structured data in JSON-LD format
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical SEO */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings2 className="h-4 w-4" />
                      <span>Technical SEO</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="canonicalUrl">Canonical URL</Label>
                        <Input
                          id="canonicalUrl"
                          value={product.canonicalUrl || ""}
                          onChange={(e) =>
                            handleInputChange("canonicalUrl", e.target.value)
                          }
                          placeholder="https://yourstore.com/products/..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Prevents duplicate content issues
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="robotsMeta">Robots Meta Tag</Label>
                        <Select
                          value={product.robotsMeta || "index,follow"}
                          onValueChange={(value) =>
                            handleInputChange("robotsMeta", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="index,follow">
                              Index, Follow (Default)
                            </SelectItem>
                            <SelectItem value="index,nofollow">
                              Index, No Follow
                            </SelectItem>
                            <SelectItem value="noindex,follow">
                              No Index, Follow
                            </SelectItem>
                            <SelectItem value="noindex,nofollow">
                              No Index, No Follow
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableLazyLoading"
                          checked={
                            product.technicalSeo?.enableLazyLoading || false
                          }
                          onCheckedChange={(checked) =>
                            handleInputChange("technicalSeo", {
                              ...product.technicalSeo,
                              enableLazyLoading: checked,
                            })
                          }
                        />
                        <Label htmlFor="enableLazyLoading">
                          Enable Lazy Loading
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          Performance
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableAMP"
                          checked={product.technicalSeo?.enableAMP || false}
                          onCheckedChange={(checked) =>
                            handleInputChange("technicalSeo", {
                              ...product.technicalSeo,
                              enableAMP: checked,
                            })
                          }
                        />
                        <Label htmlFor="enableAMP">
                          Enable AMP (Accelerated Mobile Pages)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="excludeFromSitemap"
                          checked={
                            product.technicalSeo?.excludeFromSitemap || false
                          }
                          onCheckedChange={(checked) =>
                            handleInputChange("technicalSeo", {
                              ...product.technicalSeo,
                              excludeFromSitemap: checked,
                            })
                          }
                        />
                        <Label htmlFor="excludeFromSitemap">
                          Exclude from XML Sitemap
                        </Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customMetaTags">Custom Meta Tags</Label>
                      <Textarea
                        id="customMetaTags"
                        value={product.technicalSeo?.customMetaTags || ""}
                        onChange={(e) =>
                          handleInputChange("technicalSeo", {
                            ...product.technicalSeo,
                            customMetaTags: e.target.value,
                          })
                        }
                        placeholder='<meta name="custom-tag" content="value">'
                        rows={3}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add custom meta tags (one per line)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Content Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Readability
                          </span>
                          <div
                            className={`text-lg font-bold ${product.contentAnalysis?.readabilityScore >= 70 ? "text-green-600" : product.contentAnalysis?.readabilityScore >= 50 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {product.contentAnalysis?.readabilityScore || 0}
                          </div>
                        </div>
                        <Progress
                          value={product.contentAnalysis?.readabilityScore || 0}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.contentAnalysis?.readabilityScore >= 70
                            ? "Excellent - Easy to read"
                            : product.contentAnalysis?.readabilityScore >= 50
                              ? "Good - Moderately easy"
                              : "Poor - Hard to read"}
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Keyword Density
                          </span>
                          <div
                            className={`text-lg font-bold ${product.contentAnalysis?.keywordDensity >= 1 && product.contentAnalysis?.keywordDensity <= 3 ? "text-green-600" : "text-yellow-600"}`}
                          >
                            {product.contentAnalysis?.keywordDensity || 0}%
                          </div>
                        </div>
                        <Progress
                          value={
                            (product.contentAnalysis?.keywordDensity || 0) * 20
                          }
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.contentAnalysis?.keywordDensity >= 1 &&
                          product.contentAnalysis?.keywordDensity <= 3
                            ? "Optimal range (1-3%)"
                            : product.contentAnalysis?.keywordDensity > 3
                              ? "Too high - may be spam"
                              : "Too low - add more keywords"}
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Content Length
                          </span>
                          <div
                            className={`text-lg font-bold ${product.contentAnalysis?.contentLength >= 300 ? "text-green-600" : product.contentAnalysis?.contentLength >= 150 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {product.contentAnalysis?.contentLength || 0}
                          </div>
                        </div>
                        <Progress
                          value={Math.min(
                            (product.contentAnalysis?.contentLength || 0) / 5,
                            100,
                          )}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.contentAnalysis?.contentLength >= 300
                            ? "Excellent length"
                            : product.contentAnalysis?.contentLength >= 150
                              ? "Good length"
                              : "Too short - add more content"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">
                        SEO Recommendations
                      </h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {!product.focusKeyword && (
                          <li>• Add a focus keyword to improve targeting</li>
                        )}
                        {!product.altText && (
                          <li>• Add alt text for better image SEO</li>
                        )}
                        {(!product.ogTitle || !product.ogDescription) && (
                          <li>• Complete Open Graph tags for social media</li>
                        )}
                        {!product.structuredData?.enableProductSchema && (
                          <li>• Enable Product Schema for rich snippets</li>
                        )}
                        {product.contentAnalysis?.readabilityScore < 70 && (
                          <li>
                            • Improve content readability for better user
                            experience
                          </li>
                        )}
                        {product.contentAnalysis?.contentLength < 150 && (
                          <li>• Add more detailed product description</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Keywords Research Tab */}
              <TabsContent value="keywords" className="space-y-6">
                {/* Keyword Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span>Keyword Research & Tracking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {product.keywordResearch?.suggestedKeywords.length ||
                            0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Suggested Keywords
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Object.values(
                            product.keywordResearch?.searchVolume || {},
                          )
                            .reduce((a, b) => a + b, 0)
                            .toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Search Volume
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(
                            Object.values(
                              product.keywordResearch?.difficulty || {},
                            ).reduce((a, b) => a + b, 0) /
                              Object.keys(
                                product.keywordResearch?.difficulty || {},
                              ).length,
                          ) || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Avg. Difficulty
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {product.keywordResearch?.suggestedKeywords.map(
                        (keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline">{keyword}</Badge>
                              <div className="text-sm text-muted-foreground">
                                Volume:{" "}
                                {product.keywordResearch?.searchVolume[
                                  keyword
                                ]?.toLocaleString() || "N/A"}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  product.keywordResearch?.competition[
                                    keyword
                                  ] === "low"
                                    ? "default"
                                    : product.keywordResearch?.competition[
                                          keyword
                                        ] === "medium"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {product.keywordResearch?.competition[
                                  keyword
                                ] || "unknown"}{" "}
                                competition
                              </Badge>
                              <div className="text-sm font-medium">
                                {product.keywordResearch?.difficulty[keyword]}
                                /100
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Long-tail Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle>Long-tail Keyword Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {product.keywordResearch?.longtailSuggestions.map(
                        (keyword, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <span className="text-sm">{keyword}</span>
                            <Badge variant="outline" className="text-xs">
                              Long-tail
                            </Badge>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Related Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle>Related Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.keywordResearch?.relatedKeywords.map(
                        (keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                {/* Core Web Vitals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Core Web Vitals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            LCP (Largest Contentful Paint)
                          </span>
                          <div
                            className={`text-lg font-bold ${product.performance?.coreWebVitals.lcp <= 2.5 ? "text-green-600" : product.performance?.coreWebVitals.lcp <= 4 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {product.performance?.coreWebVitals.lcp}s
                          </div>
                        </div>
                        <Progress
                          value={Math.min(
                            ((product.performance?.coreWebVitals.lcp || 0) /
                              4) *
                              100,
                            100,
                          )}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.performance?.coreWebVitals.lcp <= 2.5
                            ? "Good"
                            : product.performance?.coreWebVitals.lcp <= 4
                              ? "Needs Improvement"
                              : "Poor"}
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            FID (First Input Delay)
                          </span>
                          <div
                            className={`text-lg font-bold ${product.performance?.coreWebVitals.fid <= 100 ? "text-green-600" : product.performance?.coreWebVitals.fid <= 300 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {product.performance?.coreWebVitals.fid}ms
                          </div>
                        </div>
                        <Progress
                          value={Math.min(
                            ((product.performance?.coreWebVitals.fid || 0) /
                              300) *
                              100,
                            100,
                          )}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.performance?.coreWebVitals.fid <= 100
                            ? "Good"
                            : product.performance?.coreWebVitals.fid <= 300
                              ? "Needs Improvement"
                              : "Poor"}
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            CLS (Cumulative Layout Shift)
                          </span>
                          <div
                            className={`text-lg font-bold ${product.performance?.coreWebVitals.cls <= 0.1 ? "text-green-600" : product.performance?.coreWebVitals.cls <= 0.25 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {product.performance?.coreWebVitals.cls}
                          </div>
                        </div>
                        <Progress
                          value={Math.min(
                            ((product.performance?.coreWebVitals.cls || 0) /
                              0.25) *
                              100,
                            100,
                          )}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.performance?.coreWebVitals.cls <= 0.1
                            ? "Good"
                            : product.performance?.coreWebVitals.cls <= 0.25
                              ? "Needs Improvement"
                              : "Poor"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Page Speed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4" />
                      <span>Page Speed Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Desktop Speed
                          </span>
                          <div
                            className={`text-2xl font-bold ${product.performance?.pageSpeed.desktop >= 90 ? "text-green-600" : product.performance?.pageSpeed.desktop >= 70 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {product.performance?.pageSpeed.desktop}/100
                          </div>
                        </div>
                        <Progress
                          value={product.performance?.pageSpeed.desktop || 0}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.performance?.pageSpeed.desktop >= 90
                            ? "Excellent"
                            : product.performance?.pageSpeed.desktop >= 70
                              ? "Good"
                              : "Needs Improvement"}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Mobile Speed
                          </span>
                          <div
                            className={`text-2xl font-bold ${product.performance?.pageSpeed.mobile >= 90 ? "text-green-600" : product.performance?.pageSpeed.mobile >= 70 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {product.performance?.pageSpeed.mobile}/100
                          </div>
                        </div>
                        <Progress
                          value={product.performance?.pageSpeed.mobile || 0}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {product.performance?.pageSpeed.mobile >= 90
                            ? "Excellent"
                            : product.performance?.pageSpeed.mobile >= 70
                              ? "Good"
                              : "Needs Improvement"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile Optimization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Mobile Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile Usability Score</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">
                          {
                            product.performance?.mobileOptimization
                              .mobileUsability
                          }
                          /100
                        </span>
                        <Progress
                          value={
                            product.performance?.mobileOptimization
                              .mobileUsability || 0
                          }
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="responsiveDesign"
                        checked={
                          product.performance?.mobileOptimization
                            .responsiveDesign || false
                        }
                        disabled
                      />
                      <Label htmlFor="responsiveDesign">
                        Responsive Design
                      </Label>
                      {product.performance?.mobileOptimization
                        .responsiveDesign && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ampEnabled"
                        checked={
                          product.performance?.mobileOptimization.ampEnabled ||
                          false
                        }
                        onCheckedChange={(checked) =>
                          handleInputChange("performance", {
                            ...product.performance,
                            mobileOptimization: {
                              ...product.performance?.mobileOptimization,
                              ampEnabled: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="ampEnabled">
                        AMP (Accelerated Mobile Pages)
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Tools Tab */}
              <TabsContent value="ai" className="space-y-6">
                {/* AI Content Optimization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span>AI-Powered Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>AI Meta Optimization Suggestions</span>
                      </h4>
                      <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Suggested Title:
                          </Label>
                          <p className="text-sm font-medium">
                            {
                              product.aiOptimization?.metaOptimization
                                .suggestedTitle
                            }
                          </p>
                          <Button variant="outline" size="sm" className="mt-1">
                            Apply Suggestion
                          </Button>
                        </div>
                        <Separator />
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Suggested Description:
                          </Label>
                          <p className="text-sm">
                            {
                              product.aiOptimization?.metaOptimization
                                .suggestedDescription
                            }
                          </p>
                          <Button variant="outline" size="sm" className="mt-1">
                            Apply Suggestion
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Content Improvement Suggestions
                      </h4>
                      <div className="space-y-2">
                        {product.aiOptimization?.contentSuggestions.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2 p-2 border rounded"
                            >
                              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Semantic Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.aiOptimization?.semanticKeywords.map(
                          (keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50"
                            >
                              {keyword}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Featured Snippet Optimization
                      </h4>
                      <div className="p-3 border rounded-lg bg-green-50">
                        <p className="text-sm">
                          {product.aiOptimization?.featuredSnippetOptimization}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Use for Description
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="voiceSearchOptimization"
                        checked={
                          product.aiOptimization?.voiceSearchOptimization ||
                          false
                        }
                        onCheckedChange={(checked) =>
                          handleInputChange("aiOptimization", {
                            ...product.aiOptimization,
                            voiceSearchOptimization: checked,
                          })
                        }
                      />
                      <Label htmlFor="voiceSearchOptimization">
                        Voice Search Optimization
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        AI
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                {/* Competitor Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Competitor Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Price Comparison
                      </h4>
                      <div className="space-y-2">
                        {product.competitorAnalysis?.priceComparison.map(
                          (comp, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <span className="text-sm">{comp.competitor}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  ${comp.price}
                                </span>
                                <Badge
                                  variant={
                                    comp.price < product.price
                                      ? "destructive"
                                      : "default"
                                  }
                                >
                                  {comp.price < product.price
                                    ? "Lower"
                                    : "Higher"}
                                </Badge>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Content Gaps</h4>
                      <div className="space-y-1">
                        {product.competitorAnalysis?.contentGaps.map(
                          (gap, index) => (
                            <div
                              key={index}
                              className="text-sm text-muted-foreground"
                            >
                              • {gap}
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Backlinks Comparison
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">
                          {product.competitorAnalysis?.backlinksComparison}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          average competitor backlinks
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* International SEO */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>International & Local SEO</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Hreflang Tags
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(
                          product.internationalSeo?.hreflangTags || {},
                        ).map(([lang, url]) => (
                          <div
                            key={lang}
                            className="flex items-center justify-between p-2 border rounded text-sm"
                          >
                            <Badge variant="outline">{lang}</Badge>
                            <span className="text-muted-foreground font-mono text-xs">
                              {url}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Target Countries
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.internationalSeo?.targetCountries.map(
                          (country, index) => (
                            <Badge key={index} variant="secondary">
                              {country}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Currency Optimization</Label>
                        <p className="text-lg font-medium">
                          {product.internationalSeo?.currencyOptimization}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm">Geo Targeting</Label>
                        <p className="text-lg font-medium capitalize">
                          {product.internationalSeo?.geoTargeting}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Automation Rules */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>SEO Automation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Active SEO Rules
                      </h4>
                      <div className="space-y-2">
                        {product.automation?.seoRules.map((rule, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={(checked) => {
                                const newRules = [
                                  ...(product.automation?.seoRules || []),
                                ];
                                newRules[index] = { ...rule, enabled: checked };
                                handleInputChange("automation", {
                                  ...product.automation,
                                  seoRules: newRules,
                                });
                              }}
                            />
                            <span className="text-sm">{rule.rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="scheduledAudits"
                        checked={product.automation?.scheduledAudits || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("automation", {
                            ...product.automation,
                            scheduledAudits: checked,
                          })
                        }
                      />
                      <Label htmlFor="scheduledAudits">
                        Scheduled SEO Audits
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoMetaGeneration"
                        checked={
                          product.automation?.autoMetaGeneration || false
                        }
                        onCheckedChange={(checked) =>
                          handleInputChange("automation", {
                            ...product.automation,
                            autoMetaGeneration: checked,
                          })
                        }
                      />
                      <Label htmlFor="autoMetaGeneration">
                        Auto Meta Generation
                      </Label>
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
                  <Select
                    value={product.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
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
                    onCheckedChange={(checked) =>
                      handleInputChange("isVisible", checked)
                    }
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
                    {product.title &&
                    product.title.length >= 10 &&
                    product.title.length <= 60 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>
                      {product.title &&
                      product.title.length >= 10 &&
                      product.title.length <= 60
                        ? "25"
                        : "10"}
                      /25
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Meta Title</span>
                  <div className="flex items-center space-x-2">
                    {product.metaTitle &&
                    product.metaTitle.length >= 30 &&
                    product.metaTitle.length <= 60 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>
                      {product.metaTitle &&
                      product.metaTitle.length >= 30 &&
                      product.metaTitle.length <= 60
                        ? "20"
                        : product.metaTitle
                          ? "10"
                          : "0"}
                      /20
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Meta Description</span>
                  <div className="flex items-center space-x-2">
                    {product.metaDescription &&
                    product.metaDescription.length >= 120 &&
                    product.metaDescription.length <= 160 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>
                      {product.metaDescription &&
                      product.metaDescription.length >= 120 &&
                      product.metaDescription.length <= 160
                        ? "20"
                        : product.metaDescription
                          ? "10"
                          : "0"}
                      /20
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Description Quality</span>
                  <div className="flex items-center space-x-2">
                    {product.description &&
                    product.description.length >= 100 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>
                      {product.description && product.description.length >= 100
                        ? "15"
                        : product.description
                          ? "8"
                          : "0"}
                      /15
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>URL Handle</span>
                  <div className="flex items-center space-x-2">
                    {product.handle &&
                    product.handle.length <= 50 &&
                    !product.handle.includes("_") ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>
                      {product.handle &&
                      product.handle.length <= 50 &&
                      !product.handle.includes("_")
                        ? "10"
                        : "5"}
                      /10
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Tags</span>
                  <div className="flex items-center space-x-2">
                    {product.tags &&
                    product.tags.length >= 3 &&
                    product.tags.length <= 10 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span>
                      {product.tags &&
                      product.tags.length >= 3 &&
                      product.tags.length <= 10
                        ? "10"
                        : product.tags?.length
                          ? "5"
                          : "0"}
                      /10
                    </span>
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
                  <span>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
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

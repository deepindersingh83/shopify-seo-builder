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
  FileText,
  Link2,
  Video,
  MessageSquare,
  Users,
  Bot,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Target,
  Zap,
  Star,
  ThumbsUp,
  Camera,
  Play,
  Settings,
  BarChart3,
  Calendar,
  Clock,
  Award,
  Lightbulb,
  Sparkles,
  Code,
  Image,
  Share2,
  Heart
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishDate: string;
  status: "published" | "draft" | "scheduled";
  views: number;
  engagementRate: number;
  suggestedProducts: string[];
  currentLinks: number;
  potentialLinks: number;
  seoScore: number;
  readingTime: number;
  category: string;
}

interface ProductLink {
  id: string;
  blogPostId: string;
  productId: string;
  productName: string;
  anchorText: string;
  context: string;
  relevanceScore: number;
  clickThroughRate: number;
  conversionRate: number;
  revenue: number;
  position: "introduction" | "body" | "conclusion" | "sidebar";
  status: "active" | "suggested" | "removed";
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  source: "support_ticket" | "review" | "chat" | "manual";
  category: string;
  votes: number;
  views: number;
  relatedProducts: string[];
  schemaGenerated: boolean;
  lastUpdated: string;
}

interface VideoContent {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: "youtube" | "vimeo" | "shopify" | "custom";
  duration: number;
  views: number;
  engagement: number;
  transcriptionStatus: "completed" | "processing" | "failed" | "pending";
  thumbnailOptimized: boolean;
  schemaMarkup: boolean;
  relatedProducts: string[];
  seoScore: number;
  uploadDate: string;
}

interface UGCContent {
  id: string;
  type: "review" | "photo" | "video" | "qa" | "social_post";
  content: string;
  author: string;
  rating?: number;
  productId: string;
  productName: string;
  platform: string;
  engagement: number;
  sentiment: "positive" | "neutral" | "negative";
  seoValue: number;
  moderationStatus: "approved" | "pending" | "rejected";
  featured: boolean;
  createdAt: string;
}

export default function AdvancedContentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLinkingDialogOpen, setIsLinkingDialogOpen] = useState(false);

  // Mock data for blog posts
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Essential Tech Gadgets for Remote Work",
      slug: "essential-tech-gadgets-remote-work",
      excerpt: "Discover the must-have technology tools that will boost your productivity while working from home.",
      author: "Sarah Johnson",
      publishDate: "2024-01-18",
      status: "published",
      views: 12450,
      engagementRate: 4.2,
      suggestedProducts: ["wireless-headphones", "laptop-stand", "ergonomic-mouse"],
      currentLinks: 3,
      potentialLinks: 8,
      seoScore: 87,
      readingTime: 6,
      category: "Technology"
    },
    {
      id: "2",
      title: "Complete Guide to Sustainable Fashion",
      slug: "sustainable-fashion-guide",
      excerpt: "Learn how to build an eco-friendly wardrobe without compromising on style.",
      author: "Emma Davis",
      publishDate: "2024-01-15",
      status: "published",
      views: 8920,
      engagementRate: 3.8,
      suggestedProducts: ["organic-cotton-dress", "recycled-sneakers", "eco-bag"],
      currentLinks: 2,
      potentialLinks: 12,
      seoScore: 82,
      readingTime: 8,
      category: "Fashion"
    },
    {
      id: "3",
      title: "Home Office Setup Ideas for Small Spaces",
      slug: "home-office-small-spaces",
      excerpt: "Transform any corner of your home into a productive workspace with these clever solutions.",
      author: "Michael Chen",
      publishDate: "2024-01-20",
      status: "draft",
      views: 0,
      engagementRate: 0,
      suggestedProducts: ["compact-desk", "wall-shelves", "desk-organizer"],
      currentLinks: 0,
      potentialLinks: 15,
      seoScore: 0,
      readingTime: 7,
      category: "Home & Office"
    }
  ];

  // Mock product links
  const productLinks: ProductLink[] = [
    {
      id: "1",
      blogPostId: "1",
      productId: "wh001",
      productName: "Premium Wireless Headphones",
      anchorText: "wireless headphones",
      context: "For crystal-clear audio during video calls, invest in quality wireless headphones that offer noise cancellation.",
      relevanceScore: 95,
      clickThroughRate: 8.5,
      conversionRate: 12.3,
      revenue: 2840,
      position: "body",
      status: "active"
    },
    {
      id: "2",
      blogPostId: "1",
      productId: "ls002",
      productName: "Adjustable Laptop Stand",
      anchorText: "ergonomic laptop stand",
      context: "An ergonomic laptop stand can help maintain proper posture during long work sessions.",
      relevanceScore: 88,
      clickThroughRate: 6.2,
      conversionRate: 9.8,
      revenue: 1560,
      position: "body",
      status: "suggested"
    }
  ];

  // Mock FAQ data
  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "How long does shipping take?",
      answer: "We offer free standard shipping (3-5 business days) and express shipping (1-2 business days) options. Express shipping rates vary by location.",
      source: "support_ticket",
      category: "Shipping",
      votes: 45,
      views: 1250,
      relatedProducts: ["all"],
      schemaGenerated: true,
      lastUpdated: "2024-01-18"
    },
    {
      id: "2",
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Return shipping is free for defective items.",
      source: "review",
      category: "Returns",
      votes: 38,
      views: 980,
      relatedProducts: ["all"],
      schemaGenerated: true,
      lastUpdated: "2024-01-16"
    },
    {
      id: "3",
      question: "Are your products eco-friendly?",
      answer: "Yes! We're committed to sustainability. Our products use recycled materials and eco-friendly packaging. We're also carbon-neutral certified.",
      source: "chat",
      category: "Sustainability",
      votes: 52,
      views: 1840,
      relatedProducts: ["eco-collection"],
      schemaGenerated: false,
      lastUpdated: "2024-01-20"
    }
  ];

  // Mock video content
  const videoContent: VideoContent[] = [
    {
      id: "1",
      title: "Unboxing: Premium Wireless Headphones",
      description: "Complete unboxing and first impressions of our best-selling wireless headphones with noise cancellation.",
      url: "https://youtube.com/watch?v=example1",
      platform: "youtube",
      duration: 420,
      views: 25600,
      engagement: 7.8,
      transcriptionStatus: "completed",
      thumbnailOptimized: true,
      schemaMarkup: true,
      relatedProducts: ["wh001", "wh002"],
      seoScore: 92,
      uploadDate: "2024-01-15"
    },
    {
      id: "2",
      title: "How to Set Up Your Home Office",
      description: "Step-by-step guide to creating an ergonomic and productive home office space.",
      url: "https://vimeo.com/example2",
      platform: "vimeo",
      duration: 680,
      views: 18200,
      engagement: 6.4,
      transcriptionStatus: "processing",
      thumbnailOptimized: false,
      schemaMarkup: false,
      relatedProducts: ["desk001", "chair001", "lamp001"],
      seoScore: 76,
      uploadDate: "2024-01-12"
    }
  ];

  // Mock UGC content
  const ugcContent: UGCContent[] = [
    {
      id: "1",
      type: "review",
      content: "Absolutely love these headphones! The noise cancellation is incredible and they're so comfortable for long video calls.",
      author: "Jennifer K.",
      rating: 5,
      productId: "wh001",
      productName: "Premium Wireless Headphones",
      platform: "Product Reviews",
      engagement: 23,
      sentiment: "positive",
      seoValue: 87,
      moderationStatus: "approved",
      featured: true,
      createdAt: "2024-01-19"
    },
    {
      id: "2",
      type: "photo",
      content: "Check out my new home office setup! Everything from the desk to the accessories is perfect.",
      author: "@homeofficepro",
      productId: "desk001",
      productName: "Standing Desk Pro",
      platform: "Instagram",
      engagement: 156,
      sentiment: "positive",
      seoValue: 72,
      moderationStatus: "approved",
      featured: false,
      createdAt: "2024-01-17"
    },
    {
      id: "3",
      type: "qa",
      content: "Q: Does this work with Mac? A: Yes, it's fully compatible with all Mac models!",
      author: "Tech Support",
      productId: "wh001",
      productName: "Premium Wireless Headphones",
      platform: "Q&A Section",
      engagement: 12,
      sentiment: "neutral",
      seoValue: 65,
      moderationStatus: "approved",
      featured: false,
      createdAt: "2024-01-16"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
      case "active":
      case "approved":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "draft":
      case "suggested":
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "removed":
      case "rejected":
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "photo":
        return <Camera className="h-4 w-4 text-blue-500" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-500" />;
      case "qa":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "social_post":
        return <Share2 className="h-4 w-4 text-pink-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Advanced Content Management</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered content optimization with blog-to-product linking, FAQ automation, and video SEO
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Insights
            </Button>
            <Button>
              <Bot className="h-4 w-4 mr-2" />
              AI Content Audit
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              <div className="text-xs text-muted-foreground">
                {blogPosts.filter(p => p.status === "published").length} published
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Product Links</CardTitle>
              <Link2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productLinks.length}</div>
              <div className="text-xs text-muted-foreground">
                {productLinks.filter(l => l.status === "suggested").length} AI suggestions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">FAQ Items</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{faqItems.length}</div>
              <div className="text-xs text-muted-foreground">
                {faqItems.filter(f => f.schemaGenerated).length} with schema
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">UGC Content</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ugcContent.length}</div>
              <div className="text-xs text-muted-foreground">
                {ugcContent.filter(u => u.featured).length} featured items
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
              AI Content Insights
            </CardTitle>
            <CardDescription>AI-powered recommendations to improve your content SEO</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Content Opportunities</span>
                </div>
                <div className="text-sm text-blue-800 mb-2">
                  Found 23 blog posts that could benefit from product linking. Potential revenue increase: $12,400/month.
                </div>
                <Button size="sm" variant="outline">Review Suggestions</Button>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">FAQ Optimization</span>
                </div>
                <div className="text-sm text-green-800 mb-2">
                  8 new FAQ items detected from customer support. Auto-generate schema markup for SEO boost.
                </div>
                <Button size="sm" variant="outline">Generate Schema</Button>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Video className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-900">Video SEO</span>
                </div>
                <div className="text-sm text-purple-800 mb-2">
                  3 videos need transcription and 5 are missing optimized thumbnails. Improve discoverability.
                </div>
                <Button size="sm" variant="outline">Optimize Videos</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="blog-linking" className="space-y-6">
          <TabsList>
            <TabsTrigger value="blog-linking">Blog-to-Product Linking</TabsTrigger>
            <TabsTrigger value="faq-schema">FAQ Schema</TabsTrigger>
            <TabsTrigger value="video-seo">Video SEO</TabsTrigger>
            <TabsTrigger value="ugc-content">User-Generated Content</TabsTrigger>
            <TabsTrigger value="automation">Content Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="blog-linking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Blog-to-Product Linking</CardTitle>
                <CardDescription>
                  Automatically discover and suggest product links within your blog content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Blog Post</TableHead>
                        <TableHead>Current Links</TableHead>
                        <TableHead>AI Suggestions</TableHead>
                        <TableHead>Potential Revenue</TableHead>
                        <TableHead>SEO Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{post.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {post.views.toLocaleString()} views • {post.readingTime} min read
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(post.status)}
                                <Badge variant={post.status === "published" ? "success" : "secondary"}>
                                  {post.status}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="text-lg font-bold">{post.currentLinks}</div>
                              <div className="text-xs text-muted-foreground">Active links</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{post.potentialLinks}</div>
                              <div className="text-xs text-muted-foreground">AI suggestions</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-green-600">
                                $1,240/month
                              </div>
                              <div className="text-muted-foreground">
                                Estimated increase
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{post.seoScore}</span>
                              <Progress value={post.seoScore} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="View Suggestions">
                                <Bot className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Edit Links">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="View Post">
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

            <Card>
              <CardHeader>
                <CardTitle>Product Link Performance</CardTitle>
                <CardDescription>Monitor the performance of your blog-to-product links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Link</TableHead>
                        <TableHead>Context</TableHead>
                        <TableHead>Relevance</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Conversion</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{link.productName}</div>
                              <div className="text-sm text-muted-foreground">
                                Anchor: "{link.anchorText}"
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-xs truncate" title={link.context}>
                              {link.context}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{link.relevanceScore}%</span>
                              <Progress value={link.relevanceScore} className="w-12 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{link.clickThroughRate}%</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{link.conversionRate}%</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-green-600">
                              ${link.revenue.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(link.status)}
                              <Badge variant={link.status === "active" ? "success" : "secondary"} className="ml-2">
                                {link.status}
                              </Badge>
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

          <TabsContent value="faq-schema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>FAQ Schema Automation</CardTitle>
                <CardDescription>
                  Automatically generate FAQ schema markup from customer support data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Schema Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqItems.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{faq.question}</div>
                              <div className="text-sm text-muted-foreground max-w-xs truncate">
                                {faq.answer}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {faq.source.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{faq.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {faq.votes}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Eye className="h-3 w-3 mr-1" />
                                {faq.views}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {faq.schemaGenerated ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <Badge variant="success" className="ml-2">Generated</Badge>
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 text-yellow-500" />
                                  <Badge variant="secondary" className="ml-2">Pending</Badge>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="Preview Schema">
                                <Code className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Edit FAQ">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!faq.schemaGenerated && (
                                <Button size="sm" variant="ghost" title="Generate Schema">
                                  <Zap className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema Markup Generator</CardTitle>
                <CardDescription>Preview and customize FAQ schema markup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="schema-preview">Generated Schema (JSON-LD)</Label>
                    <Textarea 
                      id="schema-preview"
                      className="mt-2 min-h-[200px] font-mono text-sm"
                      value={`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does shipping take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer free standard shipping (3-5 business days) and express shipping (1-2 business days) options."
      }
    }
  ]
}`}
                      readOnly
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>FAQ Categories</Label>
                      <div className="mt-2 space-y-2">
                        {["Shipping", "Returns", "Sustainability", "Product Care"].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span className="text-sm">{category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="min-votes">Minimum Votes Required</Label>
                      <Input id="min-votes" type="number" defaultValue="5" className="mt-2" />
                    </div>
                    <Button>Generate FAQ Schema</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video-seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video SEO Optimization</CardTitle>
                <CardDescription>
                  Optimize your video content for search with transcriptions, thumbnails, and structured data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Video</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Transcription</TableHead>
                        <TableHead>Optimization</TableHead>
                        <TableHead>SEO Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videoContent.map((video) => (
                        <TableRow key={video.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{video.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} • {video.uploadDate}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {video.platform}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {video.views.toLocaleString()}
                              </div>
                              <div className="text-muted-foreground">
                                {video.engagement}% engagement
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(video.transcriptionStatus)}
                              <Badge 
                                variant={video.transcriptionStatus === "completed" ? "success" : "secondary"} 
                                className="ml-2"
                              >
                                {video.transcriptionStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                {video.thumbnailOptimized ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-1" />
                                )}
                                <span className="text-xs">Thumbnail</span>
                              </div>
                              <div className="flex items-center">
                                {video.schemaMarkup ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-1" />
                                )}
                                <span className="text-xs">Schema</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{video.seoScore}</span>
                              <Progress value={video.seoScore} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" title="Optimize Video">
                                <Target className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="View Analytics">
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Watch Video">
                                <Play className="h-4 w-4" />
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

            <Card>
              <CardHeader>
                <CardTitle>Video Optimization Tools</CardTitle>
                <CardDescription>Enhance your videos for better search visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <FileText className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Generate Transcriptions</div>
                      <div className="text-sm text-muted-foreground">AI-powered video transcription</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Image className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Optimize Thumbnails</div>
                      <div className="text-sm text-muted-foreground">A/B test thumbnail designs</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Code className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Video Schema</div>
                      <div className="text-sm text-muted-foreground">Generate structured data</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ugc-content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User-Generated Content SEO</CardTitle>
                <CardDescription>
                  Leverage customer reviews, photos, and social content for SEO value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead>SEO Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ugcContent.map((content) => (
                        <TableRow key={content.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm max-w-xs truncate">{content.content}</div>
                              <div className="text-xs text-muted-foreground">
                                by {content.author} • {content.createdAt}
                              </div>
                              {content.rating && (
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-3 w-3 ${star <= content.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getTypeIcon(content.type)}
                              <Badge variant="outline" className="ml-2 capitalize">
                                {content.type.replace("_", " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{content.productName}</div>
                              <div className="text-muted-foreground">{content.platform}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{content.engagement}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getSentimentIcon(content.sentiment)}
                              <Badge 
                                variant={content.sentiment === "positive" ? "success" : 
                                       content.sentiment === "negative" ? "destructive" : "secondary"}
                                className="ml-2"
                              >
                                {content.sentiment}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{content.seoValue}</span>
                              <Progress value={content.seoValue} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(content.moderationStatus)}
                              <Badge variant={content.moderationStatus === "approved" ? "success" : "secondary"}>
                                {content.moderationStatus}
                              </Badge>
                              {content.featured && (
                                <Badge variant="default">Featured</Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UGC SEO Enhancement</CardTitle>
                <CardDescription>Tools to maximize SEO value from user-generated content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Star className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Review Schema</div>
                      <div className="text-sm text-muted-foreground">Generate review markup</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Camera className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Photo Optimization</div>
                      <div className="text-sm text-muted-foreground">Optimize customer photos</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <MessageSquare className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Q&A Schema</div>
                      <div className="text-sm text-muted-foreground">Structured Q&A data</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Heart className="h-5 w-5 mb-2" />
                    <div className="text-left">
                      <div className="font-medium">Social Proof</div>
                      <div className="text-sm text-muted-foreground">Feature best content</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Automation Rules</CardTitle>
                <CardDescription>Set up automated content optimization and management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Auto-link new blog posts",
                      description: "Automatically suggest product links for new blog content using AI",
                      enabled: true,
                      trigger: "New blog post published"
                    },
                    {
                      name: "FAQ schema generation",
                      description: "Generate FAQ schema markup from support tickets automatically",
                      enabled: true,
                      trigger: "New FAQ item added"
                    },
                    {
                      name: "Video transcription",
                      description: "Automatically transcribe uploaded videos for SEO",
                      enabled: false,
                      trigger: "New video uploaded"
                    },
                    {
                      name: "UGC moderation",
                      description: "Auto-approve positive UGC content and flag negative content",
                      enabled: true,
                      trigger: "New UGC content submitted"
                    },
                    {
                      name: "Content performance alerts",
                      description: "Alert when content drops in search rankings",
                      enabled: false,
                      trigger: "Weekly performance check"
                    }
                  ].map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Trigger: {rule.trigger}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={rule.enabled ? "success" : "secondary"}>
                          {rule.enabled ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          {rule.enabled ? "Configure" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Content Assistant</CardTitle>
                <CardDescription>Configure AI-powered content optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ai-sensitivity">AI Suggestion Sensitivity</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="min-relevance">Minimum Relevance Score</Label>
                      <Input id="min-relevance" type="number" defaultValue="80" className="mt-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Content Types to Analyze</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Blog posts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Product descriptions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Collection pages</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">FAQ content</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button>Save AI Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

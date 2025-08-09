import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Search,
  Monitor,
  Smartphone,
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  ArrowLeft,
  RefreshCw,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SERPResult {
  id: string;
  type:
    | "organic"
    | "featured_snippet"
    | "local_pack"
    | "knowledge_panel"
    | "ads";
  title: string;
  url: string;
  description: string;
  position: number;
  breadcrumb?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  image?: string;
}

export default function SERPPreviewPage() {
  const [activeTab, setActiveTab] = useState("preview");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [location, setLocation] = useState("New York, NY");
  const [searchQuery, setSearchQuery] = useState("premium wireless headphones");

  const [metaData, setMetaData] = useState({
    title: "Premium Wireless Headphones - High Quality Audio | TechStore",
    description:
      "Shop premium wireless headphones with noise cancellation, long battery life, and superior sound quality. Free shipping on orders over $50.",
    url: "https://techstore.com/headphones/wireless-premium",
  });

  const mockSERPResults: SERPResult[] = [
    {
      id: "1",
      type: "ads",
      title: "Premium Headphones Sale - Up to 40% Off",
      url: "amazon.com/headphones",
      description:
        "Shop top-rated wireless headphones. Free shipping & returns.",
      position: 1,
      breadcrumb: "Amazon > Electronics > Headphones",
    },
    {
      id: "2",
      type: "featured_snippet",
      title: "Best Premium Wireless Headphones 2024",
      url: "techstore.com/headphones/wireless-premium",
      description:
        "The best premium wireless headphones offer superior sound quality, active noise cancellation, and long battery life. Top features include...",
      position: 2,
      breadcrumb: "TechStore > Audio > Reviews",
    },
    {
      id: "3",
      type: "organic",
      title: "Premium Wireless Headphones - High Quality Audio | TechStore",
      url: "techstore.com/headphones/wireless-premium",
      description:
        "Shop premium wireless headphones with noise cancellation, long battery life, and superior sound quality. Free shipping on orders over $50.",
      position: 3,
      breadcrumb: "TechStore > Headphones > Wireless",
      rating: 4.7,
      reviews: 2847,
      price: "$299.99",
    },
    {
      id: "4",
      type: "local_pack",
      title: "Electronics Store NYC",
      url: "electronicsnyc.com",
      description: "Premium audio equipment store in Manhattan",
      position: 4,
      rating: 4.5,
      reviews: 156,
    },
  ];

  const handlePreview = () => {
    // Update SERP results based on current meta data
    console.log("Previewing SERP for:", metaData);
  };

  const getSERPIcon = (type: string) => {
    switch (type) {
      case "ads":
        return (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
            Ad
          </span>
        );
      case "featured_snippet":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "local_pack":
        return <MapPin className="h-4 w-4 text-red-500" />;
      case "knowledge_panel":
        return <Globe className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
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
            <h1 className="text-3xl font-bold text-foreground">SERP Preview</h1>
            <p className="text-muted-foreground">
              Preview how your pages will appear in search engine results
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              🎯 Real-time Preview
            </Badge>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">SERP Preview</TabsTrigger>
            <TabsTrigger value="optimize">Optimization</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* SERP Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preview Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Search Query</Label>
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter search query"
                      />
                    </div>
                    <div>
                      <Label>Device</Label>
                      <Select
                        value={device}
                        onValueChange={(value) => setDevice(value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desktop">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              Desktop
                            </div>
                          </SelectItem>
                          <SelectItem value="mobile">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4" />
                              Mobile
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                      />
                    </div>
                    <Button onClick={handlePreview} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Preview
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Meta Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Meta Title ({metaData.title.length}/60)</Label>
                      <Input
                        value={metaData.title}
                        onChange={(e) =>
                          setMetaData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className={
                          metaData.title.length > 60 ? "border-red-500" : ""
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {metaData.title.length > 60
                          ? "Title too long - may be truncated"
                          : "Good length"}
                      </p>
                    </div>
                    <div>
                      <Label>
                        Meta Description ({metaData.description.length}/160)
                      </Label>
                      <Textarea
                        value={metaData.description}
                        onChange={(e) =>
                          setMetaData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        className={
                          metaData.description.length > 160
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {metaData.description.length > 160
                          ? "Description too long - may be truncated"
                          : "Good length"}
                      </p>
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={metaData.url}
                        onChange={(e) =>
                          setMetaData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SERP Results */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search Results Preview
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {device}
                        </span>
                        {device === "desktop" ? (
                          <Monitor className="h-4 w-4" />
                        ) : (
                          <Smartphone className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Google Search Bar Mockup */}
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            G
                          </span>
                        </div>
                        <div className="flex-1 bg-white border rounded-full px-4 py-2 flex items-center gap-2">
                          <Search className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{searchQuery}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        About 45,600,000 results (0.48 seconds)
                      </div>
                    </div>

                    {/* SERP Results */}
                    <div className="space-y-4">
                      {mockSERPResults.map((result, index) => (
                        <div key={result.id} className="group">
                          {result.type === "featured_snippet" && (
                            <div className="border rounded-lg p-4 mb-4 bg-blue-50">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">
                                  Featured Snippet
                                </span>
                              </div>
                              <h3 className="text-lg text-blue-600 hover:underline cursor-pointer font-medium mb-1">
                                {result.title}
                              </h3>
                              <p className="text-sm text-green-600 mb-2">
                                {result.url}
                              </p>
                              <p className="text-sm text-gray-700">
                                {result.description}
                              </p>
                            </div>
                          )}

                          {result.type === "ads" && (
                            <div className="border-l-4 border-yellow-400 pl-4 mb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  Ad
                                </span>
                              </div>
                              <h3 className="text-lg text-purple-600 hover:underline cursor-pointer font-medium mb-1">
                                {result.title}
                              </h3>
                              <p className="text-sm text-green-600 mb-1">
                                {result.url}
                              </p>
                              <p className="text-sm text-gray-700">
                                {result.description}
                              </p>
                            </div>
                          )}

                          {result.type === "organic" && (
                            <div
                              className={`${result.url.includes("techstore.com") ? "bg-blue-50 border border-blue-200 rounded-lg p-3" : ""}`}
                            >
                              <h3 className="text-xl text-blue-600 hover:underline cursor-pointer mb-1">
                                {device === "mobile"
                                  ? truncateText(result.title, 50)
                                  : result.title}
                              </h3>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm text-green-600">
                                  {result.url}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              {result.breadcrumb && (
                                <p className="text-xs text-gray-500 mb-1">
                                  {result.breadcrumb}
                                </p>
                              )}
                              <p className="text-sm text-gray-700 mb-2">
                                {device === "mobile"
                                  ? truncateText(result.description, 120)
                                  : result.description}
                              </p>
                              {(result.rating || result.price) && (
                                <div className="flex items-center gap-4 text-sm">
                                  {result.rating && (
                                    <div className="flex items-center gap-1">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3 w-3 ${i < Math.floor(result.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                          />
                                        ))}
                                      </div>
                                      <span>{result.rating}</span>
                                      {result.reviews && (
                                        <span className="text-gray-500">
                                          ({result.reviews} reviews)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {result.price && (
                                    <span className="font-semibold text-green-600">
                                      {result.price}
                                    </span>
                                  )}
                                </div>
                              )}
                              {result.url.includes("techstore.com") && (
                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                  <p className="text-xs text-green-700 font-medium">
                                    ✅ This is your page!
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {result.type === "local_pack" && index === 3 && (
                            <div className="border rounded-lg p-4 mb-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Local Results
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="font-medium text-blue-600">
                                      {result.title}
                                    </h5>
                                    <div className="flex items-center gap-1 text-sm">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3 w-3 ${i < Math.floor(result.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                          />
                                        ))}
                                      </div>
                                      <span>
                                        {result.rating} ({result.reviews})
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {result.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <Button size="sm" variant="outline">
                                      <Phone className="h-3 w-3 mr-1" />
                                      Call
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Website
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimize" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Title Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Title</Label>
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      {metaData.title}
                    </div>
                  </div>
                  <div>
                    <Label>Optimization Suggestions</Label>
                    <div className="space-y-2">
                      <div className="p-3 border rounded">
                        <p className="text-sm font-medium text-green-600">
                          ✅ Good keyword placement
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Primary keyword appears at the beginning
                        </p>
                      </div>
                      <div className="p-3 border rounded">
                        <p className="text-sm font-medium text-yellow-600">
                          ⚠️ Consider brand positioning
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Move brand name to the end for better CTR
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Description</Label>
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      {metaData.description}
                    </div>
                  </div>
                  <div>
                    <Label>Optimization Suggestions</Label>
                    <div className="space-y-2">
                      <div className="p-3 border rounded">
                        <p className="text-sm font-medium text-green-600">
                          ✅ Good call-to-action
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Clear value proposition mentioned
                        </p>
                      </div>
                      <div className="p-3 border rounded">
                        <p className="text-sm font-medium text-blue-600">
                          💡 Add urgency
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Consider adding "Limited time" or "Today only"
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">CTR Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">8.5%</div>
                  <p className="text-xs text-muted-foreground">
                    Expected click-through rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">SERP Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">#3</div>
                  <p className="text-xs text-muted-foreground">
                    Predicted ranking position
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Optimization Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    78/100
                  </div>
                  <p className="text-xs text-muted-foreground">
                    SERP optimization score
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Competitor Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">
                        Amazon - Premium Headphones
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Position #1 • CTR: 12.3%
                      </p>
                    </div>
                    <Badge variant="destructive">Above us</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">Best Buy - Wireless Audio</h4>
                      <p className="text-sm text-muted-foreground">
                        Position #4 • CTR: 6.8%
                      </p>
                    </div>
                    <Badge variant="default">Below us</Badge>
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

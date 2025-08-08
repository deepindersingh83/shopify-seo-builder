import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Facebook,
  Instagram,
  Twitter,
  Video,
  Image,
  Calendar,
  Settings,
  Zap,
  Eye,
  Edit,
  Copy,
  Share2,
  Play,
  Clock,
  Target,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SocialTemplate {
  id: string;
  platform: "facebook" | "instagram" | "tiktok" | "pinterest" | "twitter";
  name: string;
  template: string;
  variables: string[];
  mediaType: "image" | "video" | "carousel";
  enabled: boolean;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  mediaUrl: string;
  scheduledTime: string;
  status: "scheduled" | "posted" | "failed";
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export default function SocialMediaAutopostPage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");

  const templates: SocialTemplate[] = [
    {
      id: "1",
      platform: "facebook",
      name: "Product Launch",
      template: "🚀 New arrival! {{product_name}} is now available!\n\n✨ {{product_description}}\n\n💰 Starting at ${{price}}\n\n🛒 Shop now: {{product_url}}\n\n#{{brand}} #newproduct #shopnow",
      variables: ["product_name", "product_description", "price", "product_url", "brand"],
      mediaType: "image",
      enabled: true,
    },
    {
      id: "2",
      platform: "instagram",
      name: "Product Showcase",
      template: "{{product_name}} ✨\n\n{{product_description}}\n\n🔗 Link in bio\n\n#{{brand}} #{{category}} #instashop #{{product_name}}",
      variables: ["product_name", "product_description", "brand", "category"],
      mediaType: "image",
      enabled: true,
    },
    {
      id: "3",
      platform: "tiktok",
      name: "Product Demo Video",
      template: "Check out {{product_name}}! 🔥\n\n{{short_description}}\n\n#{{brand}} #{{category}} #viral #foryou",
      variables: ["product_name", "short_description", "brand", "category"],
      mediaType: "video",
      enabled: true,
    },
    {
      id: "4",
      platform: "pinterest",
      name: "Product Pin",
      template: "{{product_name}} - {{category}}\n\n{{product_description}}\n\nPrice: ${{price}}\n\n#{{brand}} #{{category}} #shopping",
      variables: ["product_name", "category", "product_description", "price", "brand"],
      mediaType: "image",
      enabled: true,
    },
    {
      id: "5",
      platform: "twitter",
      name: "Product Tweet",
      template: "🆕 {{product_name}} is here!\n\n{{short_description}}\n\n💰 ${{price}}\n🛒 {{product_url}}\n\n#{{brand}} #newproduct",
      variables: ["product_name", "short_description", "price", "product_url", "brand"],
      mediaType: "image",
      enabled: true,
    },
  ];

  const scheduledPosts: SocialPost[] = [
    {
      id: "1",
      platform: "Facebook",
      content: "🚀 New arrival! Premium Wireless Headphones now available!",
      mediaUrl: "https://picsum.photos/400/400?random=1",
      scheduledTime: "2024-01-20 10:00 AM",
      status: "scheduled",
      engagement: { likes: 0, shares: 0, comments: 0 },
    },
    {
      id: "2",
      platform: "Instagram",
      content: "Premium Wireless Headphones ✨ Perfect sound quality",
      mediaUrl: "https://picsum.photos/400/400?random=2",
      scheduledTime: "2024-01-20 02:00 PM",
      status: "posted",
      engagement: { likes: 245, shares: 12, comments: 8 },
    },
  ];

  const platformIcons = {
    facebook: <Facebook className="h-5 w-5 text-blue-600" />,
    instagram: <Instagram className="h-5 w-5 text-pink-600" />,
    tiktok: <Video className="h-5 w-5 text-black" />,
    pinterest: <Image className="h-5 w-5 text-red-600" />,
    twitter: <Twitter className="h-5 w-5 text-blue-400" />,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "text-blue-600";
      case "posted": return "text-green-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
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
            <h1 className="text-3xl font-bold text-foreground">Social Media Auto-posting</h1>
            <p className="text-muted-foreground">
              Automatically post your products across all social media platforms with AI-optimized content
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              🤖 AI-Powered
            </Badge>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Social Media Templates
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize templates for each platform with dynamic variables
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  {Object.entries(platformIcons).map(([platform, icon]) => (
                    <Button
                      key={platform}
                      variant={selectedPlatform === platform ? "default" : "outline"}
                      onClick={() => setSelectedPlatform(platform)}
                      className="flex items-center gap-2"
                    >
                      {icon}
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templates
                    .filter(template => template.platform === selectedPlatform)
                    .map((template) => (
                      <Card key={template.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{template.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Switch checked={template.enabled} />
                              <Button variant="ghost" size="sm">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Badge variant="outline" className="w-fit">
                            {template.mediaType}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Template Content:</label>
                              <Textarea
                                value={template.template}
                                className="mt-1 min-h-[100px]"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Available Variables:</label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {template.variables.map((variable) => (
                                  <Badge key={variable} variant="secondary" className="text-xs">
                                    {`{{${variable}}}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduler Tab */}
          <TabsContent value="scheduler" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Scheduled Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scheduledPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img
                              src={post.mediaUrl}
                              alt="Post media"
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{post.content.substring(0, 50)}...</p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{post.platform}</span>
                                <span>•</span>
                                <span>{post.scheduledTime}</span>
                              </div>
                              {post.status === "posted" && (
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                  <span>❤️ {post.engagement.likes}</span>
                                  <span>💬 {post.engagement.comments}</span>
                                  <span>🔄 {post.engagement.shares}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={post.status === "posted" ? "default" : "secondary"}>
                              {post.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
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
                      Quick Post
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Product:</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product1">Premium Wireless Headphones</SelectItem>
                          <SelectItem value="product2">Smart Watch Pro</SelectItem>
                          <SelectItem value="product3">Bluetooth Speaker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Platforms:</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(platformIcons).map(([platform, icon]) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Switch id={platform} />
                            <label htmlFor={platform} className="flex items-center gap-1 text-sm">
                              {icon}
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Schedule Time:</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input type="date" />
                        <Input type="time" />
                      </div>
                    </div>

                    <Button className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Schedule Posts
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.5%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Traffic Generated</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,230</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(platformIcons).map(([platform, icon]) => (
                    <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {icon}
                        <div>
                          <h4 className="font-medium capitalize">{platform}</h4>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 500) + 100} posts this month
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {(Math.random() * 10 + 5).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Engagement Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Connections</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect your social media accounts to enable auto-posting
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(platformIcons).map(([platform, icon]) => (
                    <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {icon}
                        <div>
                          <h4 className="font-medium capitalize">{platform}</h4>
                          <p className="text-sm text-muted-foreground">
                            {Math.random() > 0.5 ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button variant={Math.random() > 0.5 ? "outline" : "default"} size="sm">
                        {Math.random() > 0.5 ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-posting Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Auto-posting</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically post when new products are added
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">AI Content Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Use AI to optimize post content for each platform
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Optimal Timing</h4>
                    <p className="text-sm text-muted-foreground">
                      Post at optimal times based on audience analysis
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

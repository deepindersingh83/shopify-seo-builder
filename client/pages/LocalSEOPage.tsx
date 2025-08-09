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
  MapPin,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Star,
  Phone,
  Mail,
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
  Share2,
  ArrowRight,
  Building,
  Users,
  MessageSquare,
  ThumbsUp,
  Navigation,
  Camera,
  Award,
  ExternalLink,
} from "lucide-react";

interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  website: string;
  category: string;
  gmbStatus: "verified" | "pending" | "suspended" | "not_claimed";
  rating: number;
  reviewCount: number;
  photos: number;
  posts: number;
  lastUpdated: string;
  isMainLocation: boolean;
}

interface Citation {
  id: string;
  source: string;
  url: string;
  businessName: string;
  address: string;
  phone: string;
  website: string;
  status: "accurate" | "inconsistent" | "missing" | "duplicate";
  authority: number;
  lastChecked: string;
  category: "directory" | "review_site" | "social" | "industry_specific";
}

interface LocalKeyword {
  id: string;
  keyword: string;
  location: string;
  searchVolume: number;
  difficulty: number;
  currentRank: number;
  targetRank: number;
  localSearchVolume: number;
  mapPackPosition?: number;
  competitionLevel: "low" | "medium" | "high";
}

interface Review {
  id: string;
  platform: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  response?: string;
  responseDate?: string;
  status: "new" | "responded" | "escalated";
  sentiment: "positive" | "neutral" | "negative";
}

export default function LocalSEOPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false);

  // Mock business locations data
  const businessLocations: BusinessLocation[] = [
    {
      id: "1",
      name: "SEO Manager - Downtown Office",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
      website: "https://seomanager.com",
      category: "Software Company",
      gmbStatus: "verified",
      rating: 4.8,
      reviewCount: 124,
      photos: 45,
      posts: 12,
      lastUpdated: "2024-01-20",
      isMainLocation: true,
    },
    {
      id: "2",
      name: "SEO Manager - West Coast Branch",
      address: "456 Tech Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA",
      phone: "+1 (555) 987-6543",
      website: "https://seomanager.com",
      category: "Software Company",
      gmbStatus: "verified",
      rating: 4.6,
      reviewCount: 89,
      photos: 32,
      posts: 8,
      lastUpdated: "2024-01-19",
      isMainLocation: false,
    },
    {
      id: "3",
      name: "SEO Manager - Support Center",
      address: "789 Business Park Dr",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
      phone: "+1 (555) 456-7890",
      website: "https://seomanager.com",
      category: "Software Company",
      gmbStatus: "pending",
      rating: 4.5,
      reviewCount: 67,
      photos: 28,
      posts: 5,
      lastUpdated: "2024-01-18",
      isMainLocation: false,
    },
  ];

  // Mock citations data
  const citations: Citation[] = [
    {
      id: "1",
      source: "Google My Business",
      url: "https://google.com/business",
      businessName: "SEO Manager",
      address: "123 Main Street, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      website: "https://seomanager.com",
      status: "accurate",
      authority: 100,
      lastChecked: "2024-01-20",
      category: "directory",
    },
    {
      id: "2",
      source: "Yelp",
      url: "https://yelp.com/biz/seo-manager",
      businessName: "SEO Manager",
      address: "123 Main Street, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      website: "https://seomanager.com",
      status: "accurate",
      authority: 95,
      lastChecked: "2024-01-20",
      category: "review_site",
    },
    {
      id: "3",
      source: "Yellow Pages",
      url: "https://yellowpages.com/seo-manager",
      businessName: "SEO Manager Inc.",
      address: "123 Main St, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      website: "",
      status: "inconsistent",
      authority: 78,
      lastChecked: "2024-01-19",
      category: "directory",
    },
    {
      id: "4",
      source: "Capterra",
      url: "https://capterra.com/p/seo-manager",
      businessName: "SEO Manager",
      address: "",
      phone: "",
      website: "https://seomanager.com",
      status: "missing",
      authority: 85,
      lastChecked: "2024-01-18",
      category: "industry_specific",
    },
  ];

  // Mock local keywords data
  const localKeywords: LocalKeyword[] = [
    {
      id: "1",
      keyword: "SEO software NYC",
      location: "New York, NY",
      searchVolume: 1200,
      difficulty: 68,
      currentRank: 4,
      targetRank: 1,
      localSearchVolume: 890,
      mapPackPosition: 2,
      competitionLevel: "high",
    },
    {
      id: "2",
      keyword: "digital marketing tools Manhattan",
      location: "Manhattan, NY",
      searchVolume: 850,
      difficulty: 72,
      currentRank: 12,
      targetRank: 5,
      localSearchVolume: 640,
      competitionLevel: "high",
    },
    {
      id: "3",
      keyword: "SEO consultant San Francisco",
      location: "San Francisco, CA",
      searchVolume: 950,
      difficulty: 75,
      currentRank: 8,
      targetRank: 3,
      localSearchVolume: 720,
      mapPackPosition: 1,
      competitionLevel: "high",
    },
  ];

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: "1",
      platform: "Google",
      author: "Sarah Johnson",
      rating: 5,
      text: "Excellent SEO software! Has helped our business grow significantly. The interface is intuitive and the support team is fantastic.",
      date: "2024-01-18",
      response:
        "Thank you Sarah! We're thrilled to hear about your success with our platform.",
      responseDate: "2024-01-19",
      status: "responded",
      sentiment: "positive",
    },
    {
      id: "2",
      platform: "Yelp",
      author: "Mike Chen",
      rating: 4,
      text: "Good software overall. The keyword tracking features are really helpful. Could use some improvements in the reporting section.",
      date: "2024-01-16",
      status: "new",
      sentiment: "positive",
    },
    {
      id: "3",
      platform: "Google",
      author: "Anonymous User",
      rating: 2,
      text: "Had some issues with the initial setup. Support was slow to respond. The features are good but onboarding needs work.",
      date: "2024-01-15",
      status: "escalated",
      sentiment: "negative",
    },
  ];

  const getGMBStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "not_claimed":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCitationStatusColor = (status: string) => {
    switch (status) {
      case "accurate":
        return "text-green-600 bg-green-50 border-green-200";
      case "inconsistent":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "missing":
        return "text-red-600 bg-red-50 border-red-200";
      case "duplicate":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
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

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on locations:`, selectedLocations);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Local SEO</h1>
            <p className="text-muted-foreground mt-2">
              Optimize your business for local search results and improve
              visibility in your target geographic areas
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog
              open={isAddLocationDialogOpen}
              onOpenChange={setIsAddLocationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Business Location</DialogTitle>
                  <DialogDescription>
                    Add a new business location to manage local SEO
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select defaultValue="software">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="software">
                            Software Company
                          </SelectItem>
                          <SelectItem value="retail">Retail Store</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="service">
                            Service Provider
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="123 Main Street" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="NY" />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" placeholder="https://example.com" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddLocationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddLocationDialogOpen(false)}>
                    Add Location
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
              <CardTitle className="text-sm font-medium">
                Business Locations
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businessLocations.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {
                  businessLocations.filter((l) => l.gmbStatus === "verified")
                    .length
                }{" "}
                verified
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  businessLocations.reduce((acc, loc) => acc + loc.rating, 0) /
                  businessLocations.length
                ).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {businessLocations.reduce(
                  (acc, loc) => acc + loc.reviewCount,
                  0,
                )}{" "}
                total reviews
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Citation Accuracy
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  (citations.filter((c) => c.status === "accurate").length /
                    citations.length) *
                    100,
                )}
                %
              </div>
              <div className="text-xs text-muted-foreground">
                {citations.filter((c) => c.status === "inconsistent").length}{" "}
                need fixing
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Local Rankings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  localKeywords.reduce((acc, kw) => acc + kw.currentRank, 0) /
                    localKeywords.length,
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Average position
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common local SEO management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Building className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">GMB Optimization</div>
                  <div className="text-sm text-muted-foreground">
                    Optimize Google My Business
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <FileText className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Citation Audit</div>
                  <div className="text-sm text-muted-foreground">
                    Check citation consistency
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Star className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Review Response</div>
                  <div className="text-sm text-muted-foreground">
                    Respond to customer reviews
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start"
              >
                <Search className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">Local Keywords</div>
                  <div className="text-sm text-muted-foreground">
                    Track local search rankings
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="locations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="locations">Business Locations</TabsTrigger>
            <TabsTrigger value="citations">Citations</TabsTrigger>
            <TabsTrigger value="keywords">Local Keywords</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="gmb">GMB Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-6">
            {/* Bulk Actions */}
            {selectedLocations.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedLocations.length} location(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("update")}
                      >
                        Bulk Update
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("verify")}
                      >
                        Verify GMB
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBulkAction("optimize")}
                      >
                        Optimize
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business Locations Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Business Locations ({businessLocations.length})
                </CardTitle>
                <CardDescription>
                  Manage your business locations and Google My Business profiles
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
                                setSelectedLocations(
                                  businessLocations.map((l) => l.id),
                                );
                              } else {
                                setSelectedLocations([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Business Information</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>GMB Status</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businessLocations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedLocations.includes(location.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLocations([
                                    ...selectedLocations,
                                    location.id,
                                  ]);
                                } else {
                                  setSelectedLocations(
                                    selectedLocations.filter(
                                      (id) => id !== location.id,
                                    ),
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center">
                                {location.name}
                                {location.isMainLocation && (
                                  <Badge
                                    variant="default"
                                    className="ml-2 text-xs"
                                  >
                                    Main
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {location.category}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {location.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{location.address}</div>
                              <div className="text-muted-foreground">
                                {location.city}, {location.state}{" "}
                                {location.zipCode}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getGMBStatusIcon(location.gmbStatus)}
                              <Badge
                                variant={
                                  location.gmbStatus === "verified"
                                    ? "success"
                                    : location.gmbStatus === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="ml-2"
                              >
                                {location.gmbStatus.replace("_", " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                <span className="font-medium">
                                  {location.rating}
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                {location.reviewCount} reviews
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{location.photos} photos</div>
                              <div className="text-muted-foreground">
                                {location.posts} posts
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {location.lastUpdated}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Edit Location"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Optimize"
                              >
                                <Target className="h-4 w-4" />
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

          <TabsContent value="citations" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Citation consistency is crucial for local SEO. Ensure your
                business information is accurate across all directories.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Citation Status Overview</CardTitle>
                <CardDescription>
                  Monitor your business listings across the web
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {["accurate", "inconsistent", "missing", "duplicate"].map(
                    (status) => {
                      const count = citations.filter(
                        (c) => c.status === status,
                      ).length;
                      const percentage = (count / citations.length) * 100;
                      return (
                        <div
                          key={status}
                          className="text-center p-4 border rounded-lg"
                        >
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {status}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Citations ({citations.length})</CardTitle>
                <CardDescription>
                  Manage your business citations across directories and review
                  sites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Business Information</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Authority</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Checked</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {citations.map((citation) => (
                        <TableRow key={citation.id}>
                          <TableCell>
                            <div className="font-medium">{citation.source}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                              {citation.url}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="font-medium">
                                {citation.businessName}
                              </div>
                              <div className="text-muted-foreground">
                                {citation.address}
                              </div>
                              <div className="text-muted-foreground">
                                {citation.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getCitationStatusColor(
                                citation.status,
                              )}
                            >
                              {citation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {citation.authority}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {citation.category.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {citation.lastChecked}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                title="View Citation"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Update Citation"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Visit Site"
                              >
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

          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Local Keyword Performance</CardTitle>
                <CardDescription>
                  Track your rankings for location-based keywords
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Current Rank</TableHead>
                        <TableHead>Target Rank</TableHead>
                        <TableHead>Search Volume</TableHead>
                        <TableHead>Map Pack</TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead>Difficulty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localKeywords.map((keyword) => (
                        <TableRow key={keyword.id}>
                          <TableCell>
                            <div className="font-medium">{keyword.keyword}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{keyword.location}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-medium">
                                #{keyword.currentRank}
                              </span>
                              {keyword.currentRank <= keyword.targetRank ? (
                                <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-orange-500 ml-2" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              #{keyword.targetRank}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{keyword.searchVolume.toLocaleString()}</div>
                              <div className="text-muted-foreground">
                                {keyword.localSearchVolume.toLocaleString()}{" "}
                                local
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {keyword.mapPackPosition ? (
                              <Badge variant="success">
                                #{keyword.mapPackPosition}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Not in pack</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getCompetitionColor(
                                keyword.competitionLevel,
                              )}
                            >
                              {keyword.competitionLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">
                                {keyword.difficulty}%
                              </span>
                              <Progress
                                value={keyword.difficulty}
                                className="w-16 h-2 ml-2"
                              />
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

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">4.6</div>
                      <div className="flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        280 reviews
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = Math.floor(Math.random() * 50) + 10;
                        const percentage = (count / 280) * 100;
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-2">{rating}</span>
                            <Star className="h-3 w-3 text-yellow-400" />
                            <Progress
                              value={percentage}
                              className="flex-1 h-2"
                            />
                            <span className="text-sm w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>
                    Latest customer feedback across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.author}</span>
                            <Badge variant="outline">{review.platform}</Badge>
                            {getSentimentIcon(review.sentiment)}
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {review.text}
                        </div>
                        {review.response && (
                          <div className="pl-4 border-l-2 border-blue-200 bg-blue-50 p-2 rounded">
                            <div className="text-sm font-medium text-blue-900">
                              Business Response:
                            </div>
                            <div className="text-sm text-blue-800">
                              {review.response}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                          <div className="flex gap-2">
                            {review.status === "new" && (
                              <Button size="sm" variant="outline">
                                Respond
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gmb" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google My Business Optimization</CardTitle>
                <CardDescription>
                  Manage and optimize your Google My Business profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Profile Completeness</h4>
                    <div className="space-y-3">
                      {[
                        { item: "Business Information", completed: true },
                        { item: "Business Hours", completed: true },
                        { item: "Photos (10+)", completed: true },
                        { item: "Business Description", completed: false },
                        { item: "Services/Products", completed: true },
                        { item: "Regular Posts", completed: false },
                      ].map((check, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{check.item}</span>
                          {check.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Completeness</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Photos
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Create Post
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respond to Reviews
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Update Business Hours
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Insights
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GMB Performance Insights</CardTitle>
                <CardDescription>
                  Key metrics from your Google My Business profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      2,847
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Profile Views
                    </div>
                    <div className="text-xs text-green-600">
                      +12% this month
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">567</div>
                    <div className="text-sm text-muted-foreground">
                      Website Clicks
                    </div>
                    <div className="text-xs text-green-600">+8% this month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      234
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Direction Requests
                    </div>
                    <div className="text-xs text-green-600">
                      +15% this month
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-sm text-muted-foreground">
                      Phone Calls
                    </div>
                    <div className="text-xs text-red-600">-3% this month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Local Search Visibility</CardTitle>
                  <CardDescription>
                    Your visibility in local search results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">
                        87%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Local Visibility Score
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Map Pack Appearances</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Local Organic Rankings</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Review Score Impact</span>
                        <span className="font-medium">85%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competitor Comparison</CardTitle>
                  <CardDescription>
                    How you compare to local competitors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Your Business",
                        score: 87,
                        reviews: 280,
                        rating: 4.6,
                      },
                      {
                        name: "Competitor A",
                        score: 82,
                        reviews: 156,
                        rating: 4.3,
                      },
                      {
                        name: "Competitor B",
                        score: 75,
                        reviews: 203,
                        rating: 4.1,
                      },
                      {
                        name: "Competitor C",
                        score: 68,
                        reviews: 89,
                        rating: 4.4,
                      },
                    ].map((business, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{business.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {business.reviews} reviews • {business.rating} ★
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={business.score}
                            className="w-20 h-2"
                          />
                          <span className="text-sm font-medium w-8">
                            {business.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Local SEO Recommendations</CardTitle>
                <CardDescription>
                  AI-powered suggestions to improve your local SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center mb-2">
                      <Award className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">
                        High Priority
                      </span>
                    </div>
                    <div className="text-sm text-green-800 mb-2">
                      Add business description to your GMB profile to improve
                      local search visibility.
                    </div>
                    <Button size="sm" variant="outline">
                      Complete Now
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-center mb-2">
                      <Target className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="font-medium text-orange-900">
                        Medium Priority
                      </span>
                    </div>
                    <div className="text-sm text-orange-800 mb-2">
                      Optimize for "SEO software Austin" - you're currently
                      ranking #8 but could reach top 3.
                    </div>
                    <Button size="sm" variant="outline">
                      Start Optimization
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">
                        Low Priority
                      </span>
                    </div>
                    <div className="text-sm text-blue-800 mb-2">
                      Consider creating location-specific landing pages for
                      better local SEO performance.
                    </div>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
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

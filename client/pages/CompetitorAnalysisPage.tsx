import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Users,
  TrendingUp,
  Search,
  BarChart3,
  Target,
  Globe,
  Link2,
  DollarSign,
  ArrowLeft,
  Plus,
  Eye,
  Zap,
  AlertTriangle,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Competitor {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  industry: string;
  estimatedTraffic: number;
  domainAuthority: number;
  backlinks: number;
  organicKeywords: number;
  avgPosition: number;
  marketShare: number;
  status: "monitoring" | "analyzing" | "completed";
}

interface KeywordGap {
  keyword: string;
  yourPosition?: number;
  competitorPosition: number;
  searchVolume: number;
  difficulty: number;
  opportunity: "high" | "medium" | "low";
}

interface BacklinkGap {
  domain: string;
  domainAuthority: number;
  linkToCompetitors: number;
  linkToYou: boolean;
  linkType: string;
  opportunity: "high" | "medium" | "low";
}

export default function CompetitorAnalysisPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCompetitor, setSelectedCompetitor] =
    useState<Competitor | null>(null);
  const [newCompetitorDomain, setNewCompetitorDomain] = useState("");

  const competitors: Competitor[] = [
    {
      id: "1",
      name: "Amazon Electronics",
      domain: "amazon.com",
      industry: "E-commerce",
      estimatedTraffic: 2800000000,
      domainAuthority: 96,
      backlinks: 15600000,
      organicKeywords: 3400000,
      avgPosition: 8.2,
      marketShare: 28.5,
      status: "completed",
    },
    {
      id: "2",
      name: "Best Buy",
      domain: "bestbuy.com",
      industry: "Electronics Retail",
      estimatedTraffic: 145000000,
      domainAuthority: 88,
      backlinks: 2100000,
      organicKeywords: 890000,
      avgPosition: 12.4,
      marketShare: 8.2,
      status: "completed",
    },
    {
      id: "3",
      name: "Newegg",
      domain: "newegg.com",
      industry: "Tech E-commerce",
      estimatedTraffic: 67000000,
      domainAuthority: 82,
      backlinks: 980000,
      organicKeywords: 420000,
      avgPosition: 15.6,
      marketShare: 3.8,
      status: "analyzing",
    },
    {
      id: "4",
      name: "B&H Photo",
      domain: "bhphotovideo.com",
      industry: "Electronics",
      estimatedTraffic: 34000000,
      domainAuthority: 79,
      backlinks: 560000,
      organicKeywords: 180000,
      avgPosition: 18.2,
      marketShare: 1.9,
      status: "monitoring",
    },
  ];

  const keywordGaps: KeywordGap[] = [
    {
      keyword: "wireless noise cancelling headphones",
      competitorPosition: 3,
      searchVolume: 89000,
      difficulty: 68,
      opportunity: "high",
    },
    {
      keyword: "premium audio equipment",
      yourPosition: 12,
      competitorPosition: 2,
      searchVolume: 45000,
      difficulty: 72,
      opportunity: "high",
    },
    {
      keyword: "bluetooth speakers reviews",
      competitorPosition: 1,
      searchVolume: 67000,
      difficulty: 55,
      opportunity: "medium",
    },
    {
      keyword: "gaming headset comparison",
      yourPosition: 8,
      competitorPosition: 4,
      searchVolume: 34000,
      difficulty: 48,
      opportunity: "medium",
    },
  ];

  const backlinkGaps: BacklinkGap[] = [
    {
      domain: "techcrunch.com",
      domainAuthority: 91,
      linkToCompetitors: 5,
      linkToYou: false,
      linkType: "Review Article",
      opportunity: "high",
    },
    {
      domain: "cnet.com",
      domainAuthority: 89,
      linkToCompetitors: 8,
      linkToYou: true,
      linkType: "Product Review",
      opportunity: "medium",
    },
    {
      domain: "theverge.com",
      domainAuthority: 87,
      linkToCompetitors: 3,
      linkToYou: false,
      linkType: "News Article",
      opportunity: "high",
    },
  ];

  const addCompetitor = () => {
    if (newCompetitorDomain) {
      console.log("Adding competitor:", newCompetitorDomain);
      setNewCompetitorDomain("");
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "analyzing":
        return <Zap className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "monitoring":
        return <Eye className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
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
            <h1 className="text-3xl font-bold text-foreground">
              Competitor Analysis
            </h1>
            <p className="text-muted-foreground">
              Analyze competitor strategies, keywords, and performance to gain
              competitive advantages
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              Pro Feature
            </Badge>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keyword Gaps</TabsTrigger>
            <TabsTrigger value="backlinks">Backlink Gaps</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Add Competitor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Competitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter competitor domain (e.g., competitor.com)"
                    value={newCompetitorDomain}
                    onChange={(e) => setNewCompetitorDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Competitors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {competitors.map((competitor) => (
                <Card
                  key={competitor.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {competitor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{competitor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {competitor.domain}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(competitor.status)}
                        <Badge variant="outline" className="text-xs">
                          {competitor.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(competitor.estimatedTraffic)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Monthly Traffic
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {competitor.domainAuthority}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Domain Authority
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Market Share</span>
                          <span className="font-medium">
                            {competitor.marketShare}%
                          </span>
                        </div>
                        <Progress
                          value={competitor.marketShare}
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">
                            {formatNumber(competitor.backlinks)}
                          </div>
                          <div className="text-muted-foreground">Backlinks</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {formatNumber(competitor.organicKeywords)}
                          </div>
                          <div className="text-muted-foreground">Keywords</div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Market Share Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Market Share Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitors.slice(0, 4).map((competitor, index) => (
                    <div
                      key={competitor.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {competitor.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{competitor.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <Progress
                            value={competitor.marketShare}
                            className="h-2"
                          />
                        </div>
                        <span className="font-medium w-12 text-right">
                          {competitor.marketShare}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keyword Gaps Tab */}
          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Keyword Gap Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Keywords your competitors rank for that you don't, or where
                  they outrank you
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keywordGaps.map((gap, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{gap.keyword}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Volume: {formatNumber(gap.searchVolume)}</span>
                          <span>Difficulty: {gap.difficulty}%</span>
                          {gap.yourPosition && (
                            <span>Your position: #{gap.yourPosition}</span>
                          )}
                          <span>Competitor: #{gap.competitorPosition}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getOpportunityColor(gap.opportunity)}>
                          {gap.opportunity} opportunity
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Target className="h-3 w-3 mr-1" />
                          Target
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keyword Gap Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">247</div>
                    <div className="text-sm text-muted-foreground">
                      High Opportunity Keywords
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      589
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Medium Opportunity Keywords
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      1,247
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Keywords Analyzed
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backlink Gaps Tab */}
          <TabsContent value="backlinks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Backlink Gap Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  High-authority domains linking to competitors but not to you
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backlinkGaps.map((gap, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{gap.domain}</h4>
                          <Badge variant="outline">
                            DA {gap.domainAuthority}
                          </Badge>
                          {gap.linkToYou && (
                            <Badge variant="default">Links to you</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Type: {gap.linkType}</span>
                          <span>
                            Links to competitors: {gap.linkToCompetitors}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getOpportunityColor(gap.opportunity)}>
                          {gap.opportunity} priority
                        </Badge>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Outreach
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Analysis Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Content Analysis Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    Advanced content gap analysis features will be available in
                    the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Competitor Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Traffic Changes</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Amazon</span>
                          <span className="text-green-600">+2.3%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Best Buy</span>
                          <span className="text-red-600">-1.8%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Newegg</span>
                          <span className="text-green-600">+0.5%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">New Keywords</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <div className="font-medium">
                            wireless earbuds 2024
                          </div>
                          <div className="text-muted-foreground">
                            Amazon ranked #1
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">gaming headset sale</div>
                          <div className="text-muted-foreground">
                            Best Buy ranked #3
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Set Up Alerts
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
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

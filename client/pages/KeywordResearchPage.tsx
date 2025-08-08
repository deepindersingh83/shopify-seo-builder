import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  TrendingUp,
  BarChart3,
  Target,
  Globe,
  Zap,
  Eye,
  Star,
  Users,
  DollarSign,
  Download,
  Filter,
  Plus,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: "low" | "medium" | "high";
  trend: "up" | "down" | "stable";
  intent: "informational" | "commercial" | "transactional" | "navigational";
  relatedKeywords: string[];
  rankingUrl?: string;
  currentPosition?: number;
}

interface KeywordGroup {
  id: string;
  name: string;
  keywords: Keyword[];
  totalVolume: number;
  avgDifficulty: number;
  color: string;
}

const mockKeywords: Keyword[] = [
  {
    id: "1",
    keyword: "premium electronics",
    searchVolume: 12500,
    difficulty: 45,
    cpc: 2.35,
    competition: "medium",
    trend: "up",
    intent: "commercial",
    relatedKeywords: [
      "high-end electronics",
      "luxury gadgets",
      "premium devices",
    ],
    currentPosition: 15,
  },
  {
    id: "2",
    keyword: "wireless headphones",
    searchVolume: 89000,
    difficulty: 62,
    cpc: 3.2,
    competition: "high",
    trend: "stable",
    intent: "commercial",
    relatedKeywords: [
      "bluetooth headphones",
      "wireless earbuds",
      "noise cancelling headphones",
    ],
  },
  {
    id: "3",
    keyword: "smart home devices",
    searchVolume: 45000,
    difficulty: 55,
    cpc: 1.85,
    competition: "medium",
    trend: "up",
    intent: "informational",
    relatedKeywords: ["home automation", "IoT devices", "smart house"],
  },
  {
    id: "4",
    keyword: "gaming laptop",
    searchVolume: 67000,
    difficulty: 70,
    cpc: 4.5,
    competition: "high",
    trend: "up",
    intent: "commercial",
    relatedKeywords: [
      "gaming computer",
      "high performance laptop",
      "gaming notebook",
    ],
    currentPosition: 8,
  },
  {
    id: "5",
    keyword: "affordable smartphones",
    searchVolume: 35000,
    difficulty: 38,
    cpc: 2.1,
    competition: "medium",
    trend: "stable",
    intent: "commercial",
    relatedKeywords: [
      "budget phones",
      "cheap smartphones",
      "value smartphones",
    ],
  },
];

const mockKeywordGroups: KeywordGroup[] = [
  {
    id: "1",
    name: "Electronics",
    keywords: mockKeywords.slice(0, 3),
    totalVolume: 146500,
    avgDifficulty: 54,
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Gaming",
    keywords: [mockKeywords[3]],
    totalVolume: 67000,
    avgDifficulty: 70,
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "Mobile Devices",
    keywords: [mockKeywords[4]],
    totalVolume: 35000,
    avgDifficulty: 38,
    color: "bg-green-500",
  },
];

export default function KeywordResearchPage() {
  const [activeTab, setActiveTab] = useState("research");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set(),
  );
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords);
  const [keywordGroups, setKeywordGroups] =
    useState<KeywordGroup[]>(mockKeywordGroups);
  const [filters, setFilters] = useState({
    minVolume: "",
    maxDifficulty: "",
    competition: "all",
    intent: "all",
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add some mock results
    const newKeywords: Keyword[] = [
      {
        id: `new-${Date.now()}`,
        keyword: searchQuery.toLowerCase(),
        searchVolume: Math.floor(Math.random() * 50000) + 1000,
        difficulty: Math.floor(Math.random() * 100),
        cpc: Math.random() * 5 + 0.5,
        competition: ["low", "medium", "high"][
          Math.floor(Math.random() * 3)
        ] as any,
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as any,
        intent: [
          "informational",
          "commercial",
          "transactional",
          "navigational",
        ][Math.floor(Math.random() * 4)] as any,
        relatedKeywords: [
          `${searchQuery} related`,
          `best ${searchQuery}`,
          `${searchQuery} review`,
        ],
      },
    ];

    setKeywords((prev) => [...newKeywords, ...prev]);
    setIsSearching(false);
  };

  const toggleKeywordSelection = (keywordId: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keywordId)) {
      newSelected.delete(keywordId);
    } else {
      newSelected.add(keywordId);
    }
    setSelectedKeywords(newSelected);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return "text-green-600";
    if (difficulty < 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompetitionBadge = (competition: string) => {
    switch (competition) {
      case "low":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800",
        };
      case "medium":
        return {
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800",
        };
      case "high":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800",
        };
      default:
        return { variant: "outline" as const, className: "" };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default:
        return <BarChart3 className="h-3 w-3 text-gray-600" />;
    }
  };

  const filteredKeywords = keywords.filter((keyword) => {
    const matchesVolume =
      !filters.minVolume || keyword.searchVolume >= parseInt(filters.minVolume);
    const matchesDifficulty =
      !filters.maxDifficulty ||
      keyword.difficulty <= parseInt(filters.maxDifficulty);
    const matchesCompetition =
      filters.competition === "all" ||
      keyword.competition === filters.competition;
    const matchesIntent =
      filters.intent === "all" || keyword.intent === filters.intent;

    return (
      matchesVolume && matchesDifficulty && matchesCompetition && matchesIntent
    );
  });

  return (
    <Layout>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Keyword Research
              </h1>
              <p className="text-muted-foreground">
                Discover high-value keywords to boost your SEO performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-xs">
                Pro Feature
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Keywords
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Keywords
                </CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{keywords.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{keywords.length - 10} from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Search Volume
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    keywords.reduce((sum, k) => sum + k.searchVolume, 0) /
                      keywords.length,
                  ).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly searches
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Difficulty
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    keywords.reduce((sum, k) => sum + k.difficulty, 0) /
                      keywords.length,
                  )}
                  /100
                </div>
                <p className="text-xs text-muted-foreground">
                  Ranking difficulty
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tracked Keywords
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {keywords.filter((k) => k.currentPosition).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently ranking
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="research">Keyword Research</TabsTrigger>
              <TabsTrigger value="tracking">Rank Tracking</TabsTrigger>
              <TabsTrigger value="groups">Keyword Groups</TabsTrigger>
              <TabsTrigger value="analysis">Competitor Analysis</TabsTrigger>
            </TabsList>

            {/* Keyword Research Tab */}
            <TabsContent value="research" className="space-y-6">
              {/* Search Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Find New Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter seed keyword or phrase..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      {isSearching ? "Searching..." : "Research"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Min Search Volume
                      </label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={filters.minVolume}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            minVolume: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Max Difficulty
                      </label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={filters.maxDifficulty}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxDifficulty: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Competition</label>
                      <Select
                        value={filters.competition}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            competition: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Search Intent
                      </label>
                      <Select
                        value={filters.intent}
                        onValueChange={(value) =>
                          setFilters((prev) => ({ ...prev, intent: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Intents</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="informational">
                            Informational
                          </SelectItem>
                          <SelectItem value="transactional">
                            Transactional
                          </SelectItem>
                          <SelectItem value="navigational">
                            Navigational
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keywords List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Keywords ({filteredKeywords.length})</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedKeywords.size} selected
                      </Badge>
                      <Button size="sm" disabled={selectedKeywords.size === 0}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Campaign
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredKeywords.map((keyword) => (
                      <div
                        key={keyword.id}
                        className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${
                          selectedKeywords.has(keyword.id)
                            ? "bg-accent border-accent-foreground"
                            : ""
                        }`}
                        onClick={() => toggleKeywordSelection(keyword.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{keyword.keyword}</h3>
                            {getTrendIcon(keyword.trend)}
                            <Badge
                              variant={
                                getCompetitionBadge(keyword.competition).variant
                              }
                              className={
                                getCompetitionBadge(keyword.competition)
                                  .className
                              }
                            >
                              {keyword.competition}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {keyword.intent}
                            </Badge>
                          </div>
                          {keyword.relatedKeywords.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-muted-foreground">
                                Related:
                              </span>
                              {keyword.relatedKeywords
                                .slice(0, 3)
                                .map((related, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {related}
                                  </Badge>
                                ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-medium">
                              {keyword.searchVolume.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Volume
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`font-medium ${getDifficultyColor(keyword.difficulty)}`}
                            >
                              {keyword.difficulty}/100
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Difficulty
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">
                              ${keyword.cpc.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              CPC
                            </div>
                          </div>
                          {keyword.currentPosition && (
                            <div className="text-center">
                              <div className="font-medium text-blue-600">
                                #{keyword.currentPosition}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Position
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rank Tracking Tab */}
            <TabsContent value="tracking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Keyword Rank Tracking
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Monitor your keyword rankings across search engines
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {keywords
                      .filter((k) => k.currentPosition)
                      .map((keyword) => (
                        <div
                          key={keyword.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium">{keyword.keyword}</h3>
                            <p className="text-sm text-muted-foreground">
                              {keyword.rankingUrl}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                #{keyword.currentPosition}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Current Position
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-medium">
                                {keyword.searchVolume.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Monthly Volume
                              </div>
                            </div>
                            {getTrendIcon(keyword.trend)}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Keyword Groups Tab */}
            <TabsContent value="groups" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Keyword Groups
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Organize keywords into themed groups for better campaign
                    management
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keywordGroups.map((group) => (
                      <Card key={group.id} className="relative overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 w-1 h-full ${group.color}`}
                        ></div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            {group.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium">
                                {group.keywords.length}
                              </div>
                              <div className="text-muted-foreground">
                                Keywords
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">
                                {group.totalVolume.toLocaleString()}
                              </div>
                              <div className="text-muted-foreground">
                                Total Volume
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Avg Difficulty</span>
                              <span
                                className={getDifficultyColor(
                                  group.avgDifficulty,
                                )}
                              >
                                {group.avgDifficulty}/100
                              </span>
                            </div>
                            <Progress
                              value={group.avgDifficulty}
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Competitor Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Competitor Keyword Analysis
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Analyze competitor keywords and find gap opportunities
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Competitor Analysis Coming Soon
                    </h3>
                    <p className="text-muted-foreground">
                      Advanced competitor keyword analysis features will be
                      available in the next update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  BarChart3,
  Target,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  Link2,
} from "lucide-react";

export default function CompetitorAnalysisPage() {
  const comingSoonFeatures = [
    {
      title: "Competitor Keyword Gap Analysis",
      description: "Identify keywords your competitors rank for that you don't",
      icon: <Search className="h-5 w-5" />,
      priority: "High",
    },
    {
      title: "Backlink Profile Comparison",
      description: "Compare your backlink profile against top competitors",
      icon: <Link2 className="h-5 w-5" />,
      priority: "High",
    },
    {
      title: "Content Strategy Analysis",
      description:
        "Analyze competitor content performance and identify opportunities",
      icon: <BarChart3 className="h-5 w-5" />,
      priority: "Medium",
    },
    {
      title: "SERP Position Monitoring",
      description: "Track competitor positions for your target keywords",
      icon: <Target className="h-5 w-5" />,
      priority: "High",
    },
    {
      title: "Traffic Estimation",
      description: "Estimate competitor traffic and identify their top pages",
      icon: <TrendingUp className="h-5 w-5" />,
      priority: "Medium",
    },
    {
      title: "Technical SEO Comparison",
      description:
        "Compare technical SEO factors like site speed and structure",
      icon: <Shield className="h-5 w-5" />,
      priority: "Low",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
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

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-purple-600 mb-6">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Competitor Analysis</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Analyze your competitors' SEO strategies, keywords, and
                performance to gain competitive advantages.
              </p>
              <Badge variant="secondary" className="text-sm">
                🚀 This feature is coming soon! In the meantime, check out our
                other SEO tools.
              </Badge>
            </CardContent>
          </Card>

          {/* Coming Soon Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Competitive Intelligence Features
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Advanced competitor analysis tools we're building for you
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comingSoonFeatures.map((feature, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-purple-600">{feature.icon}</div>
                          <h3 className="font-semibold">{feature.title}</h3>
                        </div>
                        <Badge
                          variant={getPriorityColor(feature.priority)}
                          className="text-xs"
                        >
                          {feature.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitor Dashboard Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Competitor Dashboard Preview
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Sneak peek at your future competitive intelligence dashboard
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock competitor data */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">competitor-site.com</h4>
                    <Badge variant="outline">Primary Competitor</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        1,247
                      </div>
                      <div className="text-muted-foreground">
                        Shared Keywords
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        89%
                      </div>
                      <div className="text-muted-foreground">Overlap Score</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        45K
                      </div>
                      <div className="text-muted-foreground">Est. Traffic</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">another-competitor.com</h4>
                    <Badge variant="secondary">Secondary Competitor</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-lg font-bold text-blue-600">892</div>
                      <div className="text-muted-foreground">
                        Shared Keywords
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        67%
                      </div>
                      <div className="text-muted-foreground">Overlap Score</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        32K
                      </div>
                      <div className="text-muted-foreground">Est. Traffic</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Features */}
          <Card>
            <CardHeader>
              <CardTitle>Available Now - Related Features</CardTitle>
              <p className="text-sm text-muted-foreground">
                Start your competitive research with these existing tools
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/market-opportunities">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Market Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Discover market opportunities and gaps
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/seo/keywords">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Keyword Research</h4>
                      <p className="text-sm text-muted-foreground">
                        Research competitor keywords
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/seo/content">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Content Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        Optimize your content strategy
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/analytics/reports">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">SEO Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Track your SEO performance
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Eye,
  Zap
} from "lucide-react";

export default function SEOOverviewPage() {
  return (
    <Layout>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">SEO Overview</h1>
              <p className="text-muted-foreground">Monitor your SEO performance and identify opportunities</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Run SEO Audit
              </Button>
            </div>
          </div>

          {/* Overall SEO Score */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Overall SEO Score</h2>
                  <p className="text-muted-foreground">Based on 152,847 products analyzed</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-2">85</div>
                  <div className="text-xl text-muted-foreground">/ 100</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
                </div>
              </div>
              <div className="mt-6">
                <Progress value={85} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Search Visibility</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  +5.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,237</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  +12.8% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Keywords Ranking</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  +89 new this month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
                  -7 resolved this week
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/seo/keywords">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Search className="h-6 w-6 mb-2" />
                      Keyword Research
                    </Button>
                  </Link>
                  <Link to="/seo/competitors">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Competitor Analysis
                    </Button>
                  </Link>
                  <Link to="/workflows">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Zap className="h-6 w-6 mb-2" />
                      Auto-Optimize
                    </Button>
                  </Link>
                  <Link to="/seo/content">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Target className="h-6 w-6 mb-2" />
                      Content Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent SEO Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'warning', message: '45 products missing meta descriptions', count: 45 },
                    { type: 'error', message: '12 products with duplicate titles', count: 12 },
                    { type: 'info', message: '156 products with long titles', count: 156 },
                    { type: 'success', message: '890 products fully optimized', count: 890 },
                  ].map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        {issue.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {issue.type === 'warning' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {issue.type === 'info' && <Eye className="h-4 w-4 text-blue-500" />}
                        {issue.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        <span className="text-sm">{issue.message}</span>
                      </div>
                      <Badge variant="outline">{issue.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Tools */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Tools & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Multi-Language SEO</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Optimize for international markets with automatic translation and localization.
                  </p>
                  <Link to="/multi-language-seo">
                    <Button variant="outline" size="sm">Explore</Button>
                  </Link>
                </div>
                
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Market Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Discover new opportunities and analyze market trends for better SEO strategy.
                  </p>
                  <Link to="/market-opportunities">
                    <Button variant="outline" size="sm">Explore</Button>
                  </Link>
                </div>
                
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Workflow Automation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automate your SEO tasks with intelligent workflows and AI-powered optimization.
                  </p>
                  <Link to="/workflows">
                    <Button variant="outline" size="sm">Explore</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

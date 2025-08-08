import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Target, 
  Calendar,
  Users,
  Zap,
  Eye,
  CheckCircle2
} from "lucide-react";

export default function AnalyticsROIPage() {
  const comingSoonFeatures = [
    {
      title: "Revenue Attribution",
      description: "Track revenue directly attributed to SEO efforts and specific keywords",
      icon: <DollarSign className="h-5 w-5" />,
      priority: "High"
    },
    {
      title: "Cost Per Acquisition",
      description: "Calculate and monitor CPA for organic traffic vs paid campaigns",
      icon: <Target className="h-5 w-5" />,
      priority: "High"
    },
    {
      title: "Conversion Tracking",
      description: "Advanced conversion tracking with goal-based ROI calculations",
      icon: <CheckCircle2 className="h-5 w-5" />,
      priority: "Medium"
    },
    {
      title: "Competitive ROI Analysis",
      description: "Compare your ROI performance against industry benchmarks",
      icon: <Users className="h-5 w-5" />,
      priority: "Medium"
    },
    {
      title: "ROI Forecasting",
      description: "Predict future ROI based on current trends and historical data",
      icon: <BarChart3 className="h-5 w-5" />,
      priority: "Low"
    },
    {
      title: "Automated ROI Reports",
      description: "Scheduled reports with ROI insights sent to stakeholders",
      icon: <Calendar className="h-5 w-5" />,
      priority: "Low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
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
              <div className="text-green-600 mb-6">
                <TrendingUp className="h-16 w-16 mx-auto" />
              </div>
              <h1 className="text-4xl font-bold mb-4">ROI Tracking</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Track and analyze the return on investment for your SEO efforts and marketing campaigns.
              </p>
              <Badge variant="secondary" className="text-sm">
                🚀 Feature Coming Soon
              </Badge>
            </CardContent>
          </Card>

          {/* Coming Soon Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Upcoming Features
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Here's what we're building to help you track and optimize your ROI
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comingSoonFeatures.map((feature, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-blue-600">{feature.icon}</div>
                          <h3 className="font-semibold">{feature.title}</h3>
                        </div>
                        <Badge variant={getPriorityColor(feature.priority)} className="text-xs">
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

          {/* Current ROI Metrics Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                ROI Dashboard Preview
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Here's a preview of what your ROI dashboard will look like
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-green-600">324%</div>
                  <div className="text-sm text-muted-foreground">Overall SEO ROI</div>
                  <div className="text-xs text-green-600 mt-1">+12% vs last month</div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-blue-600">$45,230</div>
                  <div className="text-sm text-muted-foreground">Revenue from Organic</div>
                  <div className="text-xs text-blue-600 mt-1">+8% vs last month</div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-orange-600">$140</div>
                  <div className="text-sm text-muted-foreground">Cost per Conversion</div>
                  <div className="text-xs text-green-600 mt-1">-5% vs last month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Features */}
          <Card>
            <CardHeader>
              <CardTitle>Available Now - Related Features</CardTitle>
              <p className="text-sm text-muted-foreground">
                While ROI tracking is in development, explore these current analytics features
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/analytics/reports">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">SEO Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        View comprehensive SEO reports
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/analytics/rankings">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Keyword Rankings</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor keyword position changes
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/analytics/traffic">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Traffic Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze website traffic patterns
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

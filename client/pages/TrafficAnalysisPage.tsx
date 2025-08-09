import PlaceholderPage from "./PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function TrafficAnalysisPage() {
  return (
    <PlaceholderPage
      title="Traffic Analysis"
      description="Analyze website traffic patterns, user behavior, and conversion metrics to optimize your SEO strategy."
      icon={<BarChart3 className="h-12 w-12 text-purple-600" />}
      relatedPages={[
        {
          title: "SEO Reports",
          href: "/analytics/reports",
          description: "View comprehensive SEO reports",
        },
        {
          title: "Keyword Rankings",
          href: "/analytics/rankings",
          description: "Monitor keyword position changes",
        },
        {
          title: "ROI Tracking",
          href: "/analytics/roi",
          description: "Track return on investment",
        },
      ]}
    />
  );
}

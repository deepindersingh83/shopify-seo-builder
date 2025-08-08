import PlaceholderPage from "./PlaceholderPage";
import { TrendingUp } from "lucide-react";

export default function AnalyticsROIPage() {
  return (
    <PlaceholderPage
      title="ROI Tracking"
      description="Track and analyze the return on investment for your SEO efforts and marketing campaigns."
      icon={<TrendingUp className="h-12 w-12 text-green-600" />}
      relatedPages={[
        {
          title: "SEO Reports",
          href: "/analytics/reports",
          description: "View comprehensive SEO reports"
        },
        {
          title: "Keyword Rankings",
          href: "/analytics/rankings",
          description: "Monitor keyword position changes"
        },
        {
          title: "Traffic Analysis",
          href: "/analytics/traffic",
          description: "Analyze website traffic patterns"
        }
      ]}
    />
  );
}

import PlaceholderPage from "./PlaceholderPage";
import { TrendingUp } from "lucide-react";

export default function KeywordRankingsPage() {
  return (
    <PlaceholderPage
      title="Keyword Rankings"
      description="Monitor your keyword position changes and track SEO performance over time."
      icon={<TrendingUp className="h-12 w-12 text-blue-600" />}
      relatedPages={[
        {
          title: "SEO Reports",
          href: "/analytics/reports",
          description: "View comprehensive SEO reports",
        },
        {
          title: "Traffic Analysis",
          href: "/analytics/traffic",
          description: "Analyze website traffic patterns",
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

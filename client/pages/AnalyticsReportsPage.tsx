import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function AnalyticsReportsPage() {
  return (
    <PlaceholderPage
      title="SEO Reports"
      description="Generate comprehensive SEO reports and analytics to track your website's performance and optimization progress."
      icon={<FileText className="h-12 w-12 text-blue-600" />}
      relatedPages={[
        {
          title: "Keyword Rankings",
          href: "/analytics/rankings",
          description: "Monitor keyword position changes"
        },
        {
          title: "Traffic Analysis",
          href: "/analytics/traffic",
          description: "Analyze website traffic patterns"
        },
        {
          title: "ROI Tracking",
          href: "/analytics/roi",
          description: "Track return on investment"
        }
      ]}
    />
  );
}

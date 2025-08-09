import PlaceholderPage from "./PlaceholderPage";
import { RefreshCw } from "lucide-react";

export default function ScheduledAuditsPage() {
  return (
    <PlaceholderPage
      title="Scheduled Audits"
      description="Set up automated SEO audits to regularly monitor and report on your site's optimization status."
      icon={<RefreshCw className="h-12 w-12 text-blue-600" />}
      relatedPages={[
        {
          title: "SEO Reports",
          href: "/analytics/reports",
          description: "View comprehensive SEO reports",
        },
        {
          title: "Performance Reports",
          href: "/performance/reports",
          description: "Monitor site performance",
        },
        {
          title: "SEO Rules",
          href: "/automation/rules",
          description: "Manage SEO automation rules",
        },
      ]}
    />
  );
}

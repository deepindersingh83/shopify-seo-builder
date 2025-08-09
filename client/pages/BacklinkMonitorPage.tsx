import PlaceholderPage from "./PlaceholderPage";
import { TrendingUp } from "lucide-react";

export default function BacklinkMonitorPage() {
  return (
    <PlaceholderPage
      title="Backlink Monitor"
      description="Track and analyze your backlink profile to improve domain authority and search rankings."
      icon={<TrendingUp className="h-12 w-12 text-green-600" />}
      relatedPages={[
        {
          title: "Internal Links",
          href: "/links/internal",
          description: "Manage internal linking structure"
        },
        {
          title: "Broken Links",
          href: "/links/broken",
          description: "Find and fix broken links"
        },
        {
          title: "Redirect Manager",
          href: "/links/redirects",
          description: "Manage URL redirects"
        }
      ]}
    />
  );
}

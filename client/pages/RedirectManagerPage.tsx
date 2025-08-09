import PlaceholderPage from "./PlaceholderPage";
import { RefreshCw } from "lucide-react";

export default function RedirectManagerPage() {
  return (
    <PlaceholderPage
      title="Redirect Manager"
      description="Manage URL redirects to maintain SEO value when changing URLs and prevent 404 errors."
      icon={<RefreshCw className="h-12 w-12 text-orange-600" />}
      relatedPages={[
        {
          title: "Internal Links",
          href: "/links/internal",
          description: "Manage internal linking structure",
        },
        {
          title: "Broken Links",
          href: "/links/broken",
          description: "Find and fix broken links",
        },
        {
          title: "Backlink Monitor",
          href: "/links/backlinks",
          description: "Track your backlink profile",
        },
      ]}
    />
  );
}

import PlaceholderPage from "./PlaceholderPage";
import { X } from "lucide-react";

export default function BrokenLinksPage() {
  return (
    <PlaceholderPage
      title="Broken Links"
      description="Find and fix broken links on your website to improve user experience and SEO."
      icon={<X className="h-12 w-12 text-red-600" />}
      relatedPages={[
        {
          title: "Internal Links",
          href: "/links/internal",
          description: "Manage internal linking structure"
        },
        {
          title: "Backlink Monitor",
          href: "/links/backlinks",
          description: "Track your backlink profile"
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

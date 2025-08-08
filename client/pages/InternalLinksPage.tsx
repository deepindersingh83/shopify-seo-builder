import PlaceholderPage from "./PlaceholderPage";
import { Link2 } from "lucide-react";

export default function InternalLinksPage() {
  return (
    <PlaceholderPage
      title="Internal Links"
      description="Manage and optimize your internal linking structure to improve SEO and user navigation."
      icon={<Link2 className="h-12 w-12 text-blue-600" />}
      relatedPages={[
        {
          title: "Backlink Monitor",
          href: "/links/backlinks",
          description: "Track your backlink profile"
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

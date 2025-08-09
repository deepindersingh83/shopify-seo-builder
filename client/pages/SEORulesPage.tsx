import PlaceholderPage from "./PlaceholderPage";
import { Settings } from "lucide-react";

export default function SEORulesPage() {
  return (
    <PlaceholderPage
      title="SEO Rules"
      description="Create and manage automated SEO rules to maintain consistent optimization across your products and content."
      icon={<Settings className="h-12 w-12 text-gray-600" />}
      relatedPages={[
        {
          title: "Workflows",
          href: "/workflows",
          description: "Create automated SEO workflows",
        },
        {
          title: "Bulk Operations",
          href: "/automation/bulk",
          description: "Perform bulk SEO operations",
        },
        {
          title: "Templates",
          href: "/automation/templates",
          description: "Manage SEO templates",
        },
      ]}
    />
  );
}

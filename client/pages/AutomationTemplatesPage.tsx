import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function AutomationTemplatesPage() {
  return (
    <PlaceholderPage
      title="Templates"
      description="Create and manage SEO templates for automated content generation and optimization across your store."
      icon={<FileText className="h-12 w-12 text-green-600" />}
      relatedPages={[
        {
          title: "SEO Rules",
          href: "/automation/rules",
          description: "Manage automated SEO rules",
        },
        {
          title: "Bulk Operations",
          href: "/automation/bulk",
          description: "Perform bulk SEO operations",
        },
        {
          title: "Social Media Auto-post",
          href: "/social-media-autopost",
          description: "Social media content templates",
        },
      ]}
    />
  );
}

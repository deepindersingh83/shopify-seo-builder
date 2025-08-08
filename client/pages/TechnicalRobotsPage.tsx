import PlaceholderPage from "./PlaceholderPage";
import { Settings } from "lucide-react";

export default function TechnicalRobotsPage() {
  return (
    <PlaceholderPage
      title="Robots.txt"
      description="Configure your robots.txt file to control how search engines crawl your website."
      icon={<Settings className="h-12 w-12 text-gray-600" />}
      relatedPages={[
        {
          title: "XML Sitemaps",
          href: "/technical/sitemaps",
          description: "Generate and manage XML sitemaps",
        },
        {
          title: "Schema Markup",
          href: "/technical/schema",
          description: "Add structured data markup",
        },
        {
          title: "Crawl Analysis",
          href: "/technical/crawl",
          description: "Analyze website crawlability",
        },
      ]}
    />
  );
}

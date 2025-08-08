import PlaceholderPage from "./PlaceholderPage";
import { Bot } from "lucide-react";

export default function TechnicalCrawlPage() {
  return (
    <PlaceholderPage
      title="Crawl Analysis"
      description="Analyze how search engines crawl your website and identify potential indexing issues."
      icon={<Bot className="h-12 w-12 text-green-600" />}
      relatedPages={[
        {
          title: "XML Sitemaps",
          href: "/technical/sitemaps",
          description: "Generate and manage XML sitemaps"
        },
        {
          title: "Robots.txt",
          href: "/technical/robots",
          description: "Manage robots.txt file"
        },
        {
          title: "Schema Markup",
          href: "/technical/schema",
          description: "Add structured data markup"
        }
      ]}
    />
  );
}

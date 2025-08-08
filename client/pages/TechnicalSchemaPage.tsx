import PlaceholderPage from "./PlaceholderPage";
import { Code } from "lucide-react";

export default function TechnicalSchemaPage() {
  return (
    <PlaceholderPage
      title="Schema Markup"
      description="Add structured data markup to help search engines understand your content better."
      icon={<Code className="h-12 w-12 text-blue-600" />}
      relatedPages={[
        {
          title: "XML Sitemaps",
          href: "/technical/sitemaps",
          description: "Generate and manage XML sitemaps",
        },
        {
          title: "Robots.txt",
          href: "/technical/robots",
          description: "Manage robots.txt file",
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

import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function TechnicalSitemapsPage() {
  return (
    <PlaceholderPage
      title="XML Sitemaps"
      description="Generate and manage XML sitemaps to help search engines discover and index your content."
      icon={<FileText className="h-12 w-12 text-orange-600" />}
      relatedPages={[
        {
          title: "Robots.txt",
          href: "/technical/robots",
          description: "Manage robots.txt file",
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

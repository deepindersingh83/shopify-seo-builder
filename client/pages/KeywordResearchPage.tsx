import PlaceholderPage from "./PlaceholderPage";
import { Search } from "lucide-react";

export default function KeywordResearchPage() {
  return (
    <PlaceholderPage
      title="Keyword Research"
      description="Discover high-value keywords for your products and optimize your SEO strategy with advanced keyword analysis tools."
      icon={<Search className="h-12 w-12 text-blue-600" />}
      relatedPages={[
        {
          title: "SEO Overview",
          href: "/seo/overview",
          description: "Monitor your overall SEO performance"
        },
        {
          title: "Market Analysis",
          href: "/market-opportunities",
          description: "Discover market opportunities and trends"
        },
        {
          title: "Multi-Language SEO",
          href: "/multi-language-seo",
          description: "Optimize keywords for global markets"
        },
        {
          title: "Workflow Automation",
          href: "/workflows",
          description: "Automate keyword optimization tasks"
        }
      ]}
    />
  );
}

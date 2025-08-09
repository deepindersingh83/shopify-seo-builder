import PlaceholderPage from "./PlaceholderPage";
import { Globe } from "lucide-react";

export default function HreflangManagerPage() {
  return (
    <PlaceholderPage
      title="Hreflang Manager"
      description="Manage hreflang tags for international SEO to help search engines understand your site's language and regional targeting."
      icon={<Globe className="h-12 w-12 text-blue-600" />}
      relatedPages={[
        {
          title: "Multi-Language SEO",
          href: "/multi-language-seo",
          description: "Optimize content for multiple languages",
        },
        {
          title: "Local SEO",
          href: "/international/local",
          description: "Optimize for local search results",
        },
        {
          title: "Market Analysis",
          href: "/market-opportunities",
          description: "Analyze international market opportunities",
        },
      ]}
    />
  );
}

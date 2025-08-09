import PlaceholderPage from "./PlaceholderPage";
import { MapPin } from "lucide-react";

export default function LocalSEOPage() {
  return (
    <PlaceholderPage
      title="Local SEO"
      description="Optimize your business for local search results and improve visibility in your target geographic areas."
      icon={<MapPin className="h-12 w-12 text-red-600" />}
      relatedPages={[
        {
          title: "Multi-Language SEO",
          href: "/multi-language-seo",
          description: "Optimize content for multiple languages",
        },
        {
          title: "Hreflang Manager",
          href: "/international/hreflang",
          description: "Manage international hreflang tags",
        },
        {
          title: "Market Analysis",
          href: "/market-opportunities",
          description: "Analyze market opportunities",
        },
      ]}
    />
  );
}

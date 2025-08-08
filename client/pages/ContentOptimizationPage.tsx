import PlaceholderPage from "./PlaceholderPage";
import { Target } from "lucide-react";

export default function ContentOptimizationPage() {
  return (
    <PlaceholderPage
      title="Content Optimization"
      description="Optimize your product content for search engines with AI-powered suggestions and best practices."
      icon={<Target className="h-12 w-12 text-red-600" />}
      relatedPages={[
        {
          title: "SEO Overview",
          href: "/seo/overview",
          description: "Monitor your content SEO performance"
        },
        {
          title: "Multi-Language SEO",
          href: "/multi-language-seo",
          description: "Optimize content for global markets"
        }
      ]}
    />
  );
}

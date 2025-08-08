import PlaceholderPage from "./PlaceholderPage";
import { Users } from "lucide-react";

export default function CompetitorAnalysisPage() {
  return (
    <PlaceholderPage
      title="Competitor Analysis"
      description="Analyze your competitors' SEO strategies, keywords, and performance to gain competitive advantages."
      icon={<Users className="h-12 w-12 text-purple-600" />}
      relatedPages={[
        {
          title: "Market Analysis",
          href: "/market-opportunities",
          description: "Discover market opportunities and gaps",
        },
        {
          title: "Keyword Research",
          href: "/seo/keywords",
          description: "Research competitor keywords",
        },
      ]}
    />
  );
}

import PlaceholderPage from "./PlaceholderPage";
import { Eye } from "lucide-react";

export default function SERPPreviewPage() {
  return (
    <PlaceholderPage
      title="SERP Preview"
      description="Preview how your products will appear in search engine results and optimize for better click-through rates."
      icon={<Eye className="h-12 w-12 text-green-600" />}
      relatedPages={[
        {
          title: "SEO Overview",
          href: "/seo/overview",
          description: "Monitor your overall SEO performance",
        },
        {
          title: "Keyword Research",
          href: "/seo/keywords",
          description: "Discover high-value keywords",
        },
      ]}
    />
  );
}

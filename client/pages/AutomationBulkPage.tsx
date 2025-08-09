import PlaceholderPage from "./PlaceholderPage";
import { Edit } from "lucide-react";

export default function AutomationBulkPage() {
  return (
    <PlaceholderPage
      title="Bulk Operations"
      description="Perform automated bulk SEO operations across multiple products, collections, and pages efficiently."
      icon={<Edit className="h-12 w-12 text-orange-600" />}
      relatedPages={[
        {
          title: "Bulk Edit",
          href: "/bulk-edit",
          description: "Manual bulk product editing",
        },
        {
          title: "SEO Rules",
          href: "/automation/rules",
          description: "Automated SEO rule management",
        },
        {
          title: "Templates",
          href: "/automation/templates",
          description: "SEO template management",
        },
      ]}
    />
  );
}

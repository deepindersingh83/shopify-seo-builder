import PlaceholderPage from "./PlaceholderPage";
import { Globe } from "lucide-react";

export default function MobileOptimizationPage() {
  return (
    <PlaceholderPage
      title="Mobile Optimization"
      description="Optimize your site for mobile devices to improve user experience and mobile search rankings."
      icon={<Globe className="h-12 w-12 text-green-600" />}
      relatedPages={[
        {
          title: "Core Web Vitals",
          href: "/performance/vitals",
          description: "Monitor Core Web Vitals metrics",
        },
        {
          title: "Page Speed",
          href: "/performance/speed",
          description: "Analyze page loading performance",
        },
        {
          title: "Performance Reports",
          href: "/performance/reports",
          description: "View detailed performance analytics",
        },
      ]}
    />
  );
}

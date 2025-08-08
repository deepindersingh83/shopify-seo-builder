import PlaceholderPage from "./PlaceholderPage";
import { Monitor } from "lucide-react";

export default function PerformanceSpeedPage() {
  return (
    <PlaceholderPage
      title="Page Speed"
      description="Analyze and optimize your page loading performance for better user experience and search rankings."
      icon={<Monitor className="h-12 w-12 text-green-600" />}
      relatedPages={[
        {
          title: "Core Web Vitals",
          href: "/performance/vitals",
          description: "Monitor Core Web Vitals metrics"
        },
        {
          title: "Mobile Optimization",
          href: "/performance/mobile",
          description: "Optimize for mobile devices"
        },
        {
          title: "Performance Reports",
          href: "/performance/reports",
          description: "View detailed performance analytics"
        }
      ]}
    />
  );
}

import PlaceholderPage from "./PlaceholderPage";
import { Zap } from "lucide-react";

export default function PerformanceVitalsPage() {
  return (
    <PlaceholderPage
      title="Core Web Vitals"
      description="Monitor and optimize your Core Web Vitals for better search rankings and user experience."
      icon={<Zap className="h-12 w-12 text-yellow-600" />}
      relatedPages={[
        {
          title: "Page Speed",
          href: "/performance/speed",
          description: "Analyze page loading performance",
        },
        {
          title: "Mobile Optimization",
          href: "/performance/mobile",
          description: "Optimize for mobile devices",
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

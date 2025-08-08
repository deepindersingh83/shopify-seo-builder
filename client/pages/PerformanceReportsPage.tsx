import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function PerformanceReportsPage() {
  return (
    <PlaceholderPage
      title="Performance Reports"
      description="View comprehensive performance analytics and reports for your website optimization."
      icon={<FileText className="h-12 w-12 text-purple-600" />}
      relatedPages={[
        {
          title: "Core Web Vitals",
          href: "/performance/vitals",
          description: "Monitor Core Web Vitals metrics"
        },
        {
          title: "Page Speed",
          href: "/performance/speed",
          description: "Analyze page loading performance"
        },
        {
          title: "Mobile Optimization",
          href: "/performance/mobile",
          description: "Optimize for mobile devices"
        }
      ]}
    />
  );
}

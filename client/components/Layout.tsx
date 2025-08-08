import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Target,
  BarChart3,
  Search,
  Users,
  Zap,
  Globe,
  Settings,
  TrendingUp,
  Eye,
  Link2,
  Bot,
  FileText,
  Monitor,
  MapPin,
  RefreshCw,
  Code,
  Menu,
  X,
  Home,
  Edit,
  Plus,
  Download,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Products",
    icon: Package,
    children: [
      { title: "All Products", href: "/", icon: Package },
      { title: "Add Product", href: "/product/new", icon: Plus },
      { title: "Bulk Edit", href: "/bulk-edit", icon: Edit },
      { title: "Import/Export", href: "/import-export", icon: Download },
    ],
  },
  {
    title: "SEO Tools",
    icon: Target,
    children: [
      { title: "SEO Overview", href: "/seo/overview", icon: BarChart3 },
      { title: "Data Sources", href: "/data-sources", icon: RefreshCw },
      { title: "Market Analysis", href: "/market-opportunities", icon: TrendingUp },
      {
        title: "Keyword Research",
        href: "/seo/keywords",
        icon: Search,
        badge: "Pro",
      },
      { title: "SERP Preview", href: "/seo/serp-preview", icon: Eye },
      {
        title: "Competitor Analysis",
        href: "/seo/competitors",
        icon: Users,
        badge: "Pro",
      },
      { title: "Content Optimization", href: "/seo/content", icon: Bot },
    ],
  },
  {
    title: "Performance",
    icon: TrendingUp,
    children: [
      { title: "Core Web Vitals", href: "/performance/vitals", icon: Zap },
      { title: "Page Speed", href: "/performance/speed", icon: Monitor },
      {
        title: "Mobile Optimization",
        href: "/performance/mobile",
        icon: Globe,
      },
      {
        title: "Performance Reports",
        href: "/performance/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "Link Management",
    icon: Link2,
    children: [
      { title: "Internal Links", href: "/links/internal", icon: Link2 },
      {
        title: "Backlink Monitor",
        href: "/links/backlinks",
        icon: TrendingUp,
        badge: "Pro",
      },
      { title: "Broken Links", href: "/links/broken", icon: X },
      { title: "Redirect Manager", href: "/links/redirects", icon: RefreshCw },
    ],
  },
  {
    title: "International SEO",
    icon: Globe,
    children: [
      {
        title: "Multi-Language SEO",
        href: "/multi-language-seo",
        icon: Globe,
      },
      { title: "Local SEO", href: "/international/local", icon: MapPin },
      {
        title: "Hreflang Manager",
        href: "/international/hreflang",
        icon: Globe,
      },
    ],
  },
  {
    title: "Technical SEO",
    icon: Code,
    children: [
      { title: "XML Sitemaps", href: "/technical/sitemaps", icon: FileText },
      { title: "Robots.txt", href: "/technical/robots", icon: Settings },
      { title: "Schema Markup", href: "/technical/schema", icon: Code },
      { title: "Crawl Analysis", href: "/technical/crawl", icon: Bot },
    ],
  },
  {
    title: "Automation",
    icon: RefreshCw,
    children: [
      { title: "Workflows", href: "/workflows", icon: Zap },
      { title: "Multi-Channel Listings", href: "/multi-channel-listings", icon: Package },
      { title: "SEO Rules", href: "/automation/rules", icon: Settings },
      {
        title: "Scheduled Audits",
        href: "/automation/audits",
        icon: RefreshCw,
      },
      { title: "Bulk Operations", href: "/automation/bulk", icon: Edit },
      { title: "Templates", href: "/automation/templates", icon: FileText },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      { title: "SEO Reports", href: "/analytics/reports", icon: FileText },
      {
        title: "Keyword Rankings",
        href: "/analytics/rankings",
        icon: TrendingUp,
      },
      {
        title: "Traffic Analysis",
        href: "/analytics/traffic",
        icon: BarChart3,
      },
      {
        title: "ROI Tracking",
        href: "/analytics/roi",
        icon: TrendingUp,
        badge: "Pro",
      },
    ],
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: RefreshCw,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Products",
    "SEO Tools",
  ]);
  const location = useLocation();

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupTitle)
        ? prev.filter((g) => g !== groupTitle)
        : [...prev, groupTitle],
    );
  };

  const isActiveLink = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "border-r bg-card transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-16",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "flex items-center space-x-3",
                !isSidebarOpen && "justify-center",
              )}
            >
              <Package className="h-8 w-8 text-primary" />
              {isSidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold">SEO Manager</h1>
                  <p className="text-xs text-muted-foreground">
                    Professional Suite
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              if (item.children) {
                const isOpen = openGroups.includes(item.title);
                return (
                  <Collapsible
                    key={item.title}
                    open={isOpen}
                    onOpenChange={() => toggleGroup(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal h-9",
                          !isSidebarOpen && "justify-center px-2",
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="h-4 w-4" />
                          {isSidebarOpen && <span>{item.title}</span>}
                        </div>
                        {isSidebarOpen &&
                          (isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          ))}
                      </Button>
                    </CollapsibleTrigger>
                    {isSidebarOpen && (
                      <CollapsibleContent className="space-y-1 ml-6 mt-1">
                        {item.children.map((child) => (
                          <Link key={child.href} to={child.href!}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-left font-normal h-8",
                                isActiveLink(child.href!) &&
                                  "bg-accent text-accent-foreground",
                              )}
                            >
                              <child.icon className="h-3 w-3 mr-2" />
                              <span className="text-sm">{child.title}</span>
                              {child.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-auto text-xs"
                                >
                                  {child.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                );
              } else {
                return (
                  <Link key={item.href} to={item.href!}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !isSidebarOpen && "justify-center px-2",
                        isActiveLink(item.href!) &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {isSidebarOpen && (
                        <span className="ml-2">{item.title}</span>
                      )}
                      {item.badge && isSidebarOpen && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              }
            })}
          </nav>
        </div>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>SEO Score:</span>
                <span className="text-green-600 font-medium">85/100</span>
              </div>
              <div className="flex justify-between">
                <span>Products:</span>
                <span className="font-medium">152,847</span>
              </div>
              <div className="flex justify-between">
                <span>Keywords:</span>
                <span className="font-medium">1,247</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

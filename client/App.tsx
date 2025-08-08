import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EditProduct from "./pages/EditProduct";
import WorkflowAutomation from "./pages/WorkflowAutomation";
import DataSourcesPage from "./pages/DataSourcesPage";
import MultiLanguageSEOPage from "./pages/MultiLanguageSEOPage";
import MarketOpportunityPage from "./pages/MarketOpportunityPage";
import MultiChannelListingsPage from "./pages/MultiChannelListingsPage";
import WorkflowBuilderPage from "./pages/WorkflowBuilderPage";
import SettingsPage from "./pages/SettingsPage";
import SEOOverviewPage from "./pages/SEOOverviewPage";
import KeywordResearchPage from "./pages/KeywordResearchPage";
import SERPPreviewPage from "./pages/SERPPreviewPage";
import CompetitorAnalysisPage from "./pages/CompetitorAnalysisPage";
import ContentOptimizationPage from "./pages/ContentOptimizationPage";
import ThirdPartyIntegrationsPage from "./pages/ThirdPartyIntegrationsPage";
import BulkEditPage from "./pages/BulkEditPage";
import PerformanceVitalsPage from "./pages/PerformanceVitalsPage";
import InternalLinksPage from "./pages/InternalLinksPage";
import PerformanceSpeedPage from "./pages/PerformanceSpeedPage";
import PerformanceReportsPage from "./pages/PerformanceReportsPage";
import BrokenLinksPage from "./pages/BrokenLinksPage";
import TechnicalSitemapsPage from "./pages/TechnicalSitemapsPage";
import TechnicalRobotsPage from "./pages/TechnicalRobotsPage";
import TechnicalSchemaPage from "./pages/TechnicalSchemaPage";
import TechnicalCrawlPage from "./pages/TechnicalCrawlPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id/edit" element={<EditProduct />} />
          <Route path="/workflows" element={<WorkflowAutomation />} />
          <Route path="/workflow-builder" element={<WorkflowBuilderPage />} />
          <Route path="/data-sources" element={<DataSourcesPage />} />
          <Route
            path="/multi-language-seo"
            element={<MultiLanguageSEOPage />}
          />
          <Route
            path="/market-opportunities"
            element={<MarketOpportunityPage />}
          />
          <Route
            path="/multi-channel-listings"
            element={<MultiChannelListingsPage />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/seo/overview" element={<SEOOverviewPage />} />
          <Route path="/seo/keywords" element={<KeywordResearchPage />} />
          <Route path="/seo/serp-preview" element={<SERPPreviewPage />} />
          <Route path="/seo/competitors" element={<CompetitorAnalysisPage />} />
          <Route path="/seo/content" element={<ContentOptimizationPage />} />
          <Route
            path="/integrations"
            element={<ThirdPartyIntegrationsPage />}
          />
          <Route path="/bulk-edit" element={<BulkEditPage />} />
          <Route
            path="/performance/vitals"
            element={<PerformanceVitalsPage />}
          />
          <Route path="/product/new" element={<EditProduct />} />
          <Route
            path="/import-export"
            element={<ThirdPartyIntegrationsPage />}
          />
          <Route path="/links/internal" element={<InternalLinksPage />} />
          <Route path="/performance/speed" element={<PerformanceSpeedPage />} />
          <Route path="/performance/reports" element={<PerformanceReportsPage />} />
          <Route path="/links/broken" element={<BrokenLinksPage />} />
          <Route path="/technical/sitemaps" element={<TechnicalSitemapsPage />} />
          <Route path="/technical/robots" element={<TechnicalRobotsPage />} />
          <Route path="/technical/schema" element={<TechnicalSchemaPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Prevent duplicate root creation during development hot reloading
const rootElement = document.getElementById("root")!;
let root = (rootElement as any)._reactRootContainer;

if (!root) {
  root = createRoot(rootElement);
  (rootElement as any)._reactRootContainer = root;
}

root.render(<App />);

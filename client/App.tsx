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
          <Route path="/multi-language-seo" element={<MultiLanguageSEOPage />} />
          <Route path="/market-opportunities" element={<MarketOpportunityPage />} />
          <Route path="/multi-channel-listings" element={<MultiChannelListingsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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

import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as workflowRoutes from "./routes/workflows";
import * as bulkRoutes from "./routes/bulk";
import * as productRoutes from "./routes/products";
import * as installationRoutes from "./routes/installation";
import * as storeRoutes from "./routes/stores";
import * as thirdPartyRoutes from "./routes/thirdPartyIntegrations";
import * as filterRoutes from "./routes/filters";
import * as platformRoutes from "./routes/platforms";
import { databaseService } from "./services/database";
import { installationService } from "./services/installationService";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Simple test endpoint
  app.get("/api/test", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Server is running",
    });
  });

  app.get("/api/demo", handleDemo);

  // Workflow routes
  app.get("/api/workflows/rules", workflowRoutes.getWorkflowRules);
  app.post("/api/workflows/rules", workflowRoutes.createWorkflowRule);
  app.post("/api/workflows/execute", workflowRoutes.executeWorkflow);
  app.get("/api/workflows/executions", workflowRoutes.getWorkflowExecutions);
  app.post(
    "/api/workflows/executions/:id/cancel",
    workflowRoutes.cancelWorkflowExecution,
  );

  // Bulk operation routes
  app.post("/api/bulk/operations", bulkRoutes.startBulkOperation);
  app.get("/api/bulk/operations", bulkRoutes.getBulkOperations);
  app.get("/api/bulk/operations/:id", bulkRoutes.getBulkOperation);
  app.post("/api/bulk/operations/:id/cancel", bulkRoutes.cancelBulkOperation);
  app.post("/api/bulk/operations/:id/retry", bulkRoutes.retryFailedItems);
  app.get("/api/bulk/operations/:id/stream", bulkRoutes.streamBulkOperation);

  // Product routes
  app.post("/api/products/paginated", productRoutes.getPaginatedProducts);
  app.post("/api/products/search", productRoutes.searchProducts);
  app.post("/api/products/count", productRoutes.getProductCount);
  app.get("/api/products/status", productRoutes.getProductStatus);
  app.post("/api/products/lazy-load", productRoutes.lazyLoadProducts);
  app.post("/api/products/bulk-update", productRoutes.bulkUpdateProducts);
  app.get("/api/products/vendors", productRoutes.getVendors);
  app.get("/api/products/types", productRoutes.getProductTypes);
  app.post("/api/products", productRoutes.createProduct);
  app.get("/api/products/:id", productRoutes.getProduct);
  app.put("/api/products/:id", productRoutes.updateProduct);
  app.delete("/api/products/:id", productRoutes.deleteProduct);

  // Installation routes
  app.get("/api/installation/status", installationRoutes.getInstallationStatus);
  app.get(
    "/api/installation/requirements",
    installationRoutes.getSystemRequirements,
  );
  app.post(
    "/api/installation/test-db",
    installationRoutes.testDatabaseConnection,
  );
  app.post(
    "/api/installation/validate",
    installationRoutes.validateConfiguration,
  );
  app.post("/api/installation/install", installationRoutes.runInstallation);
  app.get(
    "/api/installation/progress",
    installationRoutes.getInstallationProgress,
  );

  // Store routes
  app.post("/api/stores/connect", storeRoutes.connectStore);
  app.get("/api/stores", storeRoutes.getStores);
  app.get("/api/stores/products", storeRoutes.getStoreProducts);
  app.get("/api/stores/:storeId/products", storeRoutes.getProductsForStore);
  app.post("/api/stores/:storeId/sync", storeRoutes.syncStore);
  app.delete("/api/stores/:storeId", storeRoutes.disconnectStore);

  // Third-party integration routes
  app.get("/api/third-party/integrations", thirdPartyRoutes.getIntegrations);
  app.post("/api/third-party/connect", thirdPartyRoutes.connectService);
  app.put("/api/third-party/integrations/:id", thirdPartyRoutes.updateIntegration);
  app.delete("/api/third-party/integrations/:id", thirdPartyRoutes.disconnectIntegration);
  app.post("/api/third-party/integrations/:id/test", thirdPartyRoutes.testIntegrationConnection);
  app.post("/api/third-party/integrations/:id/sync", thirdPartyRoutes.syncIntegration);

  // Database health check
  app.get("/api/health/database", async (req, res) => {
    try {
      const health = await databaseService.healthCheck();
      res.status(health.status === "healthy" ? 200 : 503).json(health);
    } catch (error) {
      res.status(503).json({
        status: "error",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  });

  // Initialize database on startup
  databaseService.initialize().catch((error) => {
    console.warn(
      "Database initialization failed, continuing in mock mode:",
      error.message,
    );
    // Don't exit the process - allow the app to run with mock data
  });

  return app;
}

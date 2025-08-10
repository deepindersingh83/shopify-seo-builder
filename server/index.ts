import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as workflowRoutes from "./routes/workflows";
import * as bulkRoutes from "./routes/bulk";
import * as productRoutes from "./routes/products";
import { databaseService } from "./services/database";

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
  app.post("/api/products/lazy-load", productRoutes.lazyLoadProducts);
  app.post("/api/products/bulk-update", productRoutes.bulkUpdateProducts);
  app.get("/api/products/vendors", productRoutes.getVendors);
  app.get("/api/products/types", productRoutes.getProductTypes);
  app.post("/api/products", productRoutes.createProduct);
  app.get("/api/products/:id", productRoutes.getProduct);
  app.put("/api/products/:id", productRoutes.updateProduct);
  app.delete("/api/products/:id", productRoutes.deleteProduct);

  // Database health check
  app.get("/api/health/database", async (req, res) => {
    try {
      const health = await databaseService.healthCheck();
      res.status(health.status === 'healthy' ? 200 : 503).json(health);
    } catch (error) {
      res.status(503).json({
        status: 'error',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  });

  // Initialize database on startup
  databaseService.initialize().catch(error => {
    console.warn('Database initialization failed, continuing in mock mode:', error.message);
    // Don't exit the process - allow the app to run with mock data
  });

  return app;
}

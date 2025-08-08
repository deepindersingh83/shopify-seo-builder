import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as workflowRoutes from "./routes/workflows";
import * as bulkRoutes from "./routes/bulk";

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

  return app;
}

import { RequestHandler } from "express";
import { BulkOperation } from "@shared/workflows";

// Mock data storage
let bulkOperations: BulkOperation[] = [];

export const startBulkOperation: RequestHandler = (req, res) => {
  const { type, name, productIds, options } = req.body;

  const operation: BulkOperation = {
    id: `bulk-${Date.now()}`,
    type,
    name,
    status: "running",
    progress: 0,
    totalItems: productIds.length,
    processedItems: 0,
    successfulItems: 0,
    failedItems: 0,
    startedAt: new Date().toISOString(),
    canCancel: true,
    results: [],
    errors: [],
  };

  bulkOperations.push(operation);

  // Simulate async processing
  simulateBulkOperation(operation.id);

  res.json({ operationId: operation.id });
};

export const getBulkOperations: RequestHandler = (req, res) => {
  const { status, type, limit = "50", offset = "0" } = req.query;

  let filtered = bulkOperations;

  if (status) {
    filtered = filtered.filter((op) => op.status === status);
  }

  if (type) {
    filtered = filtered.filter((op) => op.type === type);
  }

  const limitNum = parseInt(limit as string);
  const offsetNum = parseInt(offset as string);

  const paginated = filtered.slice(offsetNum, offsetNum + limitNum);

  res.json({
    operations: paginated,
    total: filtered.length,
  });
};

export const getBulkOperation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const operation = bulkOperations.find((op) => op.id === id);

  if (!operation) {
    return res.status(404).json({ error: "Operation not found" });
  }

  res.json(operation);
};

export const cancelBulkOperation: RequestHandler = (req, res) => {
  const { id } = req.params;
  const operation = bulkOperations.find((op) => op.id === id);

  if (!operation) {
    return res.status(404).json({ error: "Operation not found" });
  }

  operation.status = "cancelled";
  operation.canCancel = false;
  operation.completedAt = new Date().toISOString();

  res.json({ success: true, message: "Operation cancelled" });
};

export const retryFailedItems: RequestHandler = (req, res) => {
  const { id } = req.params;
  const operation = bulkOperations.find((op) => op.id === id);

  if (!operation) {
    return res.status(404).json({ error: "Operation not found" });
  }

  // Create a new operation for failed items
  const retryOperation: BulkOperation = {
    id: `bulk-retry-${Date.now()}`,
    type: operation.type,
    name: `Retry: ${operation.name}`,
    status: "running",
    progress: 0,
    totalItems: operation.failedItems,
    processedItems: 0,
    successfulItems: 0,
    failedItems: 0,
    startedAt: new Date().toISOString(),
    canCancel: true,
    results: [],
    errors: [],
  };

  bulkOperations.push(retryOperation);
  simulateBulkOperation(retryOperation.id);

  res.json({ newOperationId: retryOperation.id });
};

// Server-Sent Events for real-time progress
export const streamBulkOperation: RequestHandler = (req, res) => {
  const { id } = req.params;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // Send initial data
  const operation = bulkOperations.find((op) => op.id === id);
  if (operation) {
    res.write(`data: ${JSON.stringify(operation)}\n\n`);
  }

  // Set up interval to send updates
  const interval = setInterval(() => {
    const currentOperation = bulkOperations.find((op) => op.id === id);
    if (currentOperation) {
      res.write(`data: ${JSON.stringify(currentOperation)}\n\n`);

      if (
        currentOperation.status === "completed" ||
        currentOperation.status === "failed" ||
        currentOperation.status === "cancelled"
      ) {
        clearInterval(interval);
        res.end();
      }
    }
  }, 1000);

  // Clean up on client disconnect
  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
};

// Simulate bulk operation processing
function simulateBulkOperation(operationId: string) {
  const operation = bulkOperations.find((op) => op.id === operationId);
  if (!operation) return;

  let progress = 0;
  const batchSize = 10;

  const interval = setInterval(() => {
    if (operation.status === "cancelled") {
      clearInterval(interval);
      return;
    }

    // Simulate processing a batch
    const increment = Math.min(
      batchSize,
      operation.totalItems - operation.processedItems,
    );
    operation.processedItems += increment;

    // Simulate some failures (10% failure rate)
    const newSuccessful = Math.floor(increment * 0.9);
    const newFailed = increment - newSuccessful;

    operation.successfulItems += newSuccessful;
    operation.failedItems += newFailed;

    operation.progress = Math.round(
      (operation.processedItems / operation.totalItems) * 100,
    );

    // Add some mock errors
    if (newFailed > 0) {
      operation.errors.push({
        productId: `product-${Date.now()}`,
        error: "Mock error: API rate limit exceeded",
        timestamp: new Date().toISOString(),
      });
    }

    if (operation.processedItems >= operation.totalItems) {
      operation.status = "completed";
      operation.completedAt = new Date().toISOString();
      operation.canCancel = false;
      clearInterval(interval);
    }
  }, 500); // Process every 500ms for demo purposes
}

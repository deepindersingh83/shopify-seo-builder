import { RequestHandler } from "express";
import { WorkflowRule, WorkflowExecution } from "@shared/workflows";

// Mock data storage
let workflowRules: WorkflowRule[] = [];
let workflowExecutions: WorkflowExecution[] = [];

export const getWorkflowRules: RequestHandler = (req, res) => {
  res.json(workflowRules);
};

export const createWorkflowRule: RequestHandler = (req, res) => {
  const rule: WorkflowRule = {
    id: `rule-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executionCount: 0
  };
  
  workflowRules.push(rule);
  res.status(201).json(rule);
};

export const executeWorkflow: RequestHandler = (req, res) => {
  const { ruleId, productIds } = req.body;
  
  const execution: WorkflowExecution = {
    id: `exec-${Date.now()}`,
    workflowId: ruleId,
    status: 'running',
    startedAt: new Date().toISOString(),
    progress: 0,
    totalItems: productIds?.length || 100,
    processedItems: 0,
    errors: [],
    results: [],
    canCancel: true
  };
  
  workflowExecutions.push(execution);
  
  // Simulate async execution
  simulateExecution(execution.id);
  
  res.json(execution);
};

export const getWorkflowExecutions: RequestHandler = (req, res) => {
  const { ruleId } = req.query;
  
  let executions = workflowExecutions;
  if (ruleId) {
    executions = executions.filter(e => e.workflowId === ruleId);
  }
  
  res.json(executions);
};

export const cancelWorkflowExecution: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  const execution = workflowExecutions.find(e => e.id === id);
  if (execution) {
    execution.status = 'cancelled';
    execution.canCancel = false;
    execution.completedAt = new Date().toISOString();
  }
  
  res.json({ success: true });
};

// Simulate workflow execution
function simulateExecution(executionId: string) {
  const execution = workflowExecutions.find(e => e.id === executionId);
  if (!execution) return;
  
  let progress = 0;
  const interval = setInterval(() => {
    if (execution.status === 'cancelled') {
      clearInterval(interval);
      return;
    }
    
    progress += Math.random() * 15;
    execution.progress = Math.min(progress, 100);
    execution.processedItems = Math.floor((execution.progress / 100) * execution.totalItems);
    execution.successfulItems = Math.floor(execution.processedItems * 0.9);
    execution.failedItems = execution.processedItems - execution.successfulItems;
    
    if (execution.progress >= 100) {
      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      execution.canCancel = false;
      clearInterval(interval);
    }
  }, 1000);
}

import { 
  WorkflowRule, 
  WorkflowExecution, 
  BulkOperation, 
  SEOAudit, 
  AuditResult,
  FilterPreset,
  PlatformIntegration,
  ThirdPartyIntegration
} from '@shared/workflows';

class WorkflowService {
  private baseUrl = '/api';

  // Workflow Rules Management
  async getWorkflowRules(): Promise<WorkflowRule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workflows/rules`);
      if (!response.ok) {
        throw new Error('API not available');
      }
      return response.json();
    } catch (error) {
      // Return mock data if API is not available
      return [
        {
          id: '1',
          name: 'Auto SEO Optimization',
          description: 'Automatically optimize SEO fields for new products',
          enabled: true,
          trigger: { type: 'event', event: 'product_created' },
          conditions: [],
          actions: [
            { id: '1', type: 'generate_meta', config: { metaType: 'both', useAI: true } },
            { id: '2', type: 'generate_schema', config: {} }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          executionCount: 156
        }
      ];
    }
  }

  async getWorkflowRule(id: string): Promise<WorkflowRule> {
    const response = await fetch(`${this.baseUrl}/workflows/rules/${id}`);
    return response.json();
  }

  async createWorkflowRule(rule: Omit<WorkflowRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>): Promise<WorkflowRule> {
    const response = await fetch(`${this.baseUrl}/workflows/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule)
    });
    return response.json();
  }

  async updateWorkflowRule(id: string, rule: Partial<WorkflowRule>): Promise<WorkflowRule> {
    const response = await fetch(`${this.baseUrl}/workflows/rules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule)
    });
    return response.json();
  }

  async deleteWorkflowRule(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/workflows/rules/${id}`, {
      method: 'DELETE'
    });
  }

  async executeWorkflow(ruleId: string, productIds?: string[]): Promise<WorkflowExecution> {
    const response = await fetch(`${this.baseUrl}/workflows/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId, productIds })
    });
    return response.json();
  }

  // Workflow Executions
  async getWorkflowExecutions(ruleId?: string): Promise<WorkflowExecution[]> {
    const url = ruleId 
      ? `${this.baseUrl}/workflows/executions?ruleId=${ruleId}`
      : `${this.baseUrl}/workflows/executions`;
    const response = await fetch(url);
    return response.json();
  }

  async getWorkflowExecution(id: string): Promise<WorkflowExecution> {
    const response = await fetch(`${this.baseUrl}/workflows/executions/${id}`);
    return response.json();
  }

  async cancelWorkflowExecution(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/workflows/executions/${id}/cancel`, {
      method: 'POST'
    });
  }

  // SEO Audits
  async getSEOAudits(): Promise<SEOAudit[]> {
    const response = await fetch(`${this.baseUrl}/seo/audits`);
    return response.json();
  }

  async createSEOAudit(audit: Omit<SEOAudit, 'id'>): Promise<SEOAudit> {
    const response = await fetch(`${this.baseUrl}/seo/audits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(audit)
    });
    return response.json();
  }

  async runSEOAudit(auditId: string, productIds?: string[]): Promise<AuditResult> {
    const response = await fetch(`${this.baseUrl}/seo/audits/${auditId}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds })
    });
    return response.json();
  }

  async getAuditResults(auditId: string): Promise<AuditResult[]> {
    const response = await fetch(`${this.baseUrl}/seo/audits/${auditId}/results`);
    return response.json();
  }

  // Bulk Operations
  async getBulkOperations(): Promise<BulkOperation[]> {
    const response = await fetch(`${this.baseUrl}/bulk/operations`);
    return response.json();
  }

  async getBulkOperation(id: string): Promise<BulkOperation> {
    const response = await fetch(`${this.baseUrl}/bulk/operations/${id}`);
    return response.json();
  }

  async cancelBulkOperation(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/bulk/operations/${id}/cancel`, {
      method: 'POST'
    });
  }

  // Filter Presets
  async getFilterPresets(): Promise<FilterPreset[]> {
    const response = await fetch(`${this.baseUrl}/filters/presets`);
    return response.json();
  }

  async saveFilterPreset(preset: Omit<FilterPreset, 'id' | 'createdAt' | 'usageCount'>): Promise<FilterPreset> {
    const response = await fetch(`${this.baseUrl}/filters/presets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preset)
    });
    return response.json();
  }

  async deleteFilterPreset(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/filters/presets/${id}`, {
      method: 'DELETE'
    });
  }

  async applyFilterPreset(id: string): Promise<FilterPreset> {
    const response = await fetch(`${this.baseUrl}/filters/presets/${id}/apply`, {
      method: 'POST'
    });
    return response.json();
  }

  // Platform Integrations
  async getPlatformIntegrations(): Promise<PlatformIntegration[]> {
    const response = await fetch(`${this.baseUrl}/integrations/platforms`);
    return response.json();
  }

  async connectPlatform(integration: Omit<PlatformIntegration, 'id' | 'status' | 'lastSync' | 'syncHistory'>): Promise<PlatformIntegration> {
    const response = await fetch(`${this.baseUrl}/integrations/platforms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(integration)
    });
    return response.json();
  }

  async testPlatformConnection(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/integrations/platforms/${id}/test`, {
      method: 'POST'
    });
    return response.json();
  }

  async syncPlatform(id: string, direction: 'import' | 'export' | 'bidirectional'): Promise<void> {
    await fetch(`${this.baseUrl}/integrations/platforms/${id}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction })
    });
  }

  // Third-party Integrations
  async getThirdPartyIntegrations(): Promise<ThirdPartyIntegration[]> {
    const response = await fetch(`${this.baseUrl}/integrations/third-party`);
    return response.json();
  }

  async connectThirdParty(integration: Omit<ThirdPartyIntegration, 'id' | 'status' | 'lastSync'>): Promise<ThirdPartyIntegration> {
    const response = await fetch(`${this.baseUrl}/integrations/third-party`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(integration)
    });
    return response.json();
  }

  // AI-powered optimization
  async generateSEOSuggestions(productId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/seo-suggestions/${productId}`);
    return response.json();
  }

  async generateMetaData(productId: string, type: 'title' | 'description' | 'both'): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/generate-meta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, type })
    });
    return response.json();
  }

  async generateSchemaMarkup(productId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/generate-schema/${productId}`);
    return response.json();
  }

  async getTagSuggestions(productId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/tag-suggestions/${productId}`);
    return response.json();
  }

  // Real-time monitoring
  subscribeToExecution(executionId: string, callback: (data: WorkflowExecution) => void): EventSource {
    const eventSource = new EventSource(`${this.baseUrl}/workflows/executions/${executionId}/stream`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    return eventSource;
  }

  subscribeToBulkOperation(operationId: string, callback: (data: BulkOperation) => void): EventSource {
    const eventSource = new EventSource(`${this.baseUrl}/bulk/operations/${operationId}/stream`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    return eventSource;
  }
}

export const workflowService = new WorkflowService();

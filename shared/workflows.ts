/**
 * Workflow Automation Types and Interfaces
 */

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  schedule?: WorkflowSchedule;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
}

export interface WorkflowTrigger {
  type: "manual" | "scheduled" | "event" | "bulk_operation";
  event?:
    | "product_created"
    | "product_updated"
    | "inventory_low"
    | "seo_score_changed";
  schedule?: WorkflowSchedule;
}

export interface WorkflowSchedule {
  type: "daily" | "weekly" | "monthly" | "custom";
  time: string; // HH:MM format
  timezone: string;
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
  cronExpression?: string; // For custom schedules
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty"
    | "in_list"
    | "not_in_list";
  value: any;
  logicalOperator?: "AND" | "OR";
}

export interface WorkflowAction {
  id: string;
  type:
    | "update_field"
    | "generate_meta"
    | "optimize_seo"
    | "send_email"
    | "create_tag"
    | "update_status"
    | "generate_schema"
    | "audit_seo"
    | "sync_platform";
  config: WorkflowActionConfig;
}

export interface WorkflowActionConfig {
  // Update Field
  field?: string;
  value?: any;

  // Generate Meta
  metaType?: "title" | "description" | "both";
  useAI?: boolean;
  template?: string;

  // SEO Optimization
  seoActions?: (
    | "fix_meta_length"
    | "add_alt_text"
    | "optimize_title"
    | "generate_schema"
    | "fix_handle"
  )[];

  // Email
  recipients?: string[];
  subject?: string;
  template?: string;
  includeProducts?: boolean;

  // Platform Sync
  platform?: "shopify" | "woocommerce" | "bigcommerce";
  syncFields?: string[];

  // Custom
  customCode?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startedAt: string;
  completedAt?: string;
  progress: number;
  totalItems: number;
  processedItems: number;
  errors: WorkflowError[];
  results: WorkflowResult[];
  canCancel: boolean;
}

export interface WorkflowError {
  productId: string;
  error: string;
  timestamp: string;
}

export interface WorkflowResult {
  productId: string;
  changes: { field: string; oldValue: any; newValue: any }[];
  timestamp: string;
}

// E-commerce Platform Integrations
export interface PlatformIntegration {
  id: string;
  name: string;
  type: "shopify" | "woocommerce" | "bigcommerce" | "magento";
  status: "connected" | "disconnected" | "error";
  credentials: PlatformCredentials;
  syncSettings: PlatformSyncSettings;
  lastSync?: string;
  syncHistory: SyncHistory[];
}

export interface PlatformCredentials {
  // Shopify
  shopifyDomain?: string;
  shopifyAccessToken?: string;

  // WooCommerce
  wooCommerceUrl?: string;
  wooCommerceKey?: string;
  wooCommerceSecret?: string;

  // BigCommerce
  bigCommerceStoreHash?: string;
  bigCommerceAccessToken?: string;

  // Magento
  magentoUrl?: string;
  magentoAccessToken?: string;
}

export interface PlatformSyncSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncFields: string[];
  conflictResolution: "platform_wins" | "local_wins" | "newest_wins" | "manual";
  enableWebhooks: boolean;
}

export interface SyncHistory {
  id: string;
  timestamp: string;
  direction: "import" | "export" | "bidirectional";
  status: "success" | "partial" | "failed";
  itemsProcessed: number;
  errors: string[];
}

// Third-party API Integrations
export interface ThirdPartyIntegration {
  id: string;
  name: string;
  type:
    | "google_search_console"
    | "google_analytics"
    | "semrush"
    | "ahrefs"
    | "pagespeed"
    | "social_media";
  status: "connected" | "disconnected" | "error";
  credentials: any;
  settings: any;
  lastSync?: string;
}

export interface GoogleSearchConsoleData {
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  queries: string[];
}

export interface GoogleAnalyticsData {
  pageviews: number;
  uniquePageviews: number;
  bounceRate: number;
  avgTimeOnPage: number;
  conversions: number;
  conversionRate: number;
}

export interface SEOToolData {
  difficulty: number;
  searchVolume: number;
  competitorCount: number;
  suggestions: string[];
  backlinks: number;
  domainAuthority: number;
}

export interface PageSpeedData {
  desktopScore: number;
  mobileScore: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  opportunities: PageSpeedOpportunity[];
}

export interface PageSpeedOpportunity {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  savings: number;
}

// Advanced Filtering
export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: ProductFilter[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface ProductFilter {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "between"
    | "in"
    | "not_in"
    | "is_empty"
    | "is_not_empty";
  value: any;
  value2?: any; // For 'between' operator
}

// SEO Audit System
export interface SEOAudit {
  id: string;
  name: string;
  description: string;
  schedule?: WorkflowSchedule;
  rules: SEOAuditRule[];
  notifications: AuditNotification[];
  lastRun?: string;
  enabled: boolean;
}

export interface SEOAuditRule {
  id: string;
  name: string;
  description: string;
  severity: "critical" | "warning" | "info";
  check: SEOCheck;
  autoFix: boolean;
  fixAction?: WorkflowAction;
}

export interface SEOCheck {
  type:
    | "meta_title_length"
    | "meta_description_length"
    | "missing_alt_text"
    | "duplicate_content"
    | "broken_links"
    | "missing_schema"
    | "keyword_density"
    | "page_speed"
    | "mobile_usability";
  threshold?: number;
  targetValue?: any;
}

export interface AuditNotification {
  type: "email" | "webhook" | "dashboard";
  enabled: boolean;
  config: {
    recipients?: string[];
    webhookUrl?: string;
    includeDetails?: boolean;
  };
}

export interface AuditResult {
  id: string;
  auditId: string;
  timestamp: string;
  status: "completed" | "failed";
  summary: AuditSummary;
  issues: AuditIssue[];
  recommendations: AuditRecommendation[];
}

export interface AuditSummary {
  totalProducts: number;
  criticalIssues: number;
  warnings: number;
  infoItems: number;
  score: number;
  improvementSuggestions: number;
}

export interface AuditIssue {
  productId: string;
  ruleId: string;
  severity: "critical" | "warning" | "info";
  message: string;
  autoFixable: boolean;
  fixed: boolean;
}

export interface AuditRecommendation {
  type: "optimization" | "technical" | "content" | "performance";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  effort: "low" | "medium" | "high";
  affectedProducts: string[];
}

// Bulk Operations
export interface BulkOperation {
  id: string;
  type: "edit" | "export" | "import" | "audit" | "optimize" | "sync";
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  startedAt: string;
  completedAt?: string;
  canCancel: boolean;
  results?: BulkOperationResult[];
  errors?: BulkOperationError[];
}

export interface BulkOperationResult {
  productId: string;
  status: "success" | "failed" | "skipped";
  changes?: { field: string; oldValue: any; newValue: any }[];
  message?: string;
}

export interface BulkOperationError {
  productId: string;
  error: string;
  timestamp: string;
}

// Smart Tag Suggestions
export interface TagSuggestion {
  tag: string;
  confidence: number;
  source:
    | "ai"
    | "category_mapping"
    | "keyword_analysis"
    | "competitor_analysis";
  reasoning: string;
}

export interface CategoryMapping {
  category: string;
  suggestedTags: string[];
  rules: CategoryTagRule[];
}

export interface CategoryTagRule {
  condition: string;
  tags: string[];
  priority: number;
}

// AI-Powered Features
export interface AIOptimizationSuggestion {
  type:
    | "meta_title"
    | "meta_description"
    | "product_title"
    | "description"
    | "tags"
    | "keywords";
  current: string;
  suggested: string;
  confidence: number;
  reasoning: string;
  estimatedImpact: "high" | "medium" | "low";
}

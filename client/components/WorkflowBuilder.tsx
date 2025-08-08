import { useState, useRef, useCallback } from "react";
import {
  Zap,
  Plus,
  Play,
  Save,
  Settings,
  Trash2,
  Copy,
  Download,
  Upload,
  Clock,
  Target,
  Filter,
  Mail,
  Database,
  Globe,
  ShoppingCart,
  BarChart3,
  Bot,
  RefreshCw,
  X,
  Edit,
  Calendar,
  ArrowRight,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action" | "delay";
  title: string;
  description: string;
  icon: any;
  position: { x: number; y: number };
  config: any;
  connections: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  isPopular: boolean;
}

const triggerTypes = [
  {
    type: "product_created",
    title: "Product Created",
    icon: Plus,
    description: "When a new product is added",
  },
  {
    type: "product_updated",
    title: "Product Updated",
    icon: Edit,
    description: "When a product is modified",
  },
  {
    type: "schedule",
    title: "Schedule",
    icon: Clock,
    description: "Run on a schedule",
  },
  {
    type: "seo_score_change",
    title: "SEO Score Change",
    icon: Target,
    description: "When SEO score changes",
  },
  {
    type: "inventory_low",
    title: "Low Inventory",
    icon: AlertTriangle,
    description: "When stock is low",
  },
  {
    type: "manual",
    title: "Manual Trigger",
    icon: Play,
    description: "Run manually",
  },
];

const actionTypes = [
  {
    type: "generate_meta",
    title: "Generate Meta Tags",
    icon: Bot,
    description: "AI-powered meta generation",
  },
  {
    type: "optimize_seo",
    title: "Optimize SEO",
    icon: Target,
    description: "Auto-optimize product SEO",
  },
  {
    type: "send_email",
    title: "Send Email",
    icon: Mail,
    description: "Send notification email",
  },
  {
    type: "update_fields",
    title: "Update Fields",
    icon: Edit,
    description: "Update product fields",
  },
  {
    type: "sync_channels",
    title: "Sync Channels",
    icon: RefreshCw,
    description: "Sync to sales channels",
  },
  {
    type: "generate_tags",
    title: "Generate Tags",
    icon: Plus,
    description: "AI-generated product tags",
  },
  {
    type: "translate_content",
    title: "Translate Content",
    icon: Globe,
    description: "Multi-language translation",
  },
  {
    type: "analytics_track",
    title: "Track Analytics",
    icon: BarChart3,
    description: "Custom analytics tracking",
  },
];

const conditionTypes = [
  {
    type: "field_check",
    title: "Field Check",
    icon: Filter,
    description: "Check field values",
  },
  {
    type: "category_match",
    title: "Category Match",
    icon: Target,
    description: "Product category condition",
  },
  {
    type: "price_range",
    title: "Price Range",
    icon: ShoppingCart,
    description: "Price-based condition",
  },
  {
    type: "inventory_level",
    title: "Inventory Level",
    icon: Database,
    description: "Stock level condition",
  },
];

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "1",
    name: "Auto SEO Optimization",
    description: "Automatically optimize SEO for new products",
    category: "SEO",
    isPopular: true,
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        title: "Product Created",
        description: "When a new product is added",
        icon: Plus,
        position: { x: 50, y: 100 },
        config: { event: "product_created" },
        connections: ["action_1"],
      },
      {
        id: "action_1",
        type: "action",
        title: "Generate Meta Tags",
        description: "AI-powered meta generation",
        icon: Bot,
        position: { x: 300, y: 100 },
        config: { metaType: "both", useAI: true },
        connections: ["action_2"],
      },
      {
        id: "action_2",
        type: "action",
        title: "Optimize SEO",
        description: "Auto-optimize product SEO",
        icon: Target,
        position: { x: 550, y: 100 },
        config: { optimizeImages: true, generateSchema: true },
        connections: [],
      },
    ],
  },
  {
    id: "2",
    name: "Multi-Channel Sync",
    description: "Sync products to all sales channels",
    category: "Channel Management",
    isPopular: true,
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        title: "Product Updated",
        description: "When a product is modified",
        icon: Edit,
        position: { x: 50, y: 100 },
        config: { event: "product_updated" },
        connections: ["condition_1"],
      },
      {
        id: "condition_1",
        type: "condition",
        title: "Price Changed",
        description: "Check if price was updated",
        icon: Filter,
        position: { x: 300, y: 100 },
        config: { field: "price", operator: "changed" },
        connections: ["action_1"],
      },
      {
        id: "action_1",
        type: "action",
        title: "Sync Channels",
        description: "Sync to all sales channels",
        icon: RefreshCw,
        position: { x: 550, y: 100 },
        config: { channels: ["amazon", "ebay", "facebook"] },
        connections: [],
      },
    ],
  },
  {
    id: "3",
    name: "Low Stock Alert",
    description: "Alert when inventory is low",
    category: "Inventory",
    isPopular: false,
    nodes: [
      {
        id: "trigger_1",
        type: "trigger",
        title: "Low Inventory",
        description: "When stock is low",
        icon: AlertTriangle,
        position: { x: 50, y: 100 },
        config: { threshold: 10 },
        connections: ["action_1"],
      },
      {
        id: "action_1",
        type: "action",
        title: "Send Email",
        description: "Send notification email",
        icon: Mail,
        position: { x: 300, y: 100 },
        config: { recipients: ["admin@store.com"], template: "low_stock" },
        connections: [],
      },
    ],
  },
];

export function WorkflowBuilder() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkflowTemplate | null>(null);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [showNodeConfig, setShowNodeConfig] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setWorkflowNodes(template.nodes);
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
    setIsBuilderMode(true);
  };

  const handleCreateFromScratch = () => {
    setSelectedTemplate(null);
    setWorkflowNodes([]);
    setWorkflowName("");
    setWorkflowDescription("");
    setIsBuilderMode(true);
  };

  const handleDragStart = (nodeType: string) => {
    setDraggedNodeType(nodeType);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedNodeType || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nodeTypeInfo = [
        ...triggerTypes,
        ...actionTypes,
        ...conditionTypes,
      ].find((t) => t.type === draggedNodeType);

      if (nodeTypeInfo) {
        const newNode: WorkflowNode = {
          id: `node_${Date.now()}`,
          type: draggedNodeType.includes("trigger")
            ? "trigger"
            : draggedNodeType.includes("condition")
              ? "condition"
              : "action",
          title: nodeTypeInfo.title,
          description: nodeTypeInfo.description,
          icon: nodeTypeInfo.icon,
          position: { x: x - 50, y: y - 25 },
          config: {},
          connections: [],
        };

        setWorkflowNodes((prev) => [...prev, newNode]);
      }

      setDraggedNodeType(null);
    },
    [draggedNodeType],
  );

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    setShowNodeConfig(true);
  };

  const handleNodeDelete = (nodeId: string) => {
    setWorkflowNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setSelectedNode(null);
    setShowNodeConfig(false);
  };

  const handleSaveWorkflow = () => {
    console.log("Saving workflow:", {
      name: workflowName,
      description: workflowDescription,
      nodes: workflowNodes,
    });
    // Implementation would save to backend
  };

  const renderNodePalette = () => (
    <div className="space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="font-medium">Triggers</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          {triggerTypes.map((trigger) => (
            <div
              key={trigger.type}
              draggable
              onDragStart={() => handleDragStart(trigger.type)}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-grab hover:bg-muted/50 active:cursor-grabbing"
            >
              <trigger.icon className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-sm">{trigger.title}</div>
                <div className="text-xs text-muted-foreground">
                  {trigger.description}
                </div>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="font-medium">Conditions</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          {conditionTypes.map((condition) => (
            <div
              key={condition.type}
              draggable
              onDragStart={() => handleDragStart(condition.type)}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-grab hover:bg-muted/50 active:cursor-grabbing"
            >
              <condition.icon className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="font-medium text-sm">{condition.title}</div>
                <div className="text-xs text-muted-foreground">
                  {condition.description}
                </div>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="font-medium">Actions</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          {actionTypes.map((action) => (
            <div
              key={action.type}
              draggable
              onDragStart={() => handleDragStart(action.type)}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-grab hover:bg-muted/50 active:cursor-grabbing"
            >
              <action.icon className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  const renderWorkflowCanvas = () => (
    <div
      ref={canvasRef}
      className="relative flex-1 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10 min-h-[500px] overflow-auto"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {workflowNodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Build Your Workflow</p>
            <p>Drag and drop components from the left panel to get started</p>
          </div>
        </div>
      ) : (
        <>
          {workflowNodes.map((node, index) => (
            <div key={node.id}>
              {/* Node */}
              <div
                className={cn(
                  "absolute w-32 h-20 border-2 rounded-lg bg-card cursor-pointer transition-all hover:shadow-md",
                  node.type === "trigger" && "border-blue-500 bg-blue-50",
                  node.type === "condition" && "border-yellow-500 bg-yellow-50",
                  node.type === "action" && "border-green-500 bg-green-50",
                  selectedNode?.id === node.id && "ring-2 ring-primary",
                )}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                }}
                onClick={() => handleNodeClick(node)}
              >
                <div className="p-2 h-full flex flex-col items-center justify-center">
                  <node.icon className="h-5 w-5 mb-1" />
                  <div className="text-xs font-medium text-center leading-tight">
                    {node.title}
                  </div>
                </div>

                {/* Delete button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeDelete(node.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Connection lines */}
              {node.connections.map((connectionId) => {
                const targetNode = workflowNodes.find(
                  (n) => n.id === connectionId,
                );
                if (!targetNode) return null;

                const startX = node.position.x + 64; // center of node
                const startY = node.position.y + 40;
                const endX = targetNode.position.x + 64;
                const endY = targetNode.position.y + 40;

                return (
                  <svg
                    key={`${node.id}-${connectionId}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: Math.min(startX, endX),
                      top: Math.min(startY, endY),
                      width: Math.abs(endX - startX),
                      height: Math.abs(endY - startY),
                    }}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                      </marker>
                    </defs>
                    <line
                      x1={startX > endX ? Math.abs(endX - startX) : 0}
                      y1={startY > endY ? Math.abs(endY - startY) : 0}
                      x2={startX > endX ? 0 : Math.abs(endX - startX)}
                      y2={startY > endY ? 0 : Math.abs(endY - startY)}
                      stroke="#666"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  </svg>
                );
              })}
            </div>
          ))}
        </>
      )}
    </div>
  );

  const renderNodeConfiguration = () => {
    if (!selectedNode) return null;

    return (
      <Dialog open={showNodeConfig} onOpenChange={setShowNodeConfig}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <selectedNode.icon className="h-5 w-5" />
              <span>Configure {selectedNode.title}</span>
            </DialogTitle>
            <DialogDescription>{selectedNode.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedNode.type === "trigger" &&
              selectedNode.title === "Schedule" && (
                <>
                  <div>
                    <Label>Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                </>
              )}

            {selectedNode.type === "action" &&
              selectedNode.title === "Send Email" && (
                <>
                  <div>
                    <Label>Recipients</Label>
                    <Input placeholder="admin@store.com" />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input placeholder="Workflow notification" />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea placeholder="Your workflow message..." />
                  </div>
                </>
              )}

            {selectedNode.type === "action" &&
              selectedNode.title === "Generate Meta Tags" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Switch id="use-ai" defaultChecked />
                    <Label htmlFor="use-ai">Use AI Generation</Label>
                  </div>
                  <div>
                    <Label>Meta Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title Only</SelectItem>
                        <SelectItem value="description">
                          Description Only
                        </SelectItem>
                        <SelectItem value="both">
                          Both Title & Description
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

            {selectedNode.type === "condition" && (
              <>
                <div>
                  <Label>Field</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input placeholder="Enter value" />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNodeConfig(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNodeConfig(false)}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (!isBuilderMode) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Workflow Builder
            </h2>
            <p className="text-muted-foreground">
              Create automated workflows for your SEO tasks
            </p>
          </div>
          <Button onClick={handleCreateFromScratch}>
            <Plus className="h-4 w-4 mr-2" />
            Create from Scratch
          </Button>
        </div>

        {/* Templates Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Popular Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates
              .filter((t) => t.isPopular)
              .map((template) => (
                <Card
                  key={template.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent
                    className="p-6"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <Zap className="h-8 w-8 text-primary" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {template.nodes.length} steps
                      </span>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Templates */}
        <div>
          <h3 className="text-lg font-semibold mb-4">All Templates</h3>
          <div className="space-y-3">
            {workflowTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-sm transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Zap className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{template.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {template.nodes.length} steps
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setIsBuilderMode(false)}>
              ← Back to Templates
            </Button>
            <div>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Workflow name"
                className="font-semibold"
              />
              <Input
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Description"
                className="text-sm mt-1"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSaveWorkflow}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Test Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Main Builder */}
      <div className="flex-1 flex">
        {/* Node Palette */}
        <div className="w-80 border-r p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Workflow Components</h3>
          {renderNodePalette()}
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">{renderWorkflowCanvas()}</div>
      </div>

      {/* Node Configuration Modal */}
      {renderNodeConfiguration()}
    </div>
  );
}

export default WorkflowBuilder;

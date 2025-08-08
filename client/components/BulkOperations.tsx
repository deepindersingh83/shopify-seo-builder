import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  TrendingUp,
  BarChart3,
  Eye,
  MoreHorizontal,
  Zap,
  FileText,
  Database,
  Target,
  Package,
  ArrowUpDown,
  Filter,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bulkOperationService } from "@/services/bulkOperationService";
import { BulkOperation } from "@shared/workflows";

interface BulkOperationsProps {
  selectedProducts: string[];
  onClearSelection?: () => void;
}

export function BulkOperations({
  selectedProducts,
  onClearSelection,
}: BulkOperationsProps) {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [activeOperations, setActiveOperations] = useState<Map<string, any>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showNewOperationDialog, setShowNewOperationDialog] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const unsubscribeFunctions = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    loadOperations();
    return () => {
      // Cleanup all subscriptions
      unsubscribeFunctions.current.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const loadOperations = async () => {
    setIsLoading(true);
    try {
      const mockOperations = bulkOperationService.generateMockBulkOperations();
      setOperations(mockOperations);

      // Subscribe to running operations
      mockOperations
        .filter((op) => op.status === "running")
        .forEach((op) => subscribeToOperation(op.id));
    } catch (error) {
      console.error("Failed to load operations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToOperation = (operationId: string) => {
    if (unsubscribeFunctions.current.has(operationId)) return;

    const unsubscribe = bulkOperationService.subscribeToProgress(
      operationId,
      (progress) => {
        setActiveOperations((prev) => new Map(prev.set(operationId, progress)));

        // Update operations list
        setOperations((prev) =>
          prev.map((op) =>
            op.id === operationId ? { ...op, ...progress } : op,
          ),
        );
      },
      (completedOperation) => {
        console.log("Operation completed:", completedOperation);
        setActiveOperations((prev) => {
          const newMap = new Map(prev);
          newMap.delete(operationId);
          return newMap;
        });

        // Final update to operations list
        setOperations((prev) =>
          prev.map((op) => (op.id === operationId ? completedOperation : op)),
        );
      },
      (error) => {
        console.error("Operation error:", error);
      },
    );

    unsubscribeFunctions.current.set(operationId, unsubscribe);
  };

  const handleStartOperation = async (type: string, options: any) => {
    try {
      const config = {
        type: type as any,
        name: `${type} ${selectedProducts.length} products`,
        productIds: selectedProducts,
        ...options,
      };

      const { operationId } =
        await bulkOperationService.startBulkOperation(config);

      // Add to operations list and subscribe
      const newOperation: BulkOperation = {
        id: operationId,
        type: type as any,
        name: config.name,
        status: "running",
        progress: 0,
        totalItems: selectedProducts.length,
        processedItems: 0,
        successfulItems: 0,
        failedItems: 0,
        startedAt: new Date().toISOString(),
        canCancel: true,
        results: [],
        errors: [],
      };

      setOperations((prev) => [newOperation, ...prev]);
      subscribeToOperation(operationId);
      setShowNewOperationDialog(false);
      onClearSelection?.();
    } catch (error) {
      console.error("Failed to start operation:", error);
    }
  };

  const handleCancelOperation = async (operationId: string) => {
    try {
      await bulkOperationService.cancelBulkOperation(operationId);

      // Unsubscribe and update status
      const unsubscribe = unsubscribeFunctions.current.get(operationId);
      if (unsubscribe) {
        unsubscribe();
        unsubscribeFunctions.current.delete(operationId);
      }

      setOperations((prev) =>
        prev.map((op) =>
          op.id === operationId
            ? { ...op, status: "cancelled" as const, canCancel: false }
            : op,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel operation:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Activity className="h-3 w-3 mr-1" />
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="secondary">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case "edit":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "export":
        return <Download className="h-4 w-4 text-green-600" />;
      case "import":
        return <Upload className="h-4 w-4 text-purple-600" />;
      case "optimize":
        return <Target className="h-4 w-4 text-orange-600" />;
      case "sync":
        return <ArrowUpDown className="h-4 w-4 text-indigo-600" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "audit":
        return <Eye className="h-4 w-4 text-yellow-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const duration = Math.floor(durationMs / 1000);

    if (duration < 60) return `${duration}s`;
    if (duration < 3600)
      return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  const calculateETA = (operation: BulkOperation) => {
    if (operation.status !== "running" || operation.processedItems === 0)
      return null;

    const elapsed = Date.now() - new Date(operation.startedAt).getTime();
    const rate = operation.processedItems / (elapsed / 1000); // items per second
    const remaining = operation.totalItems - operation.processedItems;
    const eta = remaining / rate;

    return bulkOperationService.formatDuration(eta);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bulk Operations</h2>
          <p className="text-muted-foreground">
            Manage and monitor bulk operations on your products
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedProducts.length > 0 && (
            <Dialog
              open={showNewOperationDialog}
              onOpenChange={setShowNewOperationDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  New Operation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Start Bulk Operation</DialogTitle>
                  <DialogDescription>
                    Perform a bulk operation on {selectedProducts.length}{" "}
                    selected products.
                  </DialogDescription>
                </DialogHeader>
                <NewOperationForm
                  selectedProducts={selectedProducts}
                  onStart={handleStartOperation}
                  onCancel={() => setShowNewOperationDialog(false)}
                />
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" onClick={loadOperations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Selected Products Info */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {selectedProducts.length} product
                  {selectedProducts.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowNewOperationDialog(true)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start Operation
                </Button>
                <Button size="sm" variant="outline" onClick={onClearSelection}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Operations
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operations.filter((op) => op.status === "running").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operations.filter((op) => op.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Items Processed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operations
                .reduce((sum, op) => sum + op.processedItems, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total items processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operations.length > 0
                ? Math.round(
                    (operations.filter((op) => op.status === "completed")
                      .length /
                      operations.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Operation success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Operations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Active Operations Tab */}
        <TabsContent value="active" className="space-y-4">
          {operations
            .filter((op) => op.status === "running" || op.status === "paused")
            .map((operation) => {
              const activeProgress = activeOperations.get(operation.id);
              const currentProgress = activeProgress || operation;
              const eta = calculateETA(currentProgress);

              return (
                <Card key={operation.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Operation Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getOperationIcon(operation.type)}
                          <div>
                            <h3 className="font-semibold">{operation.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {operation.type} operation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(currentProgress.status)}
                          {operation.canCancel && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Square className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Operation
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this
                                    operation? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    No, continue
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleCancelOperation(operation.id)
                                    }
                                  >
                                    Yes, cancel operation
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {currentProgress.processedItems} of{" "}
                            {currentProgress.totalItems} items
                          </span>
                          <span>{currentProgress.progress}%</span>
                        </div>
                        <Progress
                          value={currentProgress.progress}
                          className="h-2"
                        />
                      </div>

                      {/* Operation Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Successful:
                          </span>
                          <p className="font-medium text-green-600">
                            {currentProgress.successfulItems}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Failed:</span>
                          <p className="font-medium text-red-600">
                            {currentProgress.failedItems}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <p className="font-medium">
                            {formatDuration(operation.startedAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ETA:</span>
                          <p className="font-medium">
                            {eta || "Calculating..."}
                          </p>
                        </div>
                      </div>

                      {/* Recent Errors */}
                      {currentProgress.errors &&
                        currentProgress.errors.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-destructive mb-2">
                              Recent Errors
                            </h4>
                            <div className="space-y-1">
                              {currentProgress.errors
                                .slice(-3)
                                .map((error, index) => (
                                  <div
                                    key={index}
                                    className="text-xs bg-destructive/10 p-2 rounded"
                                  >
                                    <span className="font-medium">
                                      Product {error.productId}:
                                    </span>{" "}
                                    {error.error}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          {operations.filter(
            (op) => op.status === "running" || op.status === "paused",
          ).length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No active operations
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start a new bulk operation to see real-time progress here.
                </p>
                {selectedProducts.length > 0 && (
                  <Button onClick={() => setShowNewOperationDialog(true)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Operation
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {operations
            .filter(
              (op) =>
                op.status === "completed" ||
                op.status === "failed" ||
                op.status === "cancelled",
            )
            .map((operation) => (
              <Card key={operation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getOperationIcon(operation.type)}
                      <div>
                        <h3 className="font-semibold">{operation.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Started{" "}
                          {new Date(operation.startedAt).toLocaleString()}
                        </p>
                        {operation.completedAt && (
                          <p className="text-xs text-muted-foreground">
                            Duration:{" "}
                            {formatDuration(
                              operation.startedAt,
                              operation.completedAt,
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(operation.status)}
                      <div className="text-right text-sm">
                        <p className="font-medium">
                          {operation.successfulItems}/{operation.totalItems}
                        </p>
                        <p className="text-muted-foreground">successful</p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Results
                          </DropdownMenuItem>
                          {operation.status === "failed" && (
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retry Failed Items
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Operation queue is empty
              </h3>
              <p className="text-muted-foreground text-center">
                Queued operations will appear here when the system is busy.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No operation templates
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Save frequently used operation configurations as templates.
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewOperationForm({
  selectedProducts,
  onStart,
  onCancel,
}: {
  selectedProducts: string[];
  onStart: (type: string, options: any) => void;
  onCancel: () => void;
}) {
  const [operationType, setOperationType] = useState("");
  const [options, setOptions] = useState<any>({});

  const handleStart = () => {
    onStart(operationType, options);
  };

  const operationTypes = [
    {
      value: "edit",
      label: "Bulk Edit",
      description: "Update product fields in bulk",
    },
    {
      value: "export",
      label: "Export",
      description: "Export products to CSV/Excel",
    },
    {
      value: "optimize",
      label: "SEO Optimize",
      description: "Optimize SEO for selected products",
    },
    {
      value: "sync",
      label: "Platform Sync",
      description: "Sync with external platforms",
    },
    {
      value: "audit",
      label: "SEO Audit",
      description: "Run comprehensive SEO audit",
    },
    {
      value: "delete",
      label: "Delete",
      description: "Delete selected products",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label>Operation Type</Label>
        <Select value={operationType} onValueChange={setOperationType}>
          <SelectTrigger>
            <SelectValue placeholder="Choose operation type..." />
          </SelectTrigger>
          <SelectContent>
            {operationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {operationType === "export" && (
        <div className="space-y-4">
          <div>
            <Label>Export Format</Label>
            <Select
              value={options.format || ""}
              onValueChange={(value) =>
                setOptions({ ...options, format: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={options.includeImages || false}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, includeImages: checked })
                }
              />
              <Label>Include image URLs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={options.includeSEO || false}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, includeSEO: checked })
                }
              />
              <Label>Include SEO data</Label>
            </div>
          </div>
        </div>
      )}

      {operationType === "optimize" && (
        <div className="space-y-4">
          <div>
            <Label>Optimization Options</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={options.useAI || false}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, useAI: checked })
                  }
                />
                <Label>Use AI for optimization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={options.generateSchema || false}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, generateSchema: checked })
                  }
                />
                <Label>Generate schema markup</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={options.preserveExisting || true}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, preserveExisting: checked })
                  }
                />
                <Label>Preserve existing data</Label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          This operation will affect <strong>{selectedProducts.length}</strong>{" "}
          selected products.
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleStart} disabled={!operationType}>
          <Play className="h-4 w-4 mr-2" />
          Start Operation
        </Button>
      </DialogFooter>
    </div>
  );
}

export default BulkOperations;

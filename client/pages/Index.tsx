import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Settings,
  Columns,
  Target,
  AlertCircle,
  CheckCircle,
  Zap,
  Database,
  Globe,
  TrendingUp,
  RefreshCw,
  Gauge,
  HardDrive,
  Clock,
  Users,
  Activity,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import AdvancedFilters from "@/components/AdvancedFilters";
import BulkOperations from "@/components/BulkOperations";
import SEOAutomation from "@/components/SEOAutomation";
import VirtualizedProductList from "@/components/VirtualizedProductList";
import { performanceService } from "@/services/performanceService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Product {
  id: string;
  title: string;
  handle: string;
  status: "active" | "draft" | "archived";
  vendor: string;
  productType: string;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  inventory: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  seoScore: number;
}

interface ColumnVisibility {
  product: boolean;
  status: boolean;
  vendor: boolean;
  inventory: boolean;
  price: boolean;
  seoScore: boolean;
  actions: boolean;
}

interface FilterState {
  status: string[];
  vendor: string[];
  productType: string[];
  seoScoreRange: [number, number];
  priceRange: [number, number];
  tags: string[];
  hasMetaTitle: boolean | null;
  hasMetaDescription: boolean | null;
  inventoryLevel: "all" | "in-stock" | "low-stock" | "out-of-stock";
}

const PERFORMANCE_MODES = {
  standard: {
    name: "Standard (Up to 10K)",
    description: "Balanced performance for small to medium stores",
    pageSize: 50,
    enableVirtualization: false,
    cacheSize: 1000,
    batchSize: 100,
  },
  high: {
    name: "High Performance (Up to 100K)",
    description: "Optimized for large stores",
    pageSize: 100,
    enableVirtualization: true,
    cacheSize: 5000,
    batchSize: 200,
  },
  enterprise: {
    name: "Enterprise (500K+)",
    description: "Maximum performance for enterprise-scale operations",
    pageSize: 200,
    enableVirtualization: true,
    cacheSize: 10000,
    batchSize: 500,
  },
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [performanceMode, setPerformanceMode] =
    useState<keyof typeof PERFORMANCE_MODES>("high");
  const [sortBy, setSortBy] = useState({
    field: "updatedAt",
    direction: "desc" as "asc" | "desc",
  });

  const [filters, setFilters] = useState<FilterState>({
    status: [],
    vendor: [],
    productType: [],
    seoScoreRange: [0, 100],
    priceRange: [0, 10000],
    tags: [],
    hasMetaTitle: null,
    hasMetaDescription: null,
    inventoryLevel: "all",
  });

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    product: true,
    status: true,
    vendor: true,
    inventory: true,
    price: true,
    seoScore: true,
    actions: true,
  });

  const [bulkOperation, setBulkOperation] = useState({
    type: "",
    metaTitle: "",
    metaDescription: "",
    tags: "",
    status: "",
    seoOptimize: false,
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalProducts: 0,
    loadTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    isOptimized: false,
  });

  // Performance monitoring
  useEffect(() => {
    const updateMetrics = () => {
      const metrics = performanceService.getPerformanceMetrics();
      const cacheStats = performanceService.getCacheStats();

      setPerformanceMetrics((prev) => ({
        ...prev,
        loadTime: metrics.queryTime,
        memoryUsage: cacheStats.memoryUsage,
        cacheHitRate: cacheStats.hitRate,
        isOptimized:
          performanceMode === "enterprise" && cacheStats.hitRate > 0.8,
      }));
    };

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [performanceMode]);

  // Apply performance configuration
  useEffect(() => {
    const config = PERFORMANCE_MODES[performanceMode];

    performanceService.updateCacheConfig({
      maxSize: config.cacheSize,
      ttl: 300000, // 5 minutes
      strategy: "lru",
    });

    performanceService.updateBatchConfig({
      batchSize: config.batchSize,
      maxConcurrentRequests: performanceMode === "enterprise" ? 20 : 10,
      retryAttempts: 3,
      retryDelay: 1000,
    });

    performanceService.updatePaginationConfig({
      pageSize: config.pageSize,
      virtualScrolling: config.enableVirtualization,
      preloadPages: 2,
      bufferSize: config.pageSize,
    });
  }, [performanceMode]);

  const currentConfig = PERFORMANCE_MODES[performanceMode];

  // Memoized filter for active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.vendor.length > 0) count++;
    if (filters.productType.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.hasMetaTitle !== null) count++;
    if (filters.hasMetaDescription !== null) count++;
    if (filters.inventoryLevel !== "all") count++;
    if (filters.seoScoreRange[0] > 0 || filters.seoScoreRange[1] < 100) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    return count;
  }, [filters]);

  const handleProductSelect = useCallback((product: Product) => {
    // Handle individual product selection
    console.log("Product selected:", product);
  }, []);

  const handleBulkSelect = useCallback((products: Product[]) => {
    setSelectedProducts(products.map((p) => p.id));
  }, []);

  const handleBulkOperation = useCallback(async () => {
    if (selectedProducts.length === 0) return;

    try {
      // Process in batches for better performance
      await performanceService.processBatch(
        selectedProducts,
        async (batch) => {
          const response = await fetch("/api/products/bulk-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productIds: batch,
              updates: bulkOperation,
            }),
          });
          return response.json();
        },
        (progress) => {
          console.log(`Bulk operation progress: ${progress}%`);
        },
      );

      setShowBulkDialog(false);
      setSelectedProducts([]);
      setBulkOperation({
        type: "",
        metaTitle: "",
        metaDescription: "",
        tags: "",
        status: "",
        seoOptimize: false,
      });
    } catch (error) {
      console.error("Bulk operation failed:", error);
    }
  }, [selectedProducts, bulkOperation]);

  const handleOptimizeMemory = useCallback(async () => {
    await performanceService.optimizeMemoryUsage();
    // Refresh metrics
    const metrics = performanceService.getPerformanceMetrics();
    const cacheStats = performanceService.getCacheStats();

    setPerformanceMetrics((prev) => ({
      ...prev,
      memoryUsage: cacheStats.memoryUsage,
      cacheHitRate: cacheStats.hitRate,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: [],
      vendor: [],
      productType: [],
      seoScoreRange: [0, 100],
      priceRange: [0, 10000],
      tags: [],
      hasMetaTitle: null,
      hasMetaDescription: null,
      inventoryLevel: "all",
    });
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage and optimize your product catalog with enterprise-scale
              performance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={performanceMetrics.isOptimized ? "default" : "secondary"}
            >
              {currentConfig.name}
            </Badge>
            <Button
              variant="outline"
              onClick={() => setShowPerformanceDialog(true)}
            >
              <Gauge className="h-4 w-4 mr-2" />
              Performance
            </Button>
          </div>
        </div>

        {/* Performance Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Products</p>
                  <p className="text-2xl font-bold">
                    {performanceMetrics.totalProducts.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Load Time</p>
                  <p className="text-2xl font-bold">
                    {performanceMetrics.loadTime.toFixed(0)}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Memory</p>
                  <p className="text-2xl font-bold">
                    {formatBytes(performanceMetrics.memoryUsage)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cache Hit</p>
                  <p className="text-2xl font-bold">
                    {(performanceMetrics.cacheHitRate * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      performanceMetrics.isOptimized ? "default" : "secondary"
                    }
                  >
                    {performanceMetrics.isOptimized ? "Optimized" : "Standard"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Columns className="h-4 w-4 mr-2" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4 mr-2" />
                  List View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("grid")}>
                  <Grid className="h-4 w-4 mr-2" />
                  Grid View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select
              value={`${sortBy.field}-${sortBy.direction}`}
              onValueChange={(value) => {
                const [field, direction] = value.split("-");
                setSortBy({ field, direction: direction as "asc" | "desc" });
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
                <SelectItem value="createdAt-desc">Recently Created</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
                <SelectItem value="price-asc">Price Low-High</SelectItem>
                <SelectItem value="price-desc">Price High-Low</SelectItem>
                <SelectItem value="seoScore-desc">
                  SEO Score High-Low
                </SelectItem>
                <SelectItem value="seoScore-asc">SEO Score Low-High</SelectItem>
              </SelectContent>
            </Select>

            {selectedProducts.length > 0 && (
              <Button onClick={() => setShowBulkDialog(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Bulk Actions ({selectedProducts.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClear={clearFilters}
              />
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <Card className="h-[calc(100vh-400px)]">
          <VirtualizedProductList
            searchQuery={searchQuery}
            filters={filters}
            sortBy={sortBy}
            viewMode={viewMode}
            pageSize={currentConfig.pageSize}
            enableSelection={true}
            enableBulkOperations={true}
            onProductSelect={handleProductSelect}
            onBulkSelect={handleBulkSelect}
          />
        </Card>

        {/* Performance Optimization Dialog */}
        <Dialog
          open={showPerformanceDialog}
          onOpenChange={setShowPerformanceDialog}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Performance Settings</DialogTitle>
              <DialogDescription>
                Optimize app performance based on your catalog size and hardware
                capabilities
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">
                  Performance Mode
                </Label>
                <div className="space-y-3 mt-3">
                  {Object.entries(PERFORMANCE_MODES).map(([key, config]) => (
                    <div
                      key={key}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        performanceMode === key
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() =>
                        setPerformanceMode(
                          key as keyof typeof PERFORMANCE_MODES,
                        )
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={performanceMode === key}
                          onChange={() =>
                            setPerformanceMode(
                              key as keyof typeof PERFORMANCE_MODES,
                            )
                          }
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{config.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {config.description}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Page Size: {config.pageSize}</span>
                            <span>Cache: {config.cacheSize} items</span>
                            <span>Batch: {config.batchSize}</span>
                            <span>
                              Virtual:{" "}
                              {config.enableVirtualization ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Memory Management
                </Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Memory Usage</p>
                    <p className="text-sm text-muted-foreground">
                      {formatBytes(performanceMetrics.memoryUsage)}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleOptimizeMemory}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Optimize Memory
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cache Hit Rate</p>
                    <p className="text-sm text-muted-foreground">
                      {(performanceMetrics.cacheHitRate * 100).toFixed(1)}%
                      efficiency
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => performanceService.clearCache()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </div>

              {performanceMode === "enterprise" && (
                <>
                  <Separator />
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      Enterprise mode is optimized for catalogs with 500K+
                      products. It uses advanced caching, virtualization, and
                      batch processing for maximum performance.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPerformanceDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowPerformanceDialog(false)}>
                Apply Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Operations Dialog */}
        <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bulk Operations</DialogTitle>
              <DialogDescription>
                Apply changes to {selectedProducts.length} selected products
              </DialogDescription>
            </DialogHeader>

            <BulkOperations
              selectedProducts={selectedProducts}
              onClearSelection={() => setSelectedProducts([])}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

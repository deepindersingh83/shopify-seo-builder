import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit3,
  Save,
  X,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Upload,
  Filter,
  Search,
  Target,
  BarChart3,
  Globe,
  Tag,
  DollarSign,
  Eye,
  Trash2,
  RefreshCw,
} from "lucide-react";

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
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  seoScore: number;
}

interface BulkOperation {
  id: string;
  type:
    | "meta_title"
    | "meta_description"
    | "tags"
    | "status"
    | "price"
    | "description";
  productCount: number;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  startedAt?: string;
  completedAt?: string;
  errors?: string[];
}

const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
  id: `product-${i + 1}`,
  title: `Product ${i + 1} - Premium Quality Item`,
  handle: `product-${i + 1}`,
  status: ["active", "draft", "archived"][Math.floor(Math.random() * 3)] as any,
  vendor: ["Nike", "Adidas", "Apple", "Samsung"][Math.floor(Math.random() * 4)],
  productType: ["Electronics", "Clothing", "Sports", "Accessories"][
    Math.floor(Math.random() * 4)
  ],
  tags: [`tag-${i}`, `category-${Math.floor(i / 10)}`],
  price: Math.floor(Math.random() * 500) + 20,
  compareAtPrice:
    Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 100 : undefined,
  inventory: Math.floor(Math.random() * 1000),
  image: `https://picsum.photos/100/100?random=${i}`,
  description: `High-quality product ${i + 1} with excellent features and durability.`,
  metaTitle:
    Math.random() > 0.5 ? `Product ${i + 1} | Best Quality` : undefined,
  metaDescription:
    Math.random() > 0.3
      ? `Premium product ${i + 1} with excellent features.`
      : undefined,
  seoScore: Math.floor(Math.random() * 100),
}));

export default function BulkEditPage() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("products");

  // Bulk edit form state
  const [bulkEditData, setBulkEditData] = useState({
    status: "",
    vendor: "",
    productType: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    description: "",
    price: "",
    compareAtPrice: "",
  });

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesVendor =
      vendorFilter === "all" || product.vendor === vendorFilter;
    return matchesSearch && matchesStatus && matchesVendor;
  });

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleImportCSV = () => {
    // Create a hidden input element for file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`File selected: ${file.name}. Import functionality would parse CSV and update products.`);
        // In a real app, you would parse the CSV and process it
      }
    };
    input.click();
  };

  const handleExportCSV = () => {
    const csvData = Array.from(selectedProducts).map(productId => {
      const product = products.find(p => p.id === productId);
      return {
        id: product?.id || '',
        title: product?.title || '',
        status: product?.status || '',
        vendor: product?.vendor || '',
        price: product?.price || 0,
      };
    });

    if (csvData.length === 0) {
      alert('No products selected for export. Please select products first.');
      return;
    }

    // Convert to CSV format
    const headers = ['ID', 'Title', 'Status', 'Vendor', 'Price'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => `"${row.id}","${row.title}","${row.status}","${row.vendor}",${row.price}`)
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    alert(`Exported ${csvData.length} products to CSV file.`);
  };

  const startBulkOperation = (type: BulkOperation["type"]) => {
    const operation: BulkOperation = {
      id: `bulk-${Date.now()}`,
      type,
      productCount: selectedProducts.size,
      status: "pending",
      progress: 0,
      startedAt: new Date().toISOString(),
    };

    setBulkOperations((prev) => [operation, ...prev]);

    // Simulate bulk operation
    setTimeout(() => {
      setBulkOperations((prev) =>
        prev.map((op) =>
          op.id === operation.id ? { ...op, status: "running" as const } : op,
        ),
      );

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        setBulkOperations((prev) =>
          prev.map((op) =>
            op.id === operation.id
              ? { ...op, progress: Math.min(progress, 100) }
              : op,
          ),
        );

        if (progress >= 100) {
          clearInterval(interval);
          setBulkOperations((prev) =>
            prev.map((op) =>
              op.id === operation.id
                ? {
                    ...op,
                    status: "completed" as const,
                    progress: 100,
                    completedAt: new Date().toISOString(),
                  }
                : op,
            ),
          );
        }
      }, 500);
    }, 1000);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getOperationStatusColor = (status: BulkOperation["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "running":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Bulk Edit Products
              </h1>
              <p className="text-muted-foreground">
                Efficiently manage and update multiple products simultaneously
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-xs">
                {selectedProducts.size} products selected
              </Badge>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Product Selection</TabsTrigger>
              <TabsTrigger value="bulk-edit">Bulk Edit</TabsTrigger>
              <TabsTrigger value="operations">Operations History</TabsTrigger>
            </TabsList>

            {/* Product Selection Tab */}
            <TabsContent value="products" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Search & Filter Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={vendorFilter}
                        onValueChange={setVendorFilter}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Vendors</SelectItem>
                          <SelectItem value="Nike">Nike</SelectItem>
                          <SelectItem value="Adidas">Adidas</SelectItem>
                          <SelectItem value="Apple">Apple</SelectItem>
                          <SelectItem value="Samsung">Samsung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Products ({filteredProducts.length})</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAllProducts}
                    >
                      {selectedProducts.size === filteredProducts.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() =>
                            toggleProductSelection(product.id)
                          }
                        />
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.handle}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={getStatusBadgeVariant(product.status)}
                          >
                            {product.status}
                          </Badge>
                          <span className="text-sm font-medium">
                            ${product.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bulk Edit Tab */}
            <TabsContent value="bulk-edit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Bulk Edit Fields
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Apply changes to {selectedProducts.size} selected products
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Basic Information</h3>
                      <div>
                        <Label htmlFor="bulk-status">Status</Label>
                        <Select
                          value={bulkEditData.status}
                          onValueChange={(value) =>
                            setBulkEditData((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bulk-vendor">Vendor</Label>
                        <Input
                          id="bulk-vendor"
                          value={bulkEditData.vendor}
                          onChange={(e) =>
                            setBulkEditData((prev) => ({
                              ...prev,
                              vendor: e.target.value,
                            }))
                          }
                          placeholder="Enter vendor name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bulk-product-type">Product Type</Label>
                        <Input
                          id="bulk-product-type"
                          value={bulkEditData.productType}
                          onChange={(e) =>
                            setBulkEditData((prev) => ({
                              ...prev,
                              productType: e.target.value,
                            }))
                          }
                          placeholder="Enter product type"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bulk-tags">
                          Tags (comma-separated)
                        </Label>
                        <Input
                          id="bulk-tags"
                          value={bulkEditData.tags}
                          onChange={(e) =>
                            setBulkEditData((prev) => ({
                              ...prev,
                              tags: e.target.value,
                            }))
                          }
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                    </div>

                    {/* SEO Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">SEO Information</h3>
                      <div>
                        <Label htmlFor="bulk-meta-title">Meta Title</Label>
                        <Input
                          id="bulk-meta-title"
                          value={bulkEditData.metaTitle}
                          onChange={(e) =>
                            setBulkEditData((prev) => ({
                              ...prev,
                              metaTitle: e.target.value,
                            }))
                          }
                          placeholder="Enter meta title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bulk-meta-description">
                          Meta Description
                        </Label>
                        <Textarea
                          id="bulk-meta-description"
                          value={bulkEditData.metaDescription}
                          onChange={(e) =>
                            setBulkEditData((prev) => ({
                              ...prev,
                              metaDescription: e.target.value,
                            }))
                          }
                          placeholder="Enter meta description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bulk-description">
                          Product Description
                        </Label>
                        <Textarea
                          id="bulk-description"
                          value={bulkEditData.description}
                          onChange={(e) =>
                            setBulkEditData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Enter product description"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => startBulkOperation("meta_title")}
                        disabled={selectedProducts.size === 0}
                        className="h-20 flex-col"
                      >
                        <Target className="h-6 w-6 mb-2" />
                        Update Meta Titles
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => startBulkOperation("meta_description")}
                        disabled={selectedProducts.size === 0}
                        className="h-20 flex-col"
                      >
                        <BarChart3 className="h-6 w-6 mb-2" />
                        Update Meta Descriptions
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => startBulkOperation("tags")}
                        disabled={selectedProducts.size === 0}
                        className="h-20 flex-col"
                      >
                        <Tag className="h-6 w-6 mb-2" />
                        Update Tags
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => startBulkOperation("status")}
                        disabled={selectedProducts.size === 0}
                        className="h-20 flex-col"
                      >
                        <Package className="h-6 w-6 mb-2" />
                        Update Status
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => startBulkOperation("description")}
                      disabled={selectedProducts.size === 0}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Apply Bulk Changes ({selectedProducts.size} products)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setBulkEditData({
                          status: "",
                          vendor: "",
                          productType: "",
                          tags: "",
                          metaTitle: "",
                          metaDescription: "",
                          description: "",
                          price: "",
                          compareAtPrice: "",
                        })
                      }
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Operations History Tab */}
            <TabsContent value="operations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Bulk Operations History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bulkOperations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No bulk operations yet. Start by selecting products and
                        applying bulk changes.
                      </div>
                    ) : (
                      bulkOperations.map((operation) => (
                        <div
                          key={operation.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${operation.status === "completed" ? "bg-green-100 text-green-600" : operation.status === "running" ? "bg-blue-100 text-blue-600" : operation.status === "failed" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}
                            >
                              {operation.status === "running" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : operation.status === "completed" ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : operation.status === "failed" ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <AlertCircle className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium capitalize">
                                {operation.type.replace("_", " ")} -{" "}
                                {operation.productCount} products
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Started{" "}
                                {operation.startedAt
                                  ? new Date(
                                      operation.startedAt,
                                    ).toLocaleString()
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {operation.status === "running" && (
                              <div className="w-32">
                                <Progress
                                  value={operation.progress}
                                  className="h-2"
                                />
                                <p className="text-xs text-center mt-1">
                                  {Math.round(operation.progress)}%
                                </p>
                              </div>
                            )}
                            <Badge
                              variant={
                                operation.status === "completed"
                                  ? "default"
                                  : operation.status === "running"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={getOperationStatusColor(
                                operation.status,
                              )}
                            >
                              {operation.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

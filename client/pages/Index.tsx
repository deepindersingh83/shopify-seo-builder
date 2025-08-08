import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { Layout } from "@/components/Layout";
import AdvancedFilters from "@/components/AdvancedFilters";
import BulkOperations from "@/components/BulkOperations";
import SEOAutomation from "@/components/SEOAutomation";
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

// SEO Score calculation function
const calculateSEOScore = (product: Product): number => {
  let score = 0;
  const maxScore = 100;

  // Title optimization (25 points)
  if (
    product.title &&
    product.title.length >= 10 &&
    product.title.length <= 60
  ) {
    score += 25;
  } else if (product.title && product.title.length > 0) {
    score += 10;
  }

  // Meta title (20 points)
  if (
    product.metaTitle &&
    product.metaTitle.length >= 30 &&
    product.metaTitle.length <= 60
  ) {
    score += 20;
  } else if (product.metaTitle && product.metaTitle.length > 0) {
    score += 10;
  }

  // Meta description (20 points)
  if (
    product.metaDescription &&
    product.metaDescription.length >= 120 &&
    product.metaDescription.length <= 160
  ) {
    score += 20;
  } else if (product.metaDescription && product.metaDescription.length > 0) {
    score += 10;
  }

  // Product description (15 points)
  if (product.description && product.description.length >= 100) {
    score += 15;
  } else if (product.description && product.description.length > 0) {
    score += 8;
  }

  // Handle/URL optimization (10 points)
  if (
    product.handle &&
    product.handle.length <= 50 &&
    !product.handle.includes("_")
  ) {
    score += 10;
  } else if (product.handle) {
    score += 5;
  }

  // Tags optimization (10 points)
  if (product.tags && product.tags.length >= 3 && product.tags.length <= 10) {
    score += 10;
  } else if (product.tags && product.tags.length > 0) {
    score += 5;
  }

  return Math.min(score, maxScore);
};

const getSEOScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getSEOScoreBadge = (score: number) => {
  if (score >= 80) return { variant: "default" as const, label: "Excellent" };
  if (score >= 60) return { variant: "secondary" as const, label: "Good" };
  return { variant: "destructive" as const, label: "Needs Work" };
};

// Mock data generator for 150K+ products
const generateMockProducts = (page: number, limit: number): Product[] => {
  const statuses: ("active" | "draft" | "archived")[] = [
    "active",
    "draft",
    "archived",
  ];
  const vendors = [
    "Nike",
    "Adidas",
    "Apple",
    "Samsung",
    "Sony",
    "Microsoft",
    "Amazon",
    "Google",
  ];
  const productTypes = [
    "Electronics",
    "Clothing",
    "Shoes",
    "Accessories",
    "Home & Garden",
    "Sports",
    "Beauty",
    "Books",
  ];
  const descriptions = [
    "High-quality product designed for modern consumers with exceptional durability and style.",
    "Premium offering that combines functionality with aesthetic appeal for the discerning customer.",
    "Innovative solution that meets the demands of today's fast-paced lifestyle with reliability.",
    "Expertly crafted item featuring cutting-edge technology and timeless design elements.",
  ];

  return Array.from({ length: limit }, (_, i) => {
    const id = `product-${page * limit + i + 1}`;
    const basePrice = Math.floor(Math.random() * 500) + 10;
    const title = `Product ${page * limit + i + 1} - ${productTypes[Math.floor(Math.random() * productTypes.length)]}`;
    const handle = `product-${page * limit + i + 1}`;
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)];
    const metaTitle =
      Math.random() > 0.5 ? `${title} | Best Quality` : undefined;
    const metaDescription =
      Math.random() > 0.3 ? `${description.substring(0, 140)}...` : undefined;

    const product: Product = {
      id,
      title,
      handle,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      productType:
        productTypes[Math.floor(Math.random() * productTypes.length)],
      tags: [
        `tag-${Math.floor(Math.random() * 10)}`,
        `category-${Math.floor(Math.random() * 5)}`,
      ],
      price: basePrice,
      compareAtPrice:
        Math.random() > 0.7
          ? basePrice + Math.floor(Math.random() * 100)
          : undefined,
      inventory: Math.floor(Math.random() * 1000),
      image: `https://picsum.photos/400/400?random=${page * limit + i + 1}`,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      description,
      metaTitle,
      metaDescription,
      seoScore: 0,
    };

    product.seoScore = calculateSEOScore(product);
    return product;
  });
};

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [productTypeFilter, setProductTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    product: true,
    status: true,
    vendor: true,
    inventory: true,
    price: true,
    seoScore: true,
    actions: true,
  });

  // Bulk edit form state
  const [bulkEditData, setBulkEditData] = useState({
    status: "",
    vendor: "",
    productType: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    description: "",
  });

  const itemsPerPage = 50;
  const totalProducts = 152847; // Mock total for 150K+

  useEffect(() => {
    loadProducts(1);
  }, []);

  const loadProducts = async (page: number) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newProducts = generateMockProducts(page - 1, itemsPerPage);
    setProducts(newProducts);
    setCurrentPage(page);
    setIsLoading(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      const matchesVendor =
        vendorFilter === "all" || product.vendor === vendorFilter;
      const matchesType =
        productTypeFilter === "all" ||
        product.productType === productTypeFilter;

      return matchesSearch && matchesStatus && matchesVendor && matchesType;
    });
  }, [products, searchQuery, statusFilter, vendorFilter, productTypeFilter]);

  const uniqueVendors = [...new Set(products.map((p) => p.vendor))];
  const uniqueProductTypes = [...new Set(products.map((p) => p.productType))];

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

  const handleBulkEdit = () => {
    // Apply bulk edit changes to selected products
    const updatedProducts = products.map((product) => {
      if (selectedProducts.has(product.id)) {
        const updated = { ...product };
        if (bulkEditData.status) updated.status = bulkEditData.status as any;
        if (bulkEditData.vendor) updated.vendor = bulkEditData.vendor;
        if (bulkEditData.productType)
          updated.productType = bulkEditData.productType;
        if (bulkEditData.metaTitle) updated.metaTitle = bulkEditData.metaTitle;
        if (bulkEditData.metaDescription)
          updated.metaDescription = bulkEditData.metaDescription;
        if (bulkEditData.description)
          updated.description = bulkEditData.description;
        if (bulkEditData.tags) {
          updated.tags = bulkEditData.tags.split(",").map((tag) => tag.trim());
        }

        // Recalculate SEO score
        updated.seoScore = calculateSEOScore(updated);
        return updated;
      }
      return product;
    });

    setProducts(updatedProducts);
    setShowBulkEditModal(false);
    setSelectedProducts(new Set());
    setBulkEditData({
      status: "",
      vendor: "",
      productType: "",
      tags: "",
      metaTitle: "",
      metaDescription: "",
      description: "",
    });
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const getGridCols = () => {
    const visibleColumns =
      Object.values(columnVisibility).filter(Boolean).length;
    return `grid-cols-${Math.max(visibleColumns, 1)}`;
  };

  const averageSEOScore = Math.round(
    products.reduce((sum, p) => sum + p.seoScore, 0) / products.length || 0,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Product Manager
                </h1>
                <p className="text-sm text-muted-foreground">
                  Bulk edit and manage your inventory
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/workflows">
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Workflow Automation
                </Button>
              </Link>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-medium">
                  {totalProducts.toLocaleString()}
                </span>
                <span>total products</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-medium">
                  {totalProducts.toLocaleString()}
                </span>
                <span>total products</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalProducts.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89,432</div>
              <p className="text-xs text-muted-foreground">
                85% of total inventory
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-destructive">Needs attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$127.50</div>
              <p className="text-xs text-muted-foreground">
                +5.2% vs last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. SEO Score
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${getSEOScoreColor(averageSEOScore)}`}
              >
                {averageSEOScore}/100
              </div>
              <p className="text-xs text-muted-foreground">
                SEO optimization level
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, handles, or vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={vendorFilter} onValueChange={setVendorFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {uniqueVendors.map((vendor) => (
                      <SelectItem key={vendor} value={vendor}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={productTypeFilter}
                  onValueChange={setProductTypeFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueProductTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 ml-auto">
                  {/* Column Visibility */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Columns className="h-4 w-4 mr-2" />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem
                        checked={columnVisibility.product}
                        onCheckedChange={() =>
                          toggleColumnVisibility("product")
                        }
                      >
                        Product
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={columnVisibility.status}
                        onCheckedChange={() => toggleColumnVisibility("status")}
                      >
                        Status
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={columnVisibility.vendor}
                        onCheckedChange={() => toggleColumnVisibility("vendor")}
                      >
                        Vendor
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={columnVisibility.inventory}
                        onCheckedChange={() =>
                          toggleColumnVisibility("inventory")
                        }
                      >
                        Inventory
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={columnVisibility.price}
                        onCheckedChange={() => toggleColumnVisibility("price")}
                      >
                        Price
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={columnVisibility.seoScore}
                        onCheckedChange={() =>
                          toggleColumnVisibility("seoScore")
                        }
                      >
                        SEO Score
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={columnVisibility.actions}
                        onCheckedChange={() =>
                          toggleColumnVisibility("actions")
                        }
                      >
                        Actions
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedProducts.size > 0 && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">
                    {selectedProducts.size} product
                    {selectedProducts.size !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog
                    open={showBulkEditModal}
                    onOpenChange={setShowBulkEditModal}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Bulk Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Bulk Edit Products</DialogTitle>
                        <DialogDescription>
                          Edit {selectedProducts.size} selected products. Only
                          fill in the fields you want to update.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Basic Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="status">Status</Label>
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
                                  <SelectItem value="">No change</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="archived">
                                    Archived
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="vendor">Vendor</Label>
                              <Input
                                id="vendor"
                                placeholder="Vendor name"
                                value={bulkEditData.vendor}
                                onChange={(e) =>
                                  setBulkEditData((prev) => ({
                                    ...prev,
                                    vendor: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="productType">Product Type</Label>
                              <Input
                                id="productType"
                                placeholder="Product type"
                                value={bulkEditData.productType}
                                onChange={(e) =>
                                  setBulkEditData((prev) => ({
                                    ...prev,
                                    productType: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="tags">
                                Tags (comma-separated)
                              </Label>
                              <Input
                                id="tags"
                                placeholder="tag1, tag2, tag3"
                                value={bulkEditData.tags}
                                onChange={(e) =>
                                  setBulkEditData((prev) => ({
                                    ...prev,
                                    tags: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* SEO Optimization */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Target className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">
                              SEO Optimization
                            </h3>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="metaTitle">Meta Title</Label>
                              <Input
                                id="metaTitle"
                                placeholder="SEO optimized title (30-60 characters)"
                                value={bulkEditData.metaTitle}
                                onChange={(e) =>
                                  setBulkEditData((prev) => ({
                                    ...prev,
                                    metaTitle: e.target.value,
                                  }))
                                }
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {bulkEditData.metaTitle.length}/60 characters
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="metaDescription">
                                Meta Description
                              </Label>
                              <Textarea
                                id="metaDescription"
                                placeholder="SEO optimized description (120-160 characters)"
                                value={bulkEditData.metaDescription}
                                onChange={(e) =>
                                  setBulkEditData((prev) => ({
                                    ...prev,
                                    metaDescription: e.target.value,
                                  }))
                                }
                                rows={3}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {bulkEditData.metaDescription.length}/160
                                characters
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="description">
                                Product Description
                              </Label>
                              <Textarea
                                id="description"
                                placeholder="Detailed product description"
                                value={bulkEditData.description}
                                onChange={(e) =>
                                  setBulkEditData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                rows={4}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowBulkEditModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleBulkEdit}>
                          Update {selectedProducts.size} Product
                          {selectedProducts.size !== 1 ? "s" : ""}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of{" "}
                  {Math.ceil(totalProducts / itemsPerPage)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="border rounded-lg">
                  <div className="flex items-center px-4 py-3 border-b bg-muted/50">
                    <Checkbox
                      checked={
                        selectedProducts.size === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onCheckedChange={toggleAllProducts}
                      className="mr-4"
                    />
                    <div
                      className="grid gap-4 flex-1 text-sm font-medium text-muted-foreground"
                      style={{
                        gridTemplateColumns:
                          `${columnVisibility.product ? "4fr" : ""} ${columnVisibility.status ? "2fr" : ""} ${columnVisibility.vendor ? "2fr" : ""} ${columnVisibility.inventory ? "1fr" : ""} ${columnVisibility.price ? "2fr" : ""} ${columnVisibility.seoScore ? "2fr" : ""} ${columnVisibility.actions ? "1fr" : ""}`.trim(),
                      }}
                    >
                      {columnVisibility.product && <div>Product</div>}
                      {columnVisibility.status && <div>Status</div>}
                      {columnVisibility.vendor && <div>Vendor</div>}
                      {columnVisibility.inventory && <div>Inventory</div>}
                      {columnVisibility.price && <div>Price</div>}
                      {columnVisibility.seoScore && <div>SEO Score</div>}
                      {columnVisibility.actions && <div>Actions</div>}
                    </div>
                  </div>

                  {/* Product Rows */}
                  <div className="divide-y">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center px-4 py-4 hover:bg-muted/30"
                      >
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() =>
                            toggleProductSelection(product.id)
                          }
                          className="mr-4"
                        />
                        <div
                          className="grid gap-4 flex-1"
                          style={{
                            gridTemplateColumns:
                              `${columnVisibility.product ? "4fr" : ""} ${columnVisibility.status ? "2fr" : ""} ${columnVisibility.vendor ? "2fr" : ""} ${columnVisibility.inventory ? "1fr" : ""} ${columnVisibility.price ? "2fr" : ""} ${columnVisibility.seoScore ? "2fr" : ""} ${columnVisibility.actions ? "1fr" : ""}`.trim(),
                          }}
                        >
                          {/* Product Info */}
                          {columnVisibility.product && (
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-foreground">
                                  {product.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {product.handle}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Status */}
                          {columnVisibility.status && (
                            <div className="flex items-center">
                              <Badge
                                variant={getStatusBadgeVariant(product.status)}
                              >
                                {product.status}
                              </Badge>
                            </div>
                          )}

                          {/* Vendor */}
                          {columnVisibility.vendor && (
                            <div className="flex items-center">
                              <span className="text-sm">{product.vendor}</span>
                            </div>
                          )}

                          {/* Inventory */}
                          {columnVisibility.inventory && (
                            <div className="flex items-center">
                              <span
                                className={`text-sm ${product.inventory < 10 ? "text-destructive" : "text-foreground"}`}
                              >
                                {product.inventory}
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          {columnVisibility.price && (
                            <div className="flex items-center">
                              <div>
                                <span className="text-sm font-medium">
                                  ${product.price}
                                </span>
                                {product.compareAtPrice && (
                                  <span className="text-xs text-muted-foreground line-through ml-2">
                                    ${product.compareAtPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* SEO Score */}
                          {columnVisibility.seoScore && (
                            <div className="flex items-center space-x-2">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span
                                    className={getSEOScoreColor(
                                      product.seoScore,
                                    )}
                                  >
                                    {product.seoScore}/100
                                  </span>
                                  {product.seoScore >= 80 ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                                  )}
                                </div>
                                <Progress
                                  value={product.seoScore}
                                  className="h-2"
                                />
                                <Badge
                                  variant={
                                    getSEOScoreBadge(product.seoScore).variant
                                  }
                                  className="text-xs mt-1"
                                >
                                  {getSEOScoreBadge(product.seoScore).label}
                                </Badge>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          {columnVisibility.actions && (
                            <div className="flex items-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/product/${product.id}/edit`}>
                                      <Edit3 className="h-4 w-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Target className="h-4 w-4 mr-2" />
                                    Optimize SEO
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
                    {totalProducts.toLocaleString()} products
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadProducts(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadProducts(currentPage + 1)}
                      disabled={
                        currentPage >=
                          Math.ceil(totalProducts / itemsPerPage) || isLoading
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

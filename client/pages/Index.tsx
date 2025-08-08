import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Grid, List, MoreHorizontal, Edit3, Trash2, Eye, Package, ShoppingCart, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

// Mock data generator for 150K+ products
const generateMockProducts = (page: number, limit: number): Product[] => {
  const statuses: ("active" | "draft" | "archived")[] = ["active", "draft", "archived"];
  const vendors = ["Nike", "Adidas", "Apple", "Samsung", "Sony", "Microsoft", "Amazon", "Google"];
  const productTypes = ["Electronics", "Clothing", "Shoes", "Accessories", "Home & Garden", "Sports", "Beauty", "Books"];
  
  return Array.from({ length: limit }, (_, i) => {
    const id = `product-${page * limit + i + 1}`;
    const basePrice = Math.floor(Math.random() * 500) + 10;
    return {
      id,
      title: `Product ${page * limit + i + 1} - ${productTypes[Math.floor(Math.random() * productTypes.length)]}`,
      handle: `product-${page * limit + i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      productType: productTypes[Math.floor(Math.random() * productTypes.length)],
      tags: [`tag-${Math.floor(Math.random() * 10)}`, `category-${Math.floor(Math.random() * 5)}`],
      price: basePrice,
      compareAtPrice: Math.random() > 0.7 ? basePrice + Math.floor(Math.random() * 100) : undefined,
      inventory: Math.floor(Math.random() * 1000),
      image: `https://picsum.photos/400/400?random=${page * limit + i + 1}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    };
  });
};

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [productTypeFilter, setProductTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const itemsPerPage = 50;
  const totalProducts = 152847; // Mock total for 150K+

  useEffect(() => {
    loadProducts(1);
  }, []);

  const loadProducts = async (page: number) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProducts = generateMockProducts(page - 1, itemsPerPage);
    setProducts(newProducts);
    setCurrentPage(page);
    setIsLoading(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      const matchesVendor = vendorFilter === "all" || product.vendor === vendorFilter;
      const matchesType = productTypeFilter === "all" || product.productType === productTypeFilter;
      
      return matchesSearch && matchesStatus && matchesVendor && matchesType;
    });
  }, [products, searchQuery, statusFilter, vendorFilter, productTypeFilter]);

  const uniqueVendors = [...new Set(products.map(p => p.vendor))];
  const uniqueProductTypes = [...new Set(products.map(p => p.productType))];

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
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "draft": return "secondary";
      case "archived": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Product Manager</h1>
                <p className="text-sm text-muted-foreground">Bulk edit and manage your inventory</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-medium">{totalProducts.toLocaleString()}</span>
                <span>total products</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89,432</div>
              <p className="text-xs text-muted-foreground">85% of total inventory</p>
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
              <p className="text-xs text-muted-foreground">+5.2% vs last period</p>
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
                    {uniqueVendors.map(vendor => (
                      <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueProductTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 ml-auto">
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
                    {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </Button>
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
                  Page {currentPage} of {Math.ceil(totalProducts / itemsPerPage)}
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
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onCheckedChange={toggleAllProducts}
                      className="mr-4"
                    />
                    <div className="grid grid-cols-12 gap-4 flex-1 text-sm font-medium text-muted-foreground">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Vendor</div>
                      <div className="col-span-1">Inventory</div>
                      <div className="col-span-2">Price</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                  </div>

                  {/* Product Rows */}
                  <div className="divide-y">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center px-4 py-4 hover:bg-muted/30">
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() => toggleProductSelection(product.id)}
                          className="mr-4"
                        />
                        <div className="grid grid-cols-12 gap-4 flex-1">
                          {/* Product Info */}
                          <div className="col-span-4 flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-foreground">{product.title}</p>
                              <p className="text-sm text-muted-foreground">{product.handle}</p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-2 flex items-center">
                            <Badge variant={getStatusBadgeVariant(product.status)}>
                              {product.status}
                            </Badge>
                          </div>

                          {/* Vendor */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm">{product.vendor}</span>
                          </div>

                          {/* Inventory */}
                          <div className="col-span-1 flex items-center">
                            <span className={`text-sm ${product.inventory < 10 ? 'text-destructive' : 'text-foreground'}`}>
                              {product.inventory}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 flex items-center">
                            <div>
                              <span className="text-sm font-medium">${product.price}</span>
                              {product.compareAtPrice && (
                                <span className="text-xs text-muted-foreground line-through ml-2">
                                  ${product.compareAtPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex items-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts.toLocaleString()} products
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
                      disabled={currentPage >= Math.ceil(totalProducts / itemsPerPage) || isLoading}
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

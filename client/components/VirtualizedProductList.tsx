import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  FixedSizeList as List,
  VariableSizeList,
  ListChildComponentProps,
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  Search,
  Filter,
  Grid,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { performanceService } from "@/services/performanceService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

interface VirtualizedProductListProps {
  onProductSelect?: (product: Product) => void;
  onBulkSelect?: (products: Product[]) => void;
  filters?: any;
  searchQuery?: string;
  sortBy?: { field: string; direction: "asc" | "desc" };
  itemHeight?: number;
  enableSelection?: boolean;
  enableBulkOperations?: boolean;
  viewMode?: "list" | "grid";
  pageSize?: number;
}

interface LoadedItem {
  product?: Product;
  isLoading?: boolean;
  error?: string;
}

const ITEM_HEIGHT = 80; // Height in pixels for each row
const GRID_ITEM_HEIGHT = 200; // Height for grid items
const OVERSCAN_COUNT = 5; // Number of items to render outside visible area
const LOAD_BATCH_SIZE = 50; // Number of items to load per batch

const VirtualizedProductList: React.FC<VirtualizedProductListProps> = ({
  onProductSelect,
  onBulkSelect,
  filters = {},
  searchQuery = "",
  sortBy = { field: "updatedAt", direction: "desc" },
  itemHeight = ITEM_HEIGHT,
  enableSelection = false,
  enableBulkOperations = false,
  viewMode = "list",
  pageSize = 50,
}) => {
  const [items, setItems] = useState<LoadedItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loadedRanges, setLoadedRanges] = useState<Set<string>>(new Set());

  const listRef = useRef<any>(null);
  const loaderRef = useRef<InfiniteLoader>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoized search function with debouncing
  const debouncedSearch = useMemo(
    () => performanceService.createOptimizedSearch(loadProducts, 300),
    [filters, sortBy],
  );

  // Load products function
  async function loadProducts(
    query: string,
    currentFilters: any = filters,
  ): Promise<Product[]> {
    try {
      const response = await fetch("/api/products/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          filters: currentFilters,
          sortBy,
          limit: pageSize,
        }),
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) throw new Error("Failed to load products");

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        throw error;
      }
      return [];
    }
  }

  // Load items for a specific range
  const loadRange = useCallback(
    async (startIndex: number, stopIndex: number) => {
      const rangeKey = `${startIndex}-${stopIndex}`;

      if (loadedRanges.has(rangeKey)) {
        return; // Already loaded or loading
      }

      setLoadedRanges((prev) => new Set(prev).add(rangeKey));

      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        // Mark items as loading
        setItems((prevItems) => {
          const newItems = [...prevItems];
          for (let i = startIndex; i <= stopIndex; i++) {
            if (!newItems[i]) {
              newItems[i] = { isLoading: true };
            }
          }
          return newItems;
        });

        const response = await performanceService.getPaginatedData<Product>(
          "products",
          Math.floor(startIndex / pageSize) + 1,
          { ...filters, query: searchQuery },
          sortBy,
        );

        // Update items with loaded data
        setItems((prevItems) => {
          const newItems = [...prevItems];
          const loadedProducts = response.data;

          loadedProducts.forEach((product, index) => {
            const itemIndex = startIndex + index;
            if (itemIndex <= stopIndex) {
              newItems[itemIndex] = { product };
            }
          });

          return newItems;
        });

        // Update total count if provided
        if (response.totalCount !== undefined) {
          setTotalCount(response.totalCount);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to load product range:", error);

          // Mark items with error
          setItems((prevItems) => {
            const newItems = [...prevItems];
            for (let i = startIndex; i <= stopIndex; i++) {
              newItems[i] = { error: error.message };
            }
            return newItems;
          });
        }
      }
    },
    [filters, searchQuery, sortBy, pageSize, loadedRanges],
  );

  // Check if item is loaded
  const isItemLoaded = useCallback(
    (index: number): boolean => {
      return !!(items[index] && (items[index].product || items[index].error));
    },
    [items],
  );

  // Initial load and search effect
  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      setItems([]);
      setLoadedRanges(new Set());

      try {
        const results = await debouncedSearch(searchQuery, filters);

        // Get total count from API
        const countResponse = await fetch("/api/products/count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery, filters }),
        });

        if (countResponse.ok) {
          const { count } = await countResponse.json();
          setTotalCount(count);

          // Initialize items array with placeholders
          setItems(new Array(count).fill(null).map(() => ({})));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, filters, sortBy, debouncedSearch]);

  // Handle item selection
  const handleItemSelect = useCallback(
    (product: Product, selected: boolean) => {
      if (!enableSelection) return;

      setSelectedItems((prev) => {
        const newSelection = new Set(prev);
        if (selected) {
          newSelection.add(product.id);
        } else {
          newSelection.delete(product.id);
        }
        return newSelection;
      });

      if (onProductSelect) {
        onProductSelect(product);
      }
    },
    [enableSelection, onProductSelect],
  );

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!enableBulkOperations) return;

    const allProductIds = items
      .filter((item) => item.product)
      .map((item) => item.product!.id);

    setSelectedItems(new Set(allProductIds));

    if (onBulkSelect) {
      const selectedProducts = items
        .filter(
          (item) => item.product && allProductIds.includes(item.product.id),
        )
        .map((item) => item.product!);
      onBulkSelect(selectedProducts);
    }
  }, [items, enableBulkOperations, onBulkSelect]);

  // Render list item
  const ListItem: React.FC<ListChildComponentProps> = ({ index, style }) => {
    const item = items[index];
    const isSelected = item?.product
      ? selectedItems.has(item.product.id)
      : false;

    if (!item) {
      return (
        <div style={style} className="flex items-center p-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="ml-4 flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      );
    }

    if (item.isLoading) {
      return (
        <div style={style} className="flex items-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      );
    }

    if (item.error) {
      return (
        <div style={style} className="flex items-center p-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <span className="ml-2 text-destructive">{item.error}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadRange(index, index)}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (!item.product) {
      return (
        <div style={style} className="flex items-center p-4">
          <span className="text-muted-foreground">No data</span>
        </div>
      );
    }

    const { product } = item;

    return (
      <div
        style={style}
        className={`flex items-center p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
          isSelected ? "bg-primary/10 border-primary" : ""
        }`}
        onClick={() => handleItemSelect(product, !isSelected)}
      >
        {enableSelection && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => handleItemSelect(product, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="mr-3"
          />
        )}

        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="h-12 w-12 rounded object-cover"
          loading="lazy"
        />

        <div className="ml-4 flex-1 min-w-0">
          <h3 className="font-medium truncate">{product.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {product.vendor} • {product.productType}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant={
              product.status === "active"
                ? "default"
                : product.status === "draft"
                  ? "secondary"
                  : "outline"
            }
          >
            {product.status}
          </Badge>

          <Badge
            variant={
              product.seoScore >= 80
                ? "default"
                : product.seoScore >= 60
                  ? "secondary"
                  : "destructive"
            }
          >
            SEO: {product.seoScore}
          </Badge>

          <span className="font-medium">${product.price}</span>
        </div>
      </div>
    );
  };

  // Render grid item
  const GridItem: React.FC<ListChildComponentProps> = ({ index, style }) => {
    const item = items[index];
    const isSelected = item?.product
      ? selectedItems.has(item.product.id)
      : false;

    if (!item?.product) {
      return (
        <div style={style} className="p-2">
          <Card className="h-full">
            <CardContent className="p-4">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        </div>
      );
    }

    const { product } = item;

    return (
      <div style={style} className="p-2">
        <Card
          className={`h-full cursor-pointer transition-all hover:shadow-md ${
            isSelected ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleItemSelect(product, !isSelected)}
        >
          <CardContent className="p-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="h-32 w-full rounded object-cover mb-4"
              loading="lazy"
            />

            <h3 className="font-medium truncate mb-2">{product.title}</h3>
            <p className="text-sm text-muted-foreground truncate mb-3">
              {product.vendor}
            </p>

            <div className="flex items-center justify-between">
              <Badge
                variant={product.status === "active" ? "default" : "secondary"}
              >
                {product.status}
              </Badge>
              <span className="font-medium">${product.price}</span>
            </div>

            <div className="mt-2">
              <Badge
                variant={
                  product.seoScore >= 80
                    ? "default"
                    : product.seoScore >= 60
                      ? "secondary"
                      : "destructive"
                }
                className="w-full justify-center"
              >
                SEO Score: {product.seoScore}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (error && totalCount === 0) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls */}
      <div className="p-4 border-b space-y-4">
        {enableBulkOperations && selectedItems.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {selectedItems.size} item(s) selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedItems(new Set())}
            >
              Clear Selection
            </Button>
            <Button size="sm" onClick={handleSelectAll}>
              Select All Visible
            </Button>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Total: {totalCount.toLocaleString()} products</span>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      {/* Virtualized list */}
      <div className="flex-1">
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              ref={loaderRef}
              isItemLoaded={isItemLoaded}
              itemCount={totalCount}
              loadMoreItems={loadRange}
              threshold={OVERSCAN_COUNT}
            >
              {({ onItemsRendered, ref }) =>
                viewMode === "list" ? (
                  <List
                    ref={(list) => {
                      ref(list);
                      listRef.current = list;
                    }}
                    height={height}
                    width={width}
                    itemCount={totalCount}
                    itemSize={itemHeight}
                    onItemsRendered={onItemsRendered}
                    overscanCount={OVERSCAN_COUNT}
                  >
                    {ListItem}
                  </List>
                ) : (
                  <VariableSizeList
                    ref={(list) => {
                      ref(list);
                      listRef.current = list;
                    }}
                    height={height}
                    width={width}
                    itemCount={Math.ceil(totalCount / 3)} // 3 items per row
                    itemSize={() => GRID_ITEM_HEIGHT}
                    onItemsRendered={onItemsRendered}
                    overscanCount={OVERSCAN_COUNT}
                  >
                    {GridItem}
                  </VariableSizeList>
                )
              }
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default VirtualizedProductList;
export type { Product, VirtualizedProductListProps };

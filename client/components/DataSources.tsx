import { useState, useEffect } from "react";
import {
  Database,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Sync,
  Eye,
  Edit,
  Trash2,
  Activity,
  MoreHorizontal,
  ArrowUpDown,
  Clock,
  ShoppingBag,
  ExternalLink,
  Zap,
  Shield,
  Globe,
  Search,
  Filter,
  Star,
  TrendingUp,
  Package,
  Image,
  FileText,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface DataSource {
  id: string;
  name: string;
  type: 'icecat' | 'google_merchant' | 'amazon_api' | 'alibaba' | 'shopify_exchange' | 'custom_api';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  credentials: any;
  settings: {
    autoSync: boolean;
    syncInterval: number;
    dataFields: string[];
    qualityThreshold: number;
    enableEnrichment: boolean;
    updateExisting: boolean;
  };
  lastSync?: string;
  stats: {
    totalProducts: number;
    enrichedProducts: number;
    errorCount: number;
    successRate: number;
  };
}

interface ProductEnrichment {
  productId: string;
  sourceId: string;
  enrichedFields: {
    field: string;
    originalValue: string;
    enrichedValue: string;
    confidence: number;
    source: string;
  }[];
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

export function DataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [enrichments, setEnrichments] = useState<ProductEnrichment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [activeSyncs, setActiveSyncs] = useState<{ [key: string]: any }>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadDataSources();
    loadEnrichments();
  }, []);

  const loadDataSources = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockDataSources: DataSource[] = [
        {
          id: '1',
          name: 'Icecat Product Database',
          type: 'icecat',
          status: 'connected',
          credentials: {
            apiKey: 'ic_xxxxxxxxxx',
            username: 'user@example.com',
            language: 'EN'
          },
          settings: {
            autoSync: true,
            syncInterval: 240, // 4 hours
            dataFields: ['description', 'specifications', 'images', 'categories', 'features'],
            qualityThreshold: 80,
            enableEnrichment: true,
            updateExisting: true
          },
          lastSync: new Date(Date.now() - 3600000).toISOString(),
          stats: {
            totalProducts: 45623,
            enrichedProducts: 38291,
            errorCount: 245,
            successRate: 96.8
          }
        },
        {
          id: '2',
          name: 'Google Merchant Center',
          type: 'google_merchant',
          status: 'connected',
          credentials: {
            accountId: '123456789',
            accessToken: 'ya29.xxxxxxxxxx'
          },
          settings: {
            autoSync: true,
            syncInterval: 60,
            dataFields: ['gtin', 'mpn', 'brand', 'categories', 'price_data'],
            qualityThreshold: 70,
            enableEnrichment: true,
            updateExisting: false
          },
          lastSync: new Date(Date.now() - 1800000).toISOString(),
          stats: {
            totalProducts: 12453,
            enrichedProducts: 11892,
            errorCount: 67,
            successRate: 99.2
          }
        },
        {
          id: '3',
          name: 'Amazon Product API',
          type: 'amazon_api',
          status: 'disconnected',
          credentials: {
            accessKey: 'AKIAXXXXXXXXXX',
            secretKey: 'xxxxxxxxxx',
            associateTag: 'tag-20'
          },
          settings: {
            autoSync: false,
            syncInterval: 120,
            dataFields: ['reviews', 'ratings', 'pricing', 'availability'],
            qualityThreshold: 75,
            enableEnrichment: true,
            updateExisting: true
          },
          stats: {
            totalProducts: 0,
            enrichedProducts: 0,
            errorCount: 0,
            successRate: 0
          }
        },
        {
          id: '4',
          name: 'Alibaba Product Data',
          type: 'alibaba',
          status: 'error',
          credentials: {
            appKey: 'xxxxxxxxxx',
            secretKey: 'xxxxxxxxxx'
          },
          settings: {
            autoSync: false,
            syncInterval: 360,
            dataFields: ['supplier_info', 'bulk_pricing', 'minimum_orders'],
            qualityThreshold: 60,
            enableEnrichment: false,
            updateExisting: false
          },
          lastSync: new Date(Date.now() - 86400000).toISOString(),
          stats: {
            totalProducts: 8934,
            enrichedProducts: 5672,
            errorCount: 1234,
            successRate: 63.5
          }
        }
      ];
      
      setDataSources(mockDataSources);
    } catch (error) {
      console.error('Failed to load data sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnrichments = async () => {
    try {
      // Mock enrichment data
      const mockEnrichments: ProductEnrichment[] = [
        {
          productId: 'prod_123',
          sourceId: '1',
          enrichedFields: [
            {
              field: 'description',
              originalValue: 'Basic product description',
              enrichedValue: 'Advanced professional-grade device with premium specifications and industry-leading performance metrics...',
              confidence: 0.94,
              source: 'Icecat'
            },
            {
              field: 'specifications',
              originalValue: '',
              enrichedValue: 'Dimensions: 15.2 x 10.1 x 2.3 cm, Weight: 450g, Material: Aluminum alloy...',
              confidence: 0.89,
              source: 'Icecat'
            }
          ],
          status: 'completed',
          timestamp: new Date().toISOString()
        }
      ];
      
      setEnrichments(mockEnrichments);
    } catch (error) {
      console.error('Failed to load enrichments:', error);
    }
  };

  const handleConnect = async (sourceType: string, credentials: any) => {
    try {
      console.log('Connecting to', sourceType, credentials);
      await loadDataSources();
      setShowConnectDialog(false);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleSync = async (sourceId: string) => {
    try {
      setActiveSyncs(prev => ({ ...prev, [sourceId]: { status: 'running', progress: 0 } }));
      
      // Simulate sync process
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setActiveSyncs(prev => ({ 
          ...prev, 
          [sourceId]: { ...prev[sourceId], progress: i } 
        }));
      }
      
      setActiveSyncs(prev => ({ ...prev, [sourceId]: { status: 'completed', progress: 100 } }));
      
      setTimeout(() => {
        setActiveSyncs(prev => {
          const { [sourceId]: removed, ...rest } = prev;
          return rest;
        });
        loadDataSources();
      }, 2000);
      
    } catch (error) {
      console.error('Sync failed:', error);
      setActiveSyncs(prev => ({ ...prev, [sourceId]: { status: 'failed', progress: 0 } }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Syncing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'icecat':
        return <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Database className="h-5 w-5 text-blue-600" /></div>;
      case 'google_merchant':
        return <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Search className="h-5 w-5 text-green-600" /></div>;
      case 'amazon_api':
        return <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><ShoppingBag className="h-5 w-5 text-orange-600" /></div>;
      case 'alibaba':
        return <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"><Globe className="h-5 w-5 text-yellow-600" /></div>;
      case 'shopify_exchange':
        return <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Package className="h-5 w-5 text-green-600" /></div>;
      default:
        return <Database className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getSourceName = (type: string) => {
    switch (type) {
      case 'icecat': return 'Icecat Product Database';
      case 'google_merchant': return 'Google Merchant Center';
      case 'amazon_api': return 'Amazon Product API';
      case 'alibaba': return 'Alibaba Product Data';
      case 'shopify_exchange': return 'Shopify Product Exchange';
      default: return 'Custom API';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Sources & Enrichment</h2>
          <p className="text-muted-foreground">Connect to product databases and enrich your catalog</p>
        </div>
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Connect Data Source</DialogTitle>
              <DialogDescription>
                Choose a data source and enter your credentials to start enriching products.
              </DialogDescription>
            </DialogHeader>
            <ConnectDataSourceForm 
              onConnect={handleConnect}
              onCancel={() => setShowConnectDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSources.filter(s => s.status === 'connected').length}</div>
            <p className="text-xs text-muted-foreground">
              {dataSources.length} total sources
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Enriched</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dataSources.reduce((sum, s) => sum + s.stats.enrichedProducts, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all data sources
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(dataSources.reduce((sum, s) => sum + s.stats.successRate, 0) / dataSources.length || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average enrichment success
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Sync Active</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSources.filter(s => s.settings.autoSync).length}</div>
            <p className="text-xs text-muted-foreground">
              Sources with auto-sync
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="w-full">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="enrichment">Product Enrichment</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        {/* Data Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          {dataSources.map((source) => {
            const activeSync = activeSyncs[source.id];
            
            return (
              <Card key={source.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getSourceIcon(source.type)}
                      <div>
                        <h3 className="font-semibold">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getSourceName(source.type)}
                        </p>
                        {source.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Last synced: {new Date(source.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(source.status)}
                      
                      {source.settings.autoSync && (
                        <Badge variant="outline" className="text-xs">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Auto-sync
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {activeSync && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Syncing products...</span>
                        <span>{activeSync.progress}%</span>
                      </div>
                      <Progress value={activeSync.progress} />
                    </div>
                  )}
                  
                  {/* Source Stats */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Products:</span>
                      <p className="font-medium">{source.stats.totalProducts.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Enriched:</span>
                      <p className="font-medium">{source.stats.enrichedProducts.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <p className="font-medium">{source.stats.successRate}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Errors:</span>
                      <p className="font-medium">{source.stats.errorCount}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {source.status === 'connected' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSync(source.id)}
                        disabled={!!activeSync}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Activity className="h-4 w-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Test Connection
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Quality Report
                        </DropdownMenuItem>
                        {source.status === 'connected' ? (
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Disconnect
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reconnect
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Data Fields */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Enriched Data Fields:</p>
                    <div className="flex flex-wrap gap-1">
                      {source.settings.dataFields.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {dataSources.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No data sources connected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Connect to product databases like Icecat to automatically enrich your product data.
                </p>
                <Button onClick={() => setShowConnectDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Your First Data Source
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Product Enrichment Tab */}
        <TabsContent value="enrichment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Product Enrichments</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Enrich Selected
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrichments.map((enrichment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">Product {enrichment.productId}</h4>
                        <p className="text-sm text-muted-foreground">
                          Enriched {enrichment.enrichedFields.length} fields from {enrichment.sourceId === '1' ? 'Icecat' : 'Unknown Source'}
                        </p>
                      </div>
                      <Badge variant={enrichment.status === 'completed' ? 'default' : 'secondary'}>
                        {enrichment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {enrichment.enrichedFields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="border rounded p-3 bg-muted/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm capitalize">{field.field.replace('_', ' ')}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(field.confidence * 100)}% confidence
                              </Badge>
                              <span className="text-xs text-muted-foreground">{field.source}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Original:</span>
                              <p className="mt-1 p-2 bg-red-50 rounded">{field.originalValue || 'Empty'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Enriched:</span>
                              <p className="mt-1 p-2 bg-green-50 rounded">{field.enrichedValue}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Quality Tab */}
        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">92%</div>
                  <p className="text-sm text-muted-foreground">Overall Quality Score</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">15,432</div>
                  <p className="text-sm text-muted-foreground">Products with Complete Data</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">1,204</div>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Data Completeness by Field</h4>
                {[
                  { field: 'Product Title', completeness: 98, color: 'bg-green-500' },
                  { field: 'Description', completeness: 87, color: 'bg-blue-500' },
                  { field: 'Images', completeness: 92, color: 'bg-green-500' },
                  { field: 'Specifications', completeness: 76, color: 'bg-yellow-500' },
                  { field: 'Categories', completeness: 89, color: 'bg-blue-500' },
                  { field: 'GTIN/EAN', completeness: 45, color: 'bg-red-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-32 text-sm">{item.field}</div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.completeness}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm text-right">{item.completeness}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Data Sources</CardTitle>
              <p className="text-sm text-muted-foreground">
                Browse and connect to various product data sources
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Icecat', type: 'icecat', description: 'Global product catalog with 12M+ products', price: 'Premium', rating: 4.8 },
                  { name: 'Google Merchant Center', type: 'google_merchant', description: 'Product data from Google Shopping', price: 'Free', rating: 4.6 },
                  { name: 'Amazon Product API', type: 'amazon_api', description: 'Access Amazon product database', price: 'Paid', rating: 4.4 },
                  { name: 'Alibaba Open Platform', type: 'alibaba', description: 'Wholesale product information', price: 'Free', rating: 4.2 },
                  { name: 'Shopify Product Exchange', type: 'shopify_exchange', description: 'Product data from Shopify ecosystem', price: 'Free', rating: 4.5 },
                  { name: 'Custom API', type: 'custom_api', description: 'Connect your own data source', price: 'Custom', rating: 4.0 }
                ].map((source, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        {getSourceIcon(source.type)}
                        <Badge variant={source.price === 'Free' ? 'secondary' : 'outline'}>
                          {source.price}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-2">{source.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{source.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{source.rating}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConnectDataSourceForm({ onConnect, onCancel }: { 
  onConnect: (sourceType: string, credentials: any) => void;
  onCancel: () => void;
}) {
  const [sourceType, setSourceType] = useState('');
  const [credentials, setCredentials] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(sourceType, credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Data Source Type</Label>
        <Select value={sourceType} onValueChange={setSourceType}>
          <SelectTrigger>
            <SelectValue placeholder="Choose data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="icecat">Icecat Product Database</SelectItem>
            <SelectItem value="google_merchant">Google Merchant Center</SelectItem>
            <SelectItem value="amazon_api">Amazon Product API</SelectItem>
            <SelectItem value="alibaba">Alibaba Open Platform</SelectItem>
            <SelectItem value="shopify_exchange">Shopify Product Exchange</SelectItem>
            <SelectItem value="custom_api">Custom API</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sourceType === 'icecat' && (
        <div className="space-y-4">
          <div>
            <Label>API Key</Label>
            <Input 
              placeholder="ic_xxxxxxxxxx"
              value={credentials.apiKey || ''}
              onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input 
              placeholder="your.email@domain.com"
              value={credentials.username || ''}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          <div>
            <Label>Language</Label>
            <Select value={credentials.language || 'EN'} onValueChange={(value) => setCredentials({...credentials, language: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="DE">German</SelectItem>
                <SelectItem value="FR">French</SelectItem>
                <SelectItem value="ES">Spanish</SelectItem>
                <SelectItem value="IT">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {sourceType === 'google_merchant' && (
        <div className="space-y-4">
          <div>
            <Label>Merchant Account ID</Label>
            <Input 
              placeholder="123456789"
              value={credentials.accountId || ''}
              onChange={(e) => setCredentials({...credentials, accountId: e.target.value})}
            />
          </div>
          <div>
            <Label>Access Token</Label>
            <Input 
              type="password"
              placeholder="ya29.xxxxxxxxxx"
              value={credentials.accessToken || ''}
              onChange={(e) => setCredentials({...credentials, accessToken: e.target.value})}
            />
          </div>
        </div>
      )}

      {sourceType === 'custom_api' && (
        <div className="space-y-4">
          <div>
            <Label>API Endpoint URL</Label>
            <Input 
              placeholder="https://api.example.com/products"
              value={credentials.endpoint || ''}
              onChange={(e) => setCredentials({...credentials, endpoint: e.target.value})}
            />
          </div>
          <div>
            <Label>Authentication Method</Label>
            <Select value={credentials.authMethod || 'api_key'} onValueChange={(value) => setCredentials({...credentials, authMethod: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="api_key">API Key</SelectItem>
                <SelectItem value="oauth">OAuth 2.0</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>API Key / Token</Label>
            <Input 
              type="password"
              placeholder="Your API key or token"
              value={credentials.apiKey || ''}
              onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
            />
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!sourceType}>
          Connect Data Source
        </Button>
      </DialogFooter>
    </form>
  );
}

export default DataSources;

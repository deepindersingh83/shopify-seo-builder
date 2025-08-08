import { useState, useEffect } from "react";
import {
  Filter,
  Plus,
  Save,
  Trash2,
  Eye,
  Settings,
  Search,
  X,
  ChevronDown,
  Copy,
  Share,
  Download,
  Upload,
  Star,
  Clock,
  Users,
  MoreHorizontal,
  AlertTriangle,
  Target,
  Package,
  DollarSign,
  Edit,
  Image,
  Zap,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { filterService } from "@/services/filterService";
import { FilterPreset, ProductFilter } from "@shared/workflows";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: ProductFilter[]) => void;
  currentFilters: ProductFilter[];
  resultCount?: number;
}

export function AdvancedFilters({ onFiltersChange, currentFilters, resultCount }: AdvancedFiltersProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [quickFilters, setQuickFilters] = useState<any[]>([]);
  const [filterFields, setFilterFields] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<ProductFilter[]>(currentFilters);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    setActiveFilters(currentFilters);
  }, [currentFilters]);

  const loadFilterData = async () => {
    try {
      const [presetsData, quickFiltersData, fieldsData] = await Promise.all([
        filterService.generateMockFilterPresets(),
        filterService.getQuickFilters(),
        filterService.getFilterFields()
      ]);
      
      setPresets(presetsData);
      setQuickFilters(quickFiltersData);
      setFilterFields(fieldsData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
    }
  };

  const applyQuickFilter = (quickFilter: any) => {
    const newFilters = [...activeFilters, ...quickFilter.filter];
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const applyPreset = async (preset: FilterPreset) => {
    setActiveFilters(preset.filters);
    onFiltersChange(preset.filters);
    
    // Increment usage count
    await filterService.updateFilterPreset(preset.id, {
      usageCount: preset.usageCount + 1
    });
    loadFilterData();
  };

  const removeFilter = (index: number) => {
    const newFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const addCustomFilter = (filter: ProductFilter) => {
    const newFilters = [...activeFilters, filter];
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFiltersChange([]);
  };

  const getFieldLabel = (fieldKey: string) => {
    const field = filterFields.find(f => f.key === fieldKey);
    return field?.label || fieldKey;
  };

  const getOperatorLabel = (operator: string) => {
    const operators = {
      equals: 'equals',
      not_equals: 'does not equal',
      contains: 'contains',
      not_contains: 'does not contain',
      greater_than: 'greater than',
      less_than: 'less than',
      between: 'between',
      in: 'in',
      not_in: 'not in',
      is_empty: 'is empty',
      is_not_empty: 'is not empty',
      starts_with: 'starts with',
      ends_with: 'ends with'
    };
    return operators[operator as keyof typeof operators] || operator;
  };

  const getQuickFilterIcon = (iconName: string) => {
    const icons = {
      AlertTriangle: <AlertTriangle className="h-4 w-4" />,
      Target: <Target className="h-4 w-4" />,
      Package: <Package className="h-4 w-4" />,
      DollarSign: <DollarSign className="h-4 w-4" />,
      Edit: <Edit className="h-4 w-4" />,
      Image: <Image className="h-4 w-4" />
    };
    return icons[iconName as keyof typeof icons] || <Filter className="h-4 w-4" />;
  };

  const filteredPresets = presets.filter(preset => 
    preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Quick Filters</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterBuilder(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Custom Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((quickFilter) => (
              <Button
                key={quickFilter.id}
                variant="outline"
                size="sm"
                onClick={() => applyQuickFilter(quickFilter)}
                className="h-8"
              >
                {getQuickFilterIcon(quickFilter.icon)}
                <span className="ml-1">{quickFilter.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Active Filters ({activeFilters.length})
                {resultCount !== undefined && (
                  <span className="text-muted-foreground ml-2">
                    • {resultCount.toLocaleString()} results
                  </span>
                )}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded border"
                >
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline">{getFieldLabel(filter.field)}</Badge>
                    <span className="text-muted-foreground">{getOperatorLabel(filter.operator)}</span>
                    <Badge variant="secondary">
                      {Array.isArray(filter.value) ? filter.value.join(', ') : String(filter.value)}
                      {filter.value2 && ` - ${filter.value2}`}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Saved Filter Presets</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Tabs defaultValue="my-presets" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="my-presets">My Presets</TabsTrigger>
                  <TabsTrigger value="public-presets">Public</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="my-presets" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search presets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="seo">SEO</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="pricing">Pricing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    {filteredPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm">{preset.name}</h4>
                            {preset.isPublic && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                Public
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {preset.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>{preset.filters.length} filters</span>
                            <span>•</span>
                            <span>Used {preset.usageCount} times</span>
                            <span>•</span>
                            <span>{new Date(preset.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => applyPreset(preset)}
                          >
                            Apply
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="public-presets" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4" />
                    <p>Public presets shared by the community will appear here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Most Used</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">SEO Optimization</p>
                        <p className="text-xs text-muted-foreground">67 uses this month</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Time Saved</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">2.5 hours</p>
                        <p className="text-xs text-muted-foreground">This week</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Filter className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Total Presets</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{presets.length}</p>
                        <p className="text-xs text-muted-foreground">3 added this week</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Save Filter Dialog */}
      <SaveFilterDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        filters={activeFilters}
        onSave={loadFilterData}
      />

      {/* Filter Builder Dialog */}
      <FilterBuilderDialog
        open={showFilterBuilder}
        onOpenChange={setShowFilterBuilder}
        fields={filterFields}
        onAddFilter={addCustomFilter}
      />
    </div>
  );
}

function SaveFilterDialog({ 
  open, 
  onOpenChange, 
  filters, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  filters: ProductFilter[];
  onSave: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSave = async () => {
    try {
      await filterService.saveFilterPreset({
        name,
        description,
        filters,
        isPublic,
        createdBy: 'current-user'
      });
      
      setName('');
      setDescription('');
      setIsPublic(false);
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error('Failed to save filter preset:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Filter Preset</DialogTitle>
          <DialogDescription>
            Save your current filter configuration for future use.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="preset-name">Name</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter preset name..."
            />
          </div>
          
          <div>
            <Label htmlFor="preset-description">Description (optional)</Label>
            <Textarea
              id="preset-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this preset filters for..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="preset-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="preset-public">Make this preset public</Label>
          </div>
          
          <div className="text-sm text-muted-foreground">
            This preset will include {filters.length} filter{filters.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Preset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FilterBuilderDialog({ 
  open, 
  onOpenChange, 
  fields, 
  onAddFilter 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  fields: any[];
  onAddFilter: (filter: ProductFilter) => void;
}) {
  const [selectedField, setSelectedField] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');

  const field = fields.find(f => f.key === selectedField);
  
  const getOperatorsForField = (fieldType: string) => {
    const baseOperators = [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Does not equal' }
    ];
    
    const textOperators = [
      { value: 'contains', label: 'Contains' },
      { value: 'not_contains', label: 'Does not contain' },
      { value: 'starts_with', label: 'Starts with' },
      { value: 'ends_with', label: 'Ends with' }
    ];
    
    const numberOperators = [
      { value: 'greater_than', label: 'Greater than' },
      { value: 'less_than', label: 'Less than' },
      { value: 'between', label: 'Between' }
    ];
    
    const emptyOperators = [
      { value: 'is_empty', label: 'Is empty' },
      { value: 'is_not_empty', label: 'Is not empty' }
    ];

    switch (fieldType) {
      case 'text':
        return [...baseOperators, ...textOperators, ...emptyOperators];
      case 'number':
      case 'range':
        return [...baseOperators, ...numberOperators];
      case 'select':
      case 'multiselect':
        return [...baseOperators, { value: 'in', label: 'In' }, { value: 'not_in', label: 'Not in' }];
      case 'boolean':
        return baseOperators;
      case 'date':
        return [...baseOperators, ...numberOperators];
      default:
        return baseOperators;
    }
  };

  const handleAddFilter = () => {
    if (!selectedField || !selectedOperator) return;

    const filter: ProductFilter = {
      field: selectedField,
      operator: selectedOperator as any,
      value: field?.type === 'number' || field?.type === 'range' ? Number(value) : value,
      ...(selectedOperator === 'between' && { value2: Number(value2) })
    };

    onAddFilter(filter);
    
    // Reset form
    setSelectedField('');
    setSelectedOperator('');
    setValue('');
    setValue2('');
    onOpenChange(false);
  };

  const operators = field ? getOperatorsForField(field.type) : [];
  const needsValue2 = selectedOperator === 'between';
  const needsValue = !['is_empty', 'is_not_empty'].includes(selectedOperator);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Filter</DialogTitle>
          <DialogDescription>
            Create a custom filter condition for your products.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Field</Label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <SelectValue placeholder="Select field to filter by..." />
              </SelectTrigger>
              <SelectContent>
                {['basic', 'seo', 'inventory', 'pricing', 'performance', 'advanced'].map(category => (
                  <div key={category}>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {category}
                    </div>
                    {fields.filter(f => f.category === category).map(field => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedField && (
            <div>
              <Label>Operator</Label>
              <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator..." />
                </SelectTrigger>
                <SelectContent>
                  {operators.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedOperator && needsValue && (
            <div>
              <Label>Value</Label>
              {field?.type === 'select' && field?.options ? (
                <Select value={value} onValueChange={setValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select value..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={field?.placeholder || "Enter value..."}
                  type={field?.type === 'number' || field?.type === 'range' ? 'number' : 'text'}
                />
              )}
            </div>
          )}
          
          {needsValue2 && (
            <div>
              <Label>To Value</Label>
              <Input
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter end value..."
                type="number"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddFilter} 
            disabled={!selectedField || !selectedOperator || (needsValue && !value)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdvancedFilters;

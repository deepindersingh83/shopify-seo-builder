import { useState, useEffect } from "react";
import {
  Globe,
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
  Languages,
  ExternalLink,
  Zap,
  Shield,
  Search,
  Filter,
  Star,
  TrendingUp,
  Package,
  FileText,
  BarChart3,
  MapPin,
  Users,
  Target,
  Bot
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

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
  isDefault: boolean;
}

interface TranslationProject {
  id: string;
  name: string;
  sourceLanguage: string;
  targetLanguages: string[];
  status: 'draft' | 'in_progress' | 'completed' | 'needs_review';
  progress: number;
  productCount: number;
  fieldsToTranslate: string[];
  translationMethod: 'ai' | 'human' | 'hybrid';
  createdAt: string;
  completedAt?: string;
}

interface TranslationTask {
  id: string;
  projectId: string;
  productId: string;
  field: string;
  sourceText: string;
  translatedText: string;
  targetLanguage: string;
  status: 'pending' | 'translated' | 'reviewed' | 'approved';
  confidence: number;
  method: 'ai' | 'human';
  reviewNotes?: string;
}

interface SEOLocalizedContent {
  productId: string;
  language: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  localizedTags: string[];
  handle: string;
  seoScore: number;
  localMarketData: {
    searchVolume: number;
    competition: string;
    suggestedKeywords: string[];
  };
}

interface MarketLocalization {
  language: string;
  country: string;
  marketSize: number;
  competitionLevel: 'low' | 'medium' | 'high';
  topKeywords: string[];
  culturalNotes: string[];
  currencySymbol: string;
  priceRange: { min: number; max: number };
  seasonalTrends: { month: string; trend: number }[];
}

export function MultiLanguageSEO() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [projects, setProjects] = useState<TranslationProject[]>([]);
  const [tasks, setTasks] = useState<TranslationTask[]>([]);
  const [localizedContent, setLocalizedContent] = useState<SEOLocalizedContent[]>([]);
  const [marketData, setMarketData] = useState<MarketLocalization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockLanguages: Language[] = [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', enabled: true, isDefault: true },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', enabled: true, isDefault: false },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', enabled: true, isDefault: false },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', enabled: true, isDefault: false },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', enabled: false, isDefault: false },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', enabled: false, isDefault: false },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', enabled: false, isDefault: false },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', enabled: false, isDefault: false },
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', enabled: false, isDefault: false },
        { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', enabled: false, isDefault: false }
      ];

      const mockProjects: TranslationProject[] = [
        {
          id: '1',
          name: 'Electronics Catalog - EU Markets',
          sourceLanguage: 'en',
          targetLanguages: ['es', 'fr', 'de'],
          status: 'in_progress',
          progress: 67,
          productCount: 450,
          fieldsToTranslate: ['title', 'description', 'metaTitle', 'metaDescription', 'tags'],
          translationMethod: 'hybrid',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: '2',
          name: 'Fashion Collection - Spring 2024',
          sourceLanguage: 'en',
          targetLanguages: ['fr', 'it'],
          status: 'completed',
          progress: 100,
          productCount: 127,
          fieldsToTranslate: ['title', 'description', 'tags'],
          translationMethod: 'ai',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: '3',
          name: 'Home & Garden - Asia Pacific',
          sourceLanguage: 'en',
          targetLanguages: ['ja', 'ko', 'zh'],
          status: 'draft',
          progress: 0,
          productCount: 892,
          fieldsToTranslate: ['title', 'description', 'metaTitle', 'metaDescription'],
          translationMethod: 'human',
          createdAt: new Date().toISOString()
        }
      ];

      const mockMarketData: MarketLocalization[] = [
        {
          language: 'es',
          country: 'Spain',
          marketSize: 47000000,
          competitionLevel: 'medium',
          topKeywords: ['electrónicos', 'tecnología', 'gadgets', 'smartphones', 'ordenadores'],
          culturalNotes: ['Prefer formal language in product descriptions', 'Family-oriented messaging works well'],
          currencySymbol: '€',
          priceRange: { min: 10, max: 2000 },
          seasonalTrends: [
            { month: 'Jan', trend: 85 }, { month: 'Feb', trend: 90 },
            { month: 'Mar', trend: 95 }, { month: 'Apr', trend: 100 }
          ]
        },
        {
          language: 'fr',
          country: 'France',
          marketSize: 67000000,
          competitionLevel: 'high',
          topKeywords: ['électronique', 'technologie', 'appareils', 'smartphone', 'ordinateur'],
          culturalNotes: ['Emphasis on quality and sophistication', 'Eco-friendly messaging resonates'],
          currencySymbol: '€',
          priceRange: { min: 15, max: 2500 },
          seasonalTrends: [
            { month: 'Jan', trend: 90 }, { month: 'Feb', trend: 85 },
            { month: 'Mar', trend: 95 }, { month: 'Apr', trend: 105 }
          ]
        }
      ];

      setLanguages(mockLanguages);
      setProjects(mockProjects);
      setMarketData(mockMarketData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><RefreshCw className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'needs_review':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Eye className="h-3 w-3 mr-1" />Needs Review</Badge>;
      case 'draft':
        return <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'ai':
        return <Badge variant="outline" className="text-blue-600"><Bot className="h-3 w-3 mr-1" />AI Translation</Badge>;
      case 'human':
        return <Badge variant="outline" className="text-green-600"><Users className="h-3 w-3 mr-1" />Human</Badge>;
      case 'hybrid':
        return <Badge variant="outline" className="text-purple-600"><Zap className="h-3 w-3 mr-1" />Hybrid</Badge>;
      default:
        return <Badge variant="secondary">{method}</Badge>;
    }
  };

  const handleStartTranslation = async (projectId: string) => {
    try {
      console.log('Starting translation for project:', projectId);
      // Implementation would go here
    } catch (error) {
      console.error('Failed to start translation:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Multi-Language SEO</h2>
          <p className="text-muted-foreground">Translate and optimize content for global markets</p>
        </div>
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Translation Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Translation Project</DialogTitle>
              <DialogDescription>
                Set up a new project to translate your products for international markets.
              </DialogDescription>
            </DialogHeader>
            <CreateProjectForm onCancel={() => setShowCreateProject(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Languages</CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{languages.filter(l => l.enabled).length}</div>
            <p className="text-xs text-muted-foreground">
              {languages.length} total supported
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Translation Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(p => p.status === 'in_progress').length} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Translated</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.productCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all markets
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Coverage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketData.length}</div>
            <p className="text-xs text-muted-foreground">
              Markets analyzed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Translation Projects</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="markets">Market Analysis</TabsTrigger>
          <TabsTrigger value="optimization">SEO Optimization</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        {/* Translation Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      {getStatusBadge(project.status)}
                      {getMethodBadge(project.translationMethod)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span>
                        <strong>{project.productCount}</strong> products
                      </span>
                      <span>•</span>
                      <span>
                        <strong>{project.sourceLanguage.toUpperCase()}</strong> → <strong>{project.targetLanguages.map(l => l.toUpperCase()).join(', ')}</strong>
                      </span>
                      <span>•</span>
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {project.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      <span className="text-sm text-muted-foreground mr-2">Fields:</span>
                      {project.fieldsToTranslate.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {project.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStartTranslation(project.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Translation
                      </Button>
                    )}
                    
                    {project.status === 'in_progress' && (
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    
                    {project.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
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
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Progress Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Target className="h-4 w-4 mr-2" />
                          SEO Analysis
                        </DropdownMenuItem>
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
          
          {projects.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Languages className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No translation projects</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first translation project to start expanding into global markets.
                </p>
                <Button onClick={() => setShowCreateProject(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Translation Project
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Supported Languages</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((language) => (
                  <div key={language.code} className="border rounded-lg p-4 hover:bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <h4 className="font-medium">{language.name}</h4>
                          <p className="text-sm text-muted-foreground">{language.nativeName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {language.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                        <Switch checked={language.enabled} />
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>SEO Optimized:</span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 1000)} products
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Market Size:</span>
                        <span className="font-medium">
                          {language.enabled ? `${Math.floor(Math.random() * 100)}M users` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Analysis Tab */}
        <TabsContent value="markets" className="space-y-4">
          {marketData.map((market) => (
            <Card key={market.language}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {languages.find(l => l.code === market.language)?.flag}
                    </span>
                    <div>
                      <h3 className="font-semibold">{market.country} Market</h3>
                      <p className="text-sm text-muted-foreground">
                        {market.marketSize.toLocaleString()} potential customers
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    market.competitionLevel === 'low' ? 'default' :
                    market.competitionLevel === 'medium' ? 'secondary' : 'destructive'
                  }>
                    {market.competitionLevel} competition
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Top Keywords</h4>
                    <div className="space-y-1">
                      {market.topKeywords.slice(0, 5).map((keyword, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{keyword}</span>
                          <span className="text-muted-foreground">
                            {Math.floor(Math.random() * 10000)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Min Price:</span>
                        <span>{market.currencySymbol}{market.priceRange.min}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Price:</span>
                        <span>{market.currencySymbol}{market.priceRange.max}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Price:</span>
                        <span>{market.currencySymbol}{Math.round((market.priceRange.min + market.priceRange.max) / 2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Cultural Notes</h4>
                    <div className="text-sm space-y-1">
                      {market.culturalNotes.map((note, index) => (
                        <div key={index} className="text-muted-foreground">
                          • {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Seasonal Trends</h4>
                  <div className="flex space-x-4">
                    {market.seasonalTrends.map((trend, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-muted-foreground">{trend.month}</div>
                        <div className="text-sm font-medium">{trend.trend}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* SEO Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Localized SEO Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languages.filter(l => l.enabled && !l.isDefault).map((language) => (
                  <div key={language.code} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{language.flag}</span>
                        <div>
                          <h4 className="font-medium">{language.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 1000)} products optimized
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          SEO Score: {Math.floor(Math.random() * 40) + 60}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          Optimize
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Translated:</span>
                        <div className="font-medium">{Math.floor(Math.random() * 100)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Localized Keywords:</span>
                        <div className="font-medium">{Math.floor(Math.random() * 50)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Market Ranking:</span>
                        <div className="font-medium">#{Math.floor(Math.random() * 10) + 1}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Control Tab */}
        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Translation Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <p className="text-sm text-muted-foreground">Translation Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">87%</div>
                  <p className="text-sm text-muted-foreground">Cultural Relevance</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">156</div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Recent Quality Issues</h4>
                {[
                  { language: 'Spanish', issue: 'Inconsistent terminology for "smartphone"', severity: 'medium' },
                  { language: 'French', issue: 'Formal/informal language mixing', severity: 'low' },
                  { language: 'German', issue: 'Missing compound word optimization', severity: 'high' }
                ].map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{issue.language}</div>
                      <div className="text-sm text-muted-foreground">{issue.issue}</div>
                    </div>
                    <Badge variant={
                      issue.severity === 'high' ? 'destructive' :
                      issue.severity === 'medium' ? 'secondary' : 'outline'
                    }>
                      {issue.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateProjectForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    sourceLanguage: 'en',
    targetLanguages: [] as string[],
    translationMethod: 'hybrid',
    fieldsToTranslate: [] as string[]
  });

  return (
    <div className="space-y-6">
      <div>
        <Label>Project Name</Label>
        <Input 
          placeholder="e.g., Electronics Catalog - EU Markets"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Source Language</Label>
          <Select value={formData.sourceLanguage} onValueChange={(value) => setFormData({...formData, sourceLanguage: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="es">🇪🇸 Spanish</SelectItem>
              <SelectItem value="fr">🇫🇷 French</SelectItem>
              <SelectItem value="de">🇩🇪 German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Translation Method</Label>
          <Select value={formData.translationMethod} onValueChange={(value) => setFormData({...formData, translationMethod: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai">AI Translation</SelectItem>
              <SelectItem value="human">Human Translators</SelectItem>
              <SelectItem value="hybrid">Hybrid (AI + Human Review)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Target Languages</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {['es', 'fr', 'de', 'it', 'pt', 'nl'].map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={lang}
                checked={formData.targetLanguages.includes(lang)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({...formData, targetLanguages: [...formData.targetLanguages, lang]});
                  } else {
                    setFormData({...formData, targetLanguages: formData.targetLanguages.filter(l => l !== lang)});
                  }
                }}
              />
              <label htmlFor={lang} className="text-sm">
                {lang === 'es' && '🇪🇸 Spanish'}
                {lang === 'fr' && '🇫🇷 French'}
                {lang === 'de' && '🇩🇪 German'}
                {lang === 'it' && '🇮🇹 Italian'}
                {lang === 'pt' && '🇵🇹 Portuguese'}
                {lang === 'nl' && '🇳🇱 Dutch'}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Project
        </Button>
      </DialogFooter>
    </div>
  );
}

export default MultiLanguageSEO;

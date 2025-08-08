import { useState, useEffect } from "react";
import {
  Target,
  Zap,
  Bot,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Wand2,
  Tags,
  Code,
  TrendingUp,
  Eye,
  Settings,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { seoService } from "@/services/seoService";

interface SEOAutomationProps {
  productId: string;
  onUpdate?: () => void;
}

export function SEOAutomation({ productId, onUpdate }: SEOAutomationProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [tagSuggestions, setTagSuggestions] = useState<any[]>([]);
  const [schemaMarkup, setSchemaMarkup] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState({
    metaTags: true,
    altText: true,
    schema: true,
    keywords: false
  });

  useEffect(() => {
    loadSEOData();
  }, [productId]);

  const loadSEOData = async () => {
    try {
      // Using mock data for now
      const analysisData = seoService.generateMockSEOAnalysis(productId);
      const suggestions = seoService.generateMockTagSuggestions(productId);
      const schema = seoService.generateMockSchemaMarkup(productId);
      
      setAnalysis(analysisData);
      setTagSuggestions(suggestions);
      setSchemaMarkup(schema);
    } catch (error) {
      console.error('Failed to load SEO data:', error);
    }
  };

  const handleAutoFix = async (issueType?: string) => {
    setIsOptimizing(true);
    try {
      // Simulate auto-fix process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reload data after fixing
      await loadSEOData();
      onUpdate?.();
    } catch (error) {
      console.error('Auto-fix failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleBulkOptimize = async () => {
    setIsOptimizing(true);
    try {
      // Run all enabled auto-fixes
      await new Promise(resolve => setTimeout(resolve, 3000));
      await loadSEOData();
      onUpdate?.();
    } catch (error) {
      console.error('Bulk optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>SEO Score & Quick Actions</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${analysis.score >= 80 ? 'text-green-600' : analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {analysis.score}/100
              </div>
              <Badge variant={analysis.score >= 80 ? 'default' : analysis.score >= 60 ? 'secondary' : 'destructive'}>
                {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={analysis.score} className="h-3" />
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                onClick={handleBulkOptimize}
                disabled={isOptimizing}
                className="flex items-center space-x-2"
              >
                {isOptimizing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                <span>{isOptimizing ? 'Optimizing...' : 'Auto-Optimize All'}</span>
              </Button>
              
              <Button size="sm" variant="outline" onClick={() => handleAutoFix('missing_meta_description')}>
                <Magic className="h-4 w-4 mr-2" />
                Fix Meta Tags
              </Button>
              
              <Button size="sm" variant="outline" onClick={() => handleAutoFix('missing_schema')}>
                <Code className="h-4 w-4 mr-2" />
                Generate Schema
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Tags className="h-4 w-4 mr-2" />
                    Smart Tags
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Smart Tag Suggestions</DialogTitle>
                    <DialogDescription>
                      AI-powered tag recommendations based on your product content and category.
                    </DialogDescription>
                  </DialogHeader>
                  <SmartTagSuggestions suggestions={tagSuggestions} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Auto-Fix Settings */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-3 flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                Auto-Fix Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoMetaTags"
                    checked={autoFixEnabled.metaTags}
                    onCheckedChange={(checked) => setAutoFixEnabled(prev => ({ ...prev, metaTags: checked }))}
                  />
                  <Label htmlFor="autoMetaTags" className="text-sm">Auto-fix meta tags</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoAltText"
                    checked={autoFixEnabled.altText}
                    onCheckedChange={(checked) => setAutoFixEnabled(prev => ({ ...prev, altText: checked }))}
                  />
                  <Label htmlFor="autoAltText" className="text-sm">Auto-generate alt text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoSchema"
                    checked={autoFixEnabled.schema}
                    onCheckedChange={(checked) => setAutoFixEnabled(prev => ({ ...prev, schema: checked }))}
                  />
                  <Label htmlFor="autoSchema" className="text-sm">Auto-generate schema</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoKeywords"
                    checked={autoFixEnabled.keywords}
                    onCheckedChange={(checked) => setAutoFixEnabled(prev => ({ ...prev, keywords: checked }))}
                  />
                  <Label htmlFor="autoKeywords" className="text-sm">Auto-optimize keywords</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issues">Issues & Fixes</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="schema">Schema Markup</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
        </TabsList>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.issues.map((issue: any, index: number) => (
                  <Collapsible key={index}>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(issue.severity)}
                        <div>
                          <p className={`font-medium ${getSeverityColor(issue.severity)}`}>
                            {issue.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {issue.type.replace(/_/g, ' ').toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {issue.autoFixable && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAutoFix(issue.type)}
                            disabled={isOptimizing}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-Fix
                          </Button>
                        )}
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent className="px-3 pb-3">
                      <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                        <strong>Fix Suggestion:</strong> {issue.fixSuggestion}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>AI-Powered Optimization Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium capitalize">
                          {suggestion.type.replace(/_/g, ' ')} Optimization
                        </h4>
                        <Badge variant="outline" className="mt-1">
                          {Math.round(suggestion.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                      <Badge variant={suggestion.estimatedImpact === 'high' ? 'default' : suggestion.estimatedImpact === 'medium' ? 'secondary' : 'outline'}>
                        {suggestion.estimatedImpact} Impact
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Current:</Label>
                        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                          {suggestion.current}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Suggested:</Label>
                        <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                          {suggestion.suggested}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <strong>Reasoning:</strong> {suggestion.reasoning}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Apply Suggestion
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schema Markup Tab */}
        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Schema Markup</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={schemaMarkup?.isValid ? 'default' : 'destructive'}>
                    {schemaMarkup?.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Schema Type: {schemaMarkup?.type}</Label>
                  <Textarea
                    value={schemaMarkup?.jsonLd || ''}
                    readOnly
                    rows={12}
                    className="font-mono text-xs mt-2"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Apply Schema
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Customize
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Test in Google
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Improvements Tab */}
        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Improvement Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.improvements.map((improvement: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{improvement.title}</h4>
                      <div className="flex space-x-2">
                        <Badge variant={improvement.impact === 'high' ? 'default' : improvement.impact === 'medium' ? 'secondary' : 'outline'}>
                          {improvement.impact} Impact
                        </Badge>
                        <Badge variant="outline">
                          {improvement.effort} Effort
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {improvement.description}
                    </p>
                    <Button size="sm" variant="outline">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Get Detailed Guide
                    </Button>
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

function SmartTagSuggestions({ suggestions }: { suggestions: any[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ai':
        return <Bot className="h-3 w-3" />;
      case 'category_mapping':
        return <Tags className="h-3 w-3" />;
      case 'keyword_analysis':
        return <TrendingUp className="h-3 w-3" />;
      case 'competitor_analysis':
        return <Target className="h-3 w-3" />;
      default:
        return <Lightbulb className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              selectedTags.includes(suggestion.tag) 
                ? 'border-primary bg-primary/5' 
                : 'hover:bg-muted/30'
            }`}
            onClick={() => toggleTag(suggestion.tag)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {getSourceIcon(suggestion.source)}
                  <span className="ml-1 capitalize">{suggestion.source.replace(/_/g, ' ')}</span>
                </Badge>
                <span className="font-medium">{suggestion.tag}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(suggestion.confidence * 100)}%
                </span>
                {selectedTags.includes(suggestion.tag) && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {suggestion.reasoning}
            </p>
          </div>
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedTags([])}>
              Clear Selection
            </Button>
            <Button size="sm">
              Add Selected Tags
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SEOAutomation;

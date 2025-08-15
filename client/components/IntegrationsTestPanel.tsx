import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export function IntegrationsTestPanel() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runIntegrationTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      {
        name: "Fetch Integrations",
        endpoint: "/api/third-party/integrations",
        method: "GET",
      },
      {
        name: "Connect SEMrush",
        endpoint: "/api/third-party/connect",
        method: "POST",
        body: {
          service: "semrush",
          credentials: { apiKey: "test-api-key-123" },
          settings: { autoSync: true, syncInterval: 24 },
        },
      },
      {
        name: "Test Invalid Service",
        endpoint: "/api/third-party/connect",
        method: "POST",
        body: {
          service: "invalid_service",
          credentials: {},
        },
      },
    ];

    for (const test of tests) {
      try {
        const startTime = Date.now();
        const response = await fetch(test.endpoint, {
          method: test.method,
          headers: test.body ? { "Content-Type": "application/json" } : {},
          body: test.body ? JSON.stringify(test.body) : undefined,
        });

        const endTime = Date.now();
        const data = await response.json();

        setTestResults(prev => [
          ...prev,
          {
            name: test.name,
            status: response.ok ? "success" : "error",
            statusCode: response.status,
            duration: endTime - startTime,
            data: JSON.stringify(data, null, 2),
            error: !response.ok ? data.error : null,
          },
        ]);
      } catch (error) {
        setTestResults(prev => [
          ...prev,
          {
            name: test.name,
            status: "error",
            statusCode: 0,
            duration: 0,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ]);
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Integrations API Test Panel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the third-party integrations API endpoints
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={runIntegrationTests}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            "Run Integration Tests"
          )}
        </Button>

        {testResults.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {testResults.map((result, index) => (
                <Card key={index} className="border-l-4 border-l-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.name}</span>
                        <Badge
                          variant={
                            result.status === "success"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {result.statusCode}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {result.duration}ms
                      </span>
                    </div>

                    {result.error && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}

                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                          View Response Data
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 border rounded text-xs overflow-x-auto">
                          {result.data}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

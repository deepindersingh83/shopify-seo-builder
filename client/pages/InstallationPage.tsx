import React, { useState, useEffect } from "react";
import {
  Shield,
  Database,
  User,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Server,
  Globe,
  Mail,
  Lock,
  Building,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SystemRequirement {
  name: string;
  status: "passed" | "failed" | "warning";
  message: string;
}

interface InstallationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  error?: string;
}

interface InstallationProgress {
  currentStep: number;
  totalSteps: number;
  steps: InstallationStep[];
  overallStatus: "not_started" | "in_progress" | "completed" | "failed";
  errorDetails?: string;
}

interface InstallationConfig {
  adminUser: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    enableSSL: boolean;
  };
  application: {
    siteName: string;
    siteUrl: string;
    timezone: string;
    language: string;
  };
}

export default function InstallationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDbPassword, setShowDbPassword] = useState(false);
  const [requirements, setRequirements] = useState<SystemRequirement[]>([]);
  const [canInstall, setCanInstall] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{
    success?: boolean;
    error?: string;
  } | null>(null);
  const [installationProgress, setInstallationProgress] =
    useState<InstallationProgress | null>(null);

  const [config, setConfig] = useState<InstallationConfig>({
    adminUser: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    database: {
      host: "localhost",
      port: 3306,
      database: "seo_manager",
      user: "root",
      password: "",
      enableSSL: false,
    },
    application: {
      siteName: "SEO Manager Pro",
      siteUrl: window.location.origin,
      timezone: "UTC",
      language: "en",
    },
  });

  const steps = [
    {
      id: "requirements",
      title: "System Requirements",
      description: "Check system compatibility",
      icon: Shield,
    },
    {
      id: "admin",
      title: "Admin Account",
      description: "Create administrator account",
      icon: User,
    },
    {
      id: "database",
      title: "Database Configuration",
      description: "Configure MariaDB connection",
      icon: Database,
    },
    {
      id: "application",
      title: "Application Settings",
      description: "Configure application preferences",
      icon: Settings,
    },
    {
      id: "installation",
      title: "Installation",
      description: "Run installation process",
      icon: Server,
    },
  ];

  useEffect(() => {
    checkSystemRequirements();
  }, []);

  const checkSystemRequirements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/installation/requirements");
      const data = await response.json();
      setRequirements(data.requirements);
      setCanInstall(data.canInstall);
    } catch (error) {
      console.error("Failed to check system requirements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setDbTestResult(null);

    try {
      const response = await fetch("/api/installation/test-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ database: config.database }),
      });

      const result = await response.json();
      setDbTestResult(result);
    } catch (error) {
      setDbTestResult({
        success: false,
        error: "Failed to test database connection",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runInstallation = async () => {
    setIsLoading(true);
    setInstallationProgress(null);

    try {
      const response = await fetch("/api/installation/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const progress = await response.json();
      setInstallationProgress(progress);

      if (progress.overallStatus === "completed") {
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch (error) {
      console.error("Installation failed:", error);
      setInstallationProgress({
        currentStep: 0,
        totalSteps: 6,
        steps: [],
        overallStatus: "failed",
        errorDetails: "Installation request failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Requirements
        return canInstall;
      case 1: // Admin
        return (
          config.adminUser.name.length >= 2 &&
          config.adminUser.email.includes("@") &&
          config.adminUser.password.length >= 8 &&
          config.adminUser.password === config.adminUser.confirmPassword
        );
      case 2: // Database
        return (
          config.database.host.length > 0 &&
          config.database.database.length > 0 &&
          config.database.user.length > 0 &&
          dbTestResult?.success === true
        );
      case 3: // Application
        return (
          config.application.siteName.length > 0 &&
          config.application.siteUrl.length > 0
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "upcoming";
  };

  const renderSystemRequirements = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          System Requirements Check
        </h3>
        <div className="space-y-3">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 border rounded"
            >
              {req.status === "passed" && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {req.status === "failed" && (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              {req.status === "warning" && (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <p className="font-medium">{req.name}</p>
                <p className="text-sm text-muted-foreground">{req.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!canInstall && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Cannot Install</AlertTitle>
          <AlertDescription>
            Please resolve the failed requirements before proceeding with
            installation.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-2">
        <Button onClick={checkSystemRequirements} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Recheck Requirements
        </Button>
      </div>
    </div>
  );

  const renderAdminSetup = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Create Administrator Account
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="admin-name">Full Name</Label>
            <Input
              id="admin-name"
              value={config.adminUser.name}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  adminUser: { ...prev.adminUser, name: e.target.value },
                }))
              }
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="admin-email">Email Address</Label>
            <Input
              id="admin-email"
              type="email"
              value={config.adminUser.email}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  adminUser: { ...prev.adminUser, email: e.target.value },
                }))
              }
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={config.adminUser.password}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    adminUser: { ...prev.adminUser, password: e.target.value },
                  }))
                }
                placeholder="Enter a secure password (min 8 characters)"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="admin-confirm-password">Confirm Password</Label>
            <Input
              id="admin-confirm-password"
              type="password"
              value={config.adminUser.confirmPassword}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  adminUser: {
                    ...prev.adminUser,
                    confirmPassword: e.target.value,
                  },
                }))
              }
              placeholder="Confirm your password"
            />
          </div>

          {config.adminUser.password !== config.adminUser.confirmPassword &&
            config.adminUser.confirmPassword.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>Passwords do not match</AlertDescription>
              </Alert>
            )}
        </div>
      </div>
    </div>
  );

  const renderDatabaseSetup = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Database Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="db-host">Database Host</Label>
            <Input
              id="db-host"
              value={config.database.host}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  database: { ...prev.database, host: e.target.value },
                }))
              }
              placeholder="localhost"
            />
          </div>

          <div>
            <Label htmlFor="db-port">Port</Label>
            <Input
              id="db-port"
              type="number"
              value={config.database.port}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  database: {
                    ...prev.database,
                    port: parseInt(e.target.value) || 3306,
                  },
                }))
              }
              placeholder="3306"
            />
          </div>

          <div>
            <Label htmlFor="db-name">Database Name</Label>
            <Input
              id="db-name"
              value={config.database.database}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  database: { ...prev.database, database: e.target.value },
                }))
              }
              placeholder="seo_manager"
            />
          </div>

          <div>
            <Label htmlFor="db-user">Username</Label>
            <Input
              id="db-user"
              value={config.database.user}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  database: { ...prev.database, user: e.target.value },
                }))
              }
              placeholder="root"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="db-password">Password</Label>
            <div className="relative">
              <Input
                id="db-password"
                type={showDbPassword ? "text" : "password"}
                value={config.database.password}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    database: { ...prev.database, password: e.target.value },
                  }))
                }
                placeholder="Enter database password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowDbPassword(!showDbPassword)}
              >
                {showDbPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch
            checked={config.database.enableSSL}
            onCheckedChange={(checked) =>
              setConfig((prev) => ({
                ...prev,
                database: { ...prev.database, enableSSL: checked },
              }))
            }
          />
          <Label>Enable SSL Connection</Label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={testDatabaseConnection}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
        </div>

        {dbTestResult && (
          <Alert
            className={
              dbTestResult.success
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          >
            {dbTestResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>
              {dbTestResult.success
                ? "Database connection successful!"
                : `Connection failed: ${dbTestResult.error}`}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );

  const renderApplicationSetup = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Application Settings</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={config.application.siteName}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  application: {
                    ...prev.application,
                    siteName: e.target.value,
                  },
                }))
              }
              placeholder="SEO Manager Pro"
            />
          </div>

          <div>
            <Label htmlFor="site-url">Site URL</Label>
            <Input
              id="site-url"
              value={config.application.siteUrl}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  application: { ...prev.application, siteUrl: e.target.value },
                }))
              }
              placeholder="https://your-domain.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={config.application.timezone}
                onValueChange={(value) =>
                  setConfig((prev) => ({
                    ...prev,
                    application: { ...prev.application, timezone: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time
                  </SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Asia/Shanghai">Shanghai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={config.application.language}
                onValueChange={(value) =>
                  setConfig((prev) => ({
                    ...prev,
                    application: { ...prev.application, language: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstallation = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Installation Progress</h3>

        {!installationProgress && (
          <div className="text-center py-8">
            <Button onClick={runInstallation} disabled={isLoading} size="lg">
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Server className="h-5 w-5 mr-2" />
              )}
              Start Installation
            </Button>
          </div>
        )}

        {installationProgress && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Overall Progress: {installationProgress.currentStep} of{" "}
                {installationProgress.totalSteps}
              </span>
              <Badge
                variant={
                  installationProgress.overallStatus === "completed"
                    ? "default"
                    : installationProgress.overallStatus === "failed"
                      ? "destructive"
                      : "secondary"
                }
              >
                {installationProgress.overallStatus}
              </Badge>
            </div>

            <Progress
              value={
                (installationProgress.currentStep /
                  installationProgress.totalSteps) *
                100
              }
              className="h-3"
            />

            <div className="space-y-3">
              {installationProgress.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center space-x-3 p-3 border rounded"
                >
                  {step.status === "completed" && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {step.status === "in_progress" && (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  )}
                  {step.status === "failed" && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  {step.status === "pending" && (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {step.error && (
                      <p className="text-sm text-red-600 mt-1">{step.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {installationProgress.overallStatus === "completed" && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">
                  Installation Complete!
                </AlertTitle>
                <AlertDescription>
                  The installation has been completed successfully. You will be
                  redirected to the main application in a few seconds.
                </AlertDescription>
              </Alert>
            )}

            {installationProgress.overallStatus === "failed" && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-600">
                  Installation Failed
                </AlertTitle>
                <AlertDescription>
                  {installationProgress.errorDetails ||
                    "An error occurred during installation."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderSystemRequirements();
      case 1:
        return renderAdminSetup();
      case 2:
        return renderDatabaseSetup();
      case 3:
        return renderApplicationSetup();
      case 4:
        return renderInstallation();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              SEO Manager Pro Installation
            </h1>
            <p className="text-gray-600">
              Welcome! Let's set up your SEO management platform step by step.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        status === "completed"
                          ? "bg-green-600 text-white"
                          : status === "current"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        status === "current" ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200" />
              <div
                className="absolute top-6 left-6 h-0.5 bg-blue-600 transition-all duration-300"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {React.createElement(steps[currentStep].icon, {
                  className: "h-5 w-5",
                })}
                <span>{steps[currentStep].title}</span>
              </CardTitle>
              <p className="text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={nextStep}
              disabled={
                currentStep === steps.length - 1 || !validateCurrentStep()
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

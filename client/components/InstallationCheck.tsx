import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface InstallationCheckProps {
  children: React.ReactNode;
}

export default function InstallationCheck({ children }: InstallationCheckProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkInstallationStatus();
  }, []);

  const checkInstallationStatus = async () => {
    // Don't check if we're already on the installation page
    if (location.pathname === "/install") {
      setIsChecking(false);
      setIsInstalled(true);
      return;
    }

    try {
      const response = await fetch("/api/installation/status");

      if (!response.ok) {
        console.warn(`Installation status check failed: HTTP ${response.status}`);
        // For now, allow access to main app even if installation check fails
        setIsInstalled(true);
        return;
      }

      const data = await response.json();

      if (!data.installed) {
        // Redirect to installation page only if we can confirm it's not installed
        console.log("App not installed, redirecting to installation page");
        navigate("/install");
        return;
      }

      setIsInstalled(true);
    } catch (error) {
      console.warn("Failed to check installation status, allowing access to main app:", error);
      // If we can't check the status, allow access to main app for now
      // This prevents the app from being unusable due to installation check issues
      setIsInstalled(true);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking installation status...</p>
        </div>
      </div>
    );
  }

  return isInstalled ? <>{children}</> : null;
}

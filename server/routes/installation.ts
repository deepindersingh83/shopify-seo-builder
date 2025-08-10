import { Request, Response } from "express";
import { installationService, type InstallationConfig } from "../services/installationService";

// Get installation status
export const getInstallationStatus = async (req: Request, res: Response) => {
  try {
    const status = await installationService.getInstallationStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting installation status:', error);
    res.status(500).json({
      error: 'Failed to get installation status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get system requirements
export const getSystemRequirements = async (req: Request, res: Response) => {
  try {
    const requirements = await installationService.getSystemRequirements();
    res.json(requirements);
  } catch (error) {
    console.error('Error getting system requirements:', error);
    res.status(500).json({
      error: 'Failed to get system requirements',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Test database connection
export const testDatabaseConnection = async (req: Request, res: Response) => {
  try {
    const { database } = req.body;
    
    if (!database) {
      return res.status(400).json({
        error: 'Database configuration is required'
      });
    }

    const result = await installationService.validateDatabaseConnection(database);
    res.json(result);
  } catch (error) {
    console.error('Error testing database connection:', error);
    res.status(500).json({
      error: 'Failed to test database connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Run installation
export const runInstallation = async (req: Request, res: Response) => {
  try {
    const config: InstallationConfig = req.body;
    
    if (!config) {
      return res.status(400).json({
        error: 'Installation configuration is required'
      });
    }

    // Check if already installed
    const isInstalled = await installationService.isInstalled();
    if (isInstalled) {
      return res.status(409).json({
        error: 'Application is already installed'
      });
    }

    const progress = await installationService.runInstallation(config);
    
    if (progress.overallStatus === 'completed') {
      res.status(200).json(progress);
    } else {
      res.status(500).json(progress);
    }
  } catch (error) {
    console.error('Error during installation:', error);
    res.status(500).json({
      error: 'Installation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Validate installation configuration
export const validateConfiguration = async (req: Request, res: Response) => {
  try {
    const config = req.body;
    
    // Basic validation
    const errors: string[] = [];
    
    if (!config.adminUser?.email) {
      errors.push('Admin email is required');
    }
    
    if (!config.adminUser?.password || config.adminUser.password.length < 8) {
      errors.push('Admin password must be at least 8 characters');
    }
    
    if (config.adminUser?.password !== config.adminUser?.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    if (!config.database?.host) {
      errors.push('Database host is required');
    }
    
    if (!config.database?.database) {
      errors.push('Database name is required');
    }
    
    if (!config.database?.user) {
      errors.push('Database user is required');
    }
    
    if (!config.application?.siteName) {
      errors.push('Site name is required');
    }
    
    if (!config.application?.siteUrl) {
      errors.push('Site URL is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        valid: false,
        errors
      });
    }

    res.json({
      valid: true,
      message: 'Configuration is valid'
    });
  } catch (error) {
    console.error('Error validating configuration:', error);
    res.status(500).json({
      error: 'Failed to validate configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get installation progress (for potential future use with WebSocket)
export const getInstallationProgress = async (req: Request, res: Response) => {
  try {
    // This could be enhanced to show real-time progress via WebSocket
    // For now, just return installation status
    const status = await installationService.getInstallationStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting installation progress:', error);
    res.status(500).json({
      error: 'Failed to get installation progress',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

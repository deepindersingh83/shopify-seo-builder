import { databaseService } from "./database";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// Installation configuration schema
const InstallationConfigSchema = z.object({
  adminUser: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
  database: z.object({
    host: z.string().min(1, "Database host is required"),
    port: z.number().min(1).max(65535, "Invalid port number"),
    database: z.string().min(1, "Database name is required"),
    user: z.string().min(1, "Database user is required"),
    password: z.string().min(1, "Database password is required"),
    enableSSL: z.boolean().default(false),
  }),
  application: z.object({
    siteName: z.string().min(1, "Site name is required"),
    siteUrl: z.string().url("Invalid URL format"),
    timezone: z.string().default("UTC"),
    language: z.string().default("en"),
  }),
});

type InstallationConfig = z.infer<typeof InstallationConfigSchema>;

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

class InstallationService {
  private installationSteps: InstallationStep[] = [
    {
      id: "validate_config",
      title: "Validate Configuration",
      description: "Validating installation configuration",
      status: "pending",
    },
    {
      id: "test_database",
      title: "Test Database Connection",
      description: "Testing connection to MariaDB database",
      status: "pending",
    },
    {
      id: "run_migrations",
      title: "Setup Database Schema",
      description: "Creating database tables and indexes",
      status: "pending",
    },
    {
      id: "create_admin",
      title: "Create Admin User",
      description: "Setting up administrator account",
      status: "pending",
    },
    {
      id: "configure_app",
      title: "Configure Application",
      description: "Applying application settings",
      status: "pending",
    },
    {
      id: "finalize",
      title: "Finalize Installation",
      description: "Completing installation and cleanup",
      status: "pending",
    },
  ];

  async isInstalled(): Promise<boolean> {
    try {
      // Check if installation marker exists
      const installFile = path.join(process.cwd(), ".installed");
      await fs.access(installFile);
      return true;
    } catch {
      return false;
    }
  }

  async getInstallationStatus(): Promise<{
    installed: boolean;
    canConnect: boolean;
  }> {
    const installed = await this.isInstalled();
    let canConnect = false;

    try {
      if (databaseService.isConnected()) {
        canConnect = true;
      } else {
        // Try to initialize database to check connection
        await databaseService.initialize();
        canConnect = databaseService.isConnected();
      }
    } catch {
      canConnect = false;
    }

    return { installed, canConnect };
  }

  async validateDatabaseConnection(
    config: InstallationConfig["database"],
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Dynamic import to handle missing mariadb module gracefully
      let mariadb;
      try {
        mariadb = await import("mariadb");
      } catch (importError) {
        return {
          success: false,
          error:
            "MariaDB module not found. Please install MariaDB dependencies.",
        };
      }

      const pool = mariadb.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        connectionLimit: 1,
        acquireTimeout: 10000,
        timeout: 10000,
        ssl: config.enableSSL,
      });

      const conn = await pool.getConnection();
      await conn.query("SELECT 1");
      await conn.release();
      await pool.end();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown database error",
      };
    }
  }

  async runInstallation(
    config: InstallationConfig,
  ): Promise<InstallationProgress> {
    const progress: InstallationProgress = {
      currentStep: 0,
      totalSteps: this.installationSteps.length,
      steps: [...this.installationSteps],
      overallStatus: "in_progress",
    };

    try {
      // Step 1: Validate Configuration
      progress.steps[0].status = "in_progress";

      const validationResult = InstallationConfigSchema.safeParse(config);
      if (!validationResult.success) {
        throw new Error(
          `Configuration validation failed: ${validationResult.error.message}`,
        );
      }

      progress.steps[0].status = "completed";
      progress.currentStep = 1;

      // Step 2: Test Database Connection
      progress.steps[1].status = "in_progress";

      const dbTest = await this.validateDatabaseConnection(config.database);
      if (!dbTest.success) {
        throw new Error(`Database connection failed: ${dbTest.error}`);
      }

      progress.steps[1].status = "completed";
      progress.currentStep = 2;

      // Step 3: Run Migrations
      progress.steps[2].status = "in_progress";

      // Update database service config
      process.env.DB_HOST = config.database.host;
      process.env.DB_PORT = config.database.port.toString();
      process.env.DB_NAME = config.database.database;
      process.env.DB_USER = config.database.user;
      process.env.DB_PASSWORD = config.database.password;
      process.env.DB_SSL = config.database.enableSSL.toString();

      // Initialize database with new config
      await databaseService.initialize();

      // Check if database is actually connected after initialization
      if (!databaseService.isConnected()) {
        throw new Error("Database connection failed - cannot proceed with installation");
      }

      progress.steps[2].status = "completed";
      progress.currentStep = 3;

      // Step 4: Create Admin User
      progress.steps[3].status = "in_progress";

      await this.createAdminUser(config.adminUser);

      progress.steps[3].status = "completed";
      progress.currentStep = 4;

      // Step 5: Configure Application
      progress.steps[4].status = "in_progress";

      await this.configureApplication(config.application);

      progress.steps[4].status = "completed";
      progress.currentStep = 5;

      // Step 6: Finalize Installation
      progress.steps[5].status = "in_progress";

      await this.finalizeInstallation();

      progress.steps[5].status = "completed";
      progress.currentStep = 6;
      progress.overallStatus = "completed";
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown installation error";

      // Mark current step as failed
      if (progress.currentStep < progress.steps.length) {
        progress.steps[progress.currentStep].status = "failed";
        progress.steps[progress.currentStep].error = errorMessage;
      }

      progress.overallStatus = "failed";
      progress.errorDetails = errorMessage;
    }

    return progress;
  }

  private async createAdminUser(
    adminConfig: InstallationConfig["adminUser"],
  ): Promise<void> {
    try {
      // Create users table if it doesn't exist
      await databaseService.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
          status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_users_email (email),
          INDEX idx_users_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Hash password (in a real app, use bcrypt or similar)
      const passwordHash = Buffer.from(adminConfig.password).toString("base64");
      const adminId = `admin-${Date.now()}`;

      // Insert admin user
      await databaseService.query(
        `
        INSERT INTO users (id, name, email, password_hash, role, status)
        VALUES (?, ?, ?, ?, 'admin', 'active')
      `,
        [adminId, adminConfig.name, adminConfig.email, passwordHash],
      );

      console.log("✅ Admin user created successfully");
    } catch (error) {
      console.error("❌ Failed to create admin user:", error);
      throw new Error(
        `Failed to create admin user: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async configureApplication(
    appConfig: InstallationConfig["application"],
  ): Promise<void> {
    try {
      // Create settings table if it doesn't exist
      await databaseService.query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          id VARCHAR(50) PRIMARY KEY,
          key_name VARCHAR(255) UNIQUE NOT NULL,
          value_data JSON,
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_settings_key (key_name),
          INDEX idx_settings_category (category)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Insert application settings
      const settings = [
        {
          id: `setting-${Date.now()}-1`,
          key_name: "site_name",
          value_data: JSON.stringify(appConfig.siteName),
          category: "general",
        },
        {
          id: `setting-${Date.now()}-2`,
          key_name: "site_url",
          value_data: JSON.stringify(appConfig.siteUrl),
          category: "general",
        },
        {
          id: `setting-${Date.now()}-3`,
          key_name: "timezone",
          value_data: JSON.stringify(appConfig.timezone),
          category: "general",
        },
        {
          id: `setting-${Date.now()}-4`,
          key_name: "language",
          value_data: JSON.stringify(appConfig.language),
          category: "general",
        },
        {
          id: `setting-${Date.now()}-5`,
          key_name: "installation_date",
          value_data: JSON.stringify(new Date().toISOString()),
          category: "system",
        },
      ];

      for (const setting of settings) {
        await databaseService.query(
          `
          INSERT INTO app_settings (id, key_name, value_data, category)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE value_data = VALUES(value_data), updated_at = CURRENT_TIMESTAMP
        `,
          [setting.id, setting.key_name, setting.value_data, setting.category],
        );
      }

      console.log("✅ Application configured successfully");
    } catch (error) {
      console.error("❌ Failed to configure application:", error);
      throw new Error(
        `Failed to configure application: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async finalizeInstallation(): Promise<void> {
    try {
      // Create installation marker file
      const installFile = path.join(process.cwd(), ".installed");
      const installationData = {
        installed: true,
        installedAt: new Date().toISOString(),
        version: "1.0.0",
      };

      await fs.writeFile(
        installFile,
        JSON.stringify(installationData, null, 2),
      );

      // Create initial sample data
      await databaseService.seedData();

      console.log("✅ Installation finalized successfully");
    } catch (error) {
      console.error("❌ Failed to finalize installation:", error);
      throw new Error(
        `Failed to finalize installation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getSystemRequirements(): Promise<{
    requirements: Array<{
      name: string;
      status: "passed" | "failed" | "warning";
      message: string;
    }>;
    canInstall: boolean;
  }> {
    const requirements = [];
    let canInstall = true;

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

    if (majorVersion >= 18) {
      requirements.push({
        name: "Node.js Version",
        status: "passed",
        message: `Node.js ${nodeVersion} (✓ >= 18.0.0)`,
      });
    } else {
      requirements.push({
        name: "Node.js Version",
        status: "failed",
        message: `Node.js ${nodeVersion} (✗ Requires >= 18.0.0)`,
      });
      canInstall = false;
    }

    // Check write permissions
    try {
      const testFile = path.join(process.cwd(), ".write-test");
      await fs.writeFile(testFile, "test");
      await fs.unlink(testFile);

      requirements.push({
        name: "File Permissions",
        status: "passed",
        message: "Write permissions available",
      });
    } catch {
      requirements.push({
        name: "File Permissions",
        status: "failed",
        message: "No write permissions in application directory",
      });
      canInstall = false;
    }

    // Check if already installed
    const isAlreadyInstalled = await this.isInstalled();
    if (isAlreadyInstalled) {
      requirements.push({
        name: "Installation Status",
        status: "warning",
        message: "Application is already installed",
      });
    } else {
      requirements.push({
        name: "Installation Status",
        status: "passed",
        message: "Ready for installation",
      });
    }

    return { requirements, canInstall: canInstall && !isAlreadyInstalled };
  }
}

export const installationService = new InstallationService();
export type { InstallationConfig, InstallationProgress, InstallationStep };

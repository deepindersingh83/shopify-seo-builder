import {
  parseDatabaseConfig,
  validateDatabaseConfig,
  type DatabaseConfig,
} from "./databaseConfig";
import {
  createDatabaseAdapter,
  type DatabaseAdapter,
} from "./databaseAdapters";

class DatabaseService {
  private adapter: DatabaseAdapter | null = null;
  private config: DatabaseConfig;
  private isInitializing = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.config = parseDatabaseConfig();
    this.logConfiguration();
  }

  private logConfiguration(): void {
    const safeConfig = { ...this.config };
    if (safeConfig.password) {
      safeConfig.password = "***";
    }
    console.log("🔧 Database configuration:", safeConfig);
  }

  async initialize(): Promise<void> {
    // Prevent multiple concurrent initializations
    if (this.isInitializing && this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.adapter) {
      return; // Already initialized
    }

    this.isInitializing = true;
    this.initializationPromise = this.initializeInternal(false);

    try {
      await this.initializationPromise;
    } finally {
      this.isInitializing = false;
      this.initializationPromise = null;
    }
  }

  async initializeStrict(): Promise<void> {
    return this.initializeInternal(true);
  }

  private async initializeInternal(strict: boolean = false): Promise<void> {
    try {
      // Validate configuration
      const configErrors = validateDatabaseConfig(this.config);
      if (configErrors.length > 0) {
        const errorMessage = `Database configuration errors: ${configErrors.join(", ")}`;
        if (strict) {
          throw new Error(errorMessage);
        } else {
          console.warn("⚠️", errorMessage, "- falling back to memory storage");
          return;
        }
      }

      // Create appropriate database adapter
      this.adapter = await createDatabaseAdapter(this.config);

      if (!this.adapter) {
        // Database is disabled
        return;
      }

      // Initialize the adapter
      await this.adapter.initialize();

      // Run migrations if needed
      await this.runMigrations();
    } catch (error) {
      if (strict) {
        // In strict mode (installation), throw the error
        console.error(
          `❌ Database connection failed during installation:`,
          error,
        );

        // Clean up the failed adapter
        if (this.adapter) {
          try {
            await this.adapter.close();
          } catch (e) {
            // Ignore cleanup errors
          }
          this.adapter = null;
        }

        throw new Error(
          `Database connection failed: ${error instanceof Error ? error.message : error}`,
        );
      } else {
        // In normal mode, fall back to memory storage
        console.warn(
          `⚠️ Database connection failed, falling back to memory storage:`,
          error instanceof Error ? error.message : error,
        );

        // Clean up the failed adapter
        if (this.adapter) {
          try {
            await this.adapter.close();
          } catch (e) {
            // Ignore cleanup errors
          }
          this.adapter = null;
        }

        // Don't throw the error - allow the app to continue in memory mode
        console.log(
          "📝 Running in memory storage mode - database features will use in-memory data",
        );
      }
    }
  }

  async getConnection(): Promise<any> {
    if (!this.adapter) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    // This method is MariaDB-specific, we'll need to handle this differently
    // For now, return the adapter itself as the connection
    return this.adapter;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (!this.adapter) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.adapter.query(sql, params);
  }

  async transaction<T>(callback: (conn: any) => Promise<T>): Promise<T> {
    if (!this.adapter) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.adapter.transaction(callback);
  }

  private async runMigrations(): Promise<void> {
    if (!this.adapter) {
      return;
    }

    console.log("🔄 Running database migrations...");

    try {
      // Create migrations table if it doesn't exist
      await this.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id ${this.getAutoIncrementType()} PRIMARY KEY,
          migration_name VARCHAR(255) NOT NULL UNIQUE,
          executed_at ${this.getTimestampType()} DEFAULT ${this.getCurrentTimestamp()}
        )
      `);

      // Check which migrations have been run
      const executedMigrations = await this.query(
        "SELECT migration_name FROM migrations",
      );
      const executedNames = new Set(
        executedMigrations.map((m: any) => m.migration_name),
      );

      // Define migrations in order
      const migrations = this.getMigrations();

      // Execute pending migrations
      for (const migration of migrations) {
        if (!executedNames.has(migration.name)) {
          console.log(`  ⚡ Running migration: ${migration.name}`);
          await this.query(migration.sql);
          await this.query(
            "INSERT INTO migrations (migration_name) VALUES (?)",
            [migration.name],
          );
          console.log(`  ✅ Migration completed: ${migration.name}`);
        }
      }

      console.log("✅ All migrations completed successfully");
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  }

  private getAutoIncrementType(): string {
    switch (this.config.type) {
      case "sqlite":
        return "INTEGER";
      case "postgresql":
        return "SERIAL";
      case "mysql":
      case "mariadb":
      default:
        return "INT AUTO_INCREMENT";
    }
  }

  private getTimestampType(): string {
    switch (this.config.type) {
      case "postgresql":
        return "TIMESTAMP";
      case "sqlite":
        return "DATETIME";
      case "mysql":
      case "mariadb":
      default:
        return "TIMESTAMP";
    }
  }

  private getCurrentTimestamp(): string {
    switch (this.config.type) {
      case "postgresql":
        return "CURRENT_TIMESTAMP";
      case "sqlite":
        return "CURRENT_TIMESTAMP";
      case "mysql":
      case "mariadb":
      default:
        return "CURRENT_TIMESTAMP";
    }
  }

  private getMigrations() {
    const textType = this.config.type === "postgresql" ? "TEXT" : "TEXT";
    const jsonType = this.config.type === "postgresql" ? "JSONB" : "JSON";
    const bigintType = this.config.type === "sqlite" ? "INTEGER" : "BIGINT";
    const decimalType =
      this.config.type === "sqlite" ? "REAL" : "DECIMAL(10,2)";
    const timestampType = this.getTimestampType();
    const currentTimestamp = this.getCurrentTimestamp();

    return [
      {
        name: "001_create_products_table",
        sql: `
          CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(50) PRIMARY KEY,
            shopify_id ${bigintType} UNIQUE,
            title VARCHAR(500) NOT NULL,
            handle VARCHAR(255) NOT NULL,
            description ${textType},
            status VARCHAR(20) DEFAULT 'active',
            vendor VARCHAR(255),
            product_type VARCHAR(255),
            tags ${jsonType},
            price ${decimalType},
            compare_at_price ${decimalType},
            inventory INT DEFAULT 0,
            image_url VARCHAR(1000),
            meta_title VARCHAR(255),
            meta_description ${textType},
            seo_score INT DEFAULT 0,
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "002_create_stores_table",
        sql: `
          CREATE TABLE IF NOT EXISTS stores (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            domain VARCHAR(255) NOT NULL UNIQUE,
            shopify_domain VARCHAR(255),
            plan VARCHAR(20) DEFAULT 'basic',
            status VARCHAR(20) DEFAULT 'active',
            seo_score INT DEFAULT 0,
            monthly_revenue ${decimalType} DEFAULT 0,
            monthly_traffic INT DEFAULT 0,
            api_key VARCHAR(500),
            access_token VARCHAR(500),
            webhook_secret VARCHAR(255),
            settings ${jsonType},
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "003_create_users_table",
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'admin',
            status VARCHAR(20) DEFAULT 'active',
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "004_create_app_settings_table",
        sql: `
          CREATE TABLE IF NOT EXISTS app_settings (
            id VARCHAR(50) PRIMARY KEY,
            key_name VARCHAR(255) UNIQUE NOT NULL,
            value_data ${jsonType},
            category VARCHAR(100),
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "005_create_third_party_integrations_table",
        sql: `
          CREATE TABLE IF NOT EXISTS third_party_integrations (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            status VARCHAR(20) DEFAULT 'disconnected',
            credentials ${jsonType},
            settings ${jsonType},
            last_sync ${timestampType},
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "006_create_platform_integrations_table",
        sql: `
          CREATE TABLE IF NOT EXISTS platform_integrations (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            status VARCHAR(20) DEFAULT 'disconnected',
            credentials ${jsonType},
            sync_settings ${jsonType},
            last_sync ${timestampType},
            sync_history ${jsonType},
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "007_create_filter_presets_table",
        sql: `
          CREATE TABLE IF NOT EXISTS filter_presets (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description ${textType},
            filters ${jsonType},
            is_public BOOLEAN DEFAULT FALSE,
            created_by VARCHAR(255),
            usage_count INT DEFAULT 0,
            created_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "008_create_workflow_rules_table",
        sql: `
          CREATE TABLE IF NOT EXISTS workflow_rules (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description ${textType},
            enabled BOOLEAN DEFAULT TRUE,
            trigger_config ${jsonType},
            conditions_config ${jsonType},
            actions_config ${jsonType},
            execution_count INT DEFAULT 0,
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "009_create_workflow_executions_table",
        sql: `
          CREATE TABLE IF NOT EXISTS workflow_executions (
            id VARCHAR(50) PRIMARY KEY,
            workflow_id VARCHAR(50),
            status VARCHAR(20) DEFAULT 'pending',
            started_at ${timestampType},
            completed_at ${timestampType},
            progress INT DEFAULT 0,
            total_items INT DEFAULT 0,
            processed_items INT DEFAULT 0,
            errors ${jsonType},
            results ${jsonType},
            can_cancel BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (workflow_id) REFERENCES workflow_rules(id) ON DELETE CASCADE
          )
        `,
      },
      {
        name: "010_create_seo_audits_table",
        sql: `
          CREATE TABLE IF NOT EXISTS seo_audits (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description ${textType},
            enabled BOOLEAN DEFAULT TRUE,
            rules ${jsonType},
            notifications ${jsonType},
            schedule_config ${jsonType},
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "011_create_audit_results_table",
        sql: `
          CREATE TABLE IF NOT EXISTS audit_results (
            id VARCHAR(50) PRIMARY KEY,
            audit_id VARCHAR(50),
            product_id VARCHAR(50),
            score INT DEFAULT 0,
            issues ${jsonType},
            recommendations ${jsonType},
            executed_at ${timestampType} DEFAULT ${currentTimestamp},
            FOREIGN KEY (audit_id) REFERENCES seo_audits(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
          )
        `,
      },
      {
        name: "012_create_collections_table",
        sql: `
          CREATE TABLE IF NOT EXISTS collections (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(20) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            meta_title VARCHAR(255),
            meta_description ${textType},
            keywords ${jsonType},
            content ${textType},
            is_published BOOLEAN DEFAULT TRUE,
            template_suffix VARCHAR(100),
            platform VARCHAR(50),
            platform_id VARCHAR(50),
            product_count INT DEFAULT 0,
            created_at ${timestampType} DEFAULT ${currentTimestamp},
            updated_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "013_create_bulk_operations_table",
        sql: `
          CREATE TABLE IF NOT EXISTS bulk_operations (
            id VARCHAR(50) PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            name VARCHAR(255),
            status VARCHAR(20) DEFAULT 'pending',
            progress INT DEFAULT 0,
            total_items INT DEFAULT 0,
            processed_items INT DEFAULT 0,
            successful_items INT DEFAULT 0,
            failed_items INT DEFAULT 0,
            started_at ${timestampType},
            completed_at ${timestampType},
            can_cancel BOOLEAN DEFAULT TRUE,
            results ${jsonType},
            errors ${jsonType},
            created_at ${timestampType} DEFAULT ${currentTimestamp}
          )
        `,
      },
      {
        name: "013_add_foreign_keys_to_products",
        sql: `
          ALTER TABLE products
          ADD COLUMN store_id VARCHAR(50),
          ADD COLUMN integration_id VARCHAR(50)
        `,
      },
    ];
  }

  async seedData(): Promise<void> {
    if (!this.adapter) {
      return;
    }

    console.log("🌱 Seeding initial data...");

    try {
      // Check if we already have data
      const productCount = await this.query(
        "SELECT COUNT(*) as count FROM products",
      );

      if (productCount[0].count > 0) {
        console.log("📊 Database already contains data, skipping seed");
        return;
      }

      // No demo data seeding - users should connect their own stores
      console.log("✅ Database ready for user data");
    } catch (error) {
      console.error("❌ Data seeding failed:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.adapter) {
      try {
        await this.adapter.close();
        console.log("🔌 Database connection closed");
      } catch (error) {
        console.warn("⚠️ Error closing database:", error);
      } finally {
        this.adapter = null;
        this.isInitializing = false;
        this.initializationPromise = null;
      }
    }
  }

  isConnected(): boolean {
    return this.adapter !== null && this.adapter.isConnected();
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; details: any }> {
    if (!this.adapter) {
      return {
        status: "disconnected",
        details: {
          error: "Database not initialized",
          type: this.config.type,
        },
      };
    }

    return this.adapter.healthCheck();
  }

  // Get current database configuration (safe for logging)
  getConfig(): Omit<DatabaseConfig, "password"> {
    const { password, ...safeConfig } = this.config;
    return safeConfig;
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;

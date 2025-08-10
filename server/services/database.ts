import mariadb from 'mariadb';
import { z } from 'zod';

// Database configuration schema
const DatabaseConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(3306),
  user: z.string().default('root'),
  password: z.string().default(''),
  database: z.string().default('seo_manager'),
  connectionLimit: z.number().default(10),
  acquireTimeout: z.number().default(30000),
  timeout: z.number().default(30000),
  ssl: z.boolean().default(false),
});

type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

class DatabaseService {
  private pool: mariadb.Pool | null = null;
  private config: DatabaseConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): DatabaseConfig {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'seo_manager',
      connectionLimit: parseInt(process.env.DB_POOL_SIZE || '10'),
      acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000'),
      timeout: parseInt(process.env.DB_TIMEOUT || '30000'),
      ssl: process.env.DB_SSL === 'true',
    };

    return DatabaseConfigSchema.parse(config);
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing MariaDB connection pool...');

      this.pool = mariadb.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        connectionLimit: this.config.connectionLimit,
        acquireTimeout: 5000, // Reduce timeout for faster fallback
        timeout: 5000,
        ssl: this.config.ssl,
        multipleStatements: true,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
      });

      // Test the connection
      const conn = await this.pool.getConnection();
      console.log('✅ MariaDB connection established successfully');
      await conn.release();

      // Run migrations if needed
      await this.runMigrations();

    } catch (error) {
      console.warn('⚠️  MariaDB connection failed, falling back to mock data mode:', error.message);

      // Clean up the failed pool
      if (this.pool) {
        try {
          await this.pool.end();
        } catch (e) {
          // Ignore cleanup errors
        }
        this.pool = null;
      }

      // Don't throw the error - allow the app to continue in mock mode
      console.log('📝 Running in mock data mode - database features will use simulated data');
    }
  }

  async getConnection(): Promise<mariadb.PoolConnection> {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.pool.getConnection();
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const conn = await this.getConnection();
    try {
      const result = await conn.query(sql, params);
      return result;
    } finally {
      await conn.release();
    }
  }

  async transaction<T>(callback: (conn: mariadb.PoolConnection) => Promise<T>): Promise<T> {
    const conn = await this.getConnection();
    try {
      await conn.beginTransaction();
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  private async runMigrations(): Promise<void> {
    console.log('🔄 Running database migrations...');
    
    try {
      // Create migrations table if it doesn't exist
      await this.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          migration_name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Check which migrations have been run
      const executedMigrations = await this.query(
        'SELECT migration_name FROM migrations'
      );
      const executedNames = new Set(
        executedMigrations.map((m: any) => m.migration_name)
      );

      // Define migrations in order
      const migrations = [
        {
          name: '001_create_products_table',
          sql: `
            CREATE TABLE IF NOT EXISTS products (
              id VARCHAR(50) PRIMARY KEY,
              shopify_id BIGINT UNIQUE,
              title VARCHAR(500) NOT NULL,
              handle VARCHAR(255) NOT NULL,
              description TEXT,
              status ENUM('active', 'draft', 'archived') DEFAULT 'active',
              vendor VARCHAR(255),
              product_type VARCHAR(255),
              tags JSON,
              price DECIMAL(10,2),
              compare_at_price DECIMAL(10,2),
              inventory INT DEFAULT 0,
              image_url VARCHAR(1000),
              meta_title VARCHAR(255),
              meta_description TEXT,
              seo_score INT DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX idx_products_status (status),
              INDEX idx_products_vendor (vendor),
              INDEX idx_products_type (product_type),
              INDEX idx_products_seo_score (seo_score),
              INDEX idx_products_updated_at (updated_at),
              FULLTEXT idx_products_search (title, description)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `,
        },
        {
          name: '002_create_stores_table',
          sql: `
            CREATE TABLE IF NOT EXISTS stores (
              id VARCHAR(50) PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              domain VARCHAR(255) NOT NULL UNIQUE,
              shopify_domain VARCHAR(255),
              plan ENUM('basic', 'shopify', 'advanced', 'plus') DEFAULT 'basic',
              status ENUM('active', 'paused', 'development', 'maintenance') DEFAULT 'active',
              seo_score INT DEFAULT 0,
              monthly_revenue DECIMAL(12,2) DEFAULT 0,
              monthly_traffic INT DEFAULT 0,
              api_key VARCHAR(500),
              access_token VARCHAR(500),
              webhook_secret VARCHAR(255),
              settings JSON,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX idx_stores_status (status),
              INDEX idx_stores_plan (plan)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `,
        },
        {
          name: '003_create_seo_audits_table',
          sql: `
            CREATE TABLE IF NOT EXISTS seo_audits (
              id VARCHAR(50) PRIMARY KEY,
              store_id VARCHAR(50),
              product_id VARCHAR(50),
              audit_type ENUM('manual', 'scheduled', 'bulk') DEFAULT 'manual',
              seo_score INT,
              issues JSON,
              recommendations JSON,
              executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
              FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
              INDEX idx_audits_store (store_id),
              INDEX idx_audits_product (product_id),
              INDEX idx_audits_date (executed_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `,
        },
        {
          name: '004_create_keywords_table',
          sql: `
            CREATE TABLE IF NOT EXISTS keywords (
              id VARCHAR(50) PRIMARY KEY,
              product_id VARCHAR(50),
              keyword VARCHAR(255) NOT NULL,
              keyword_type ENUM('primary', 'secondary', 'longtail') DEFAULT 'primary',
              search_volume INT DEFAULT 0,
              difficulty_score INT DEFAULT 0,
              current_position INT,
              target_position INT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
              INDEX idx_keywords_product (product_id),
              INDEX idx_keywords_type (keyword_type),
              INDEX idx_keywords_position (current_position)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `,
        },
        {
          name: '005_create_bulk_operations_table',
          sql: `
            CREATE TABLE IF NOT EXISTS bulk_operations (
              id VARCHAR(50) PRIMARY KEY,
              operation_type VARCHAR(100) NOT NULL,
              status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
              total_items INT DEFAULT 0,
              processed_items INT DEFAULT 0,
              failed_items INT DEFAULT 0,
              filters JSON,
              changes JSON,
              errors JSON,
              started_at TIMESTAMP NULL,
              completed_at TIMESTAMP NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX idx_operations_status (status),
              INDEX idx_operations_type (operation_type),
              INDEX idx_operations_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `,
        },
        {
          name: '006_create_performance_metrics_table',
          sql: `
            CREATE TABLE IF NOT EXISTS performance_metrics (
              id VARCHAR(50) PRIMARY KEY,
              metric_type VARCHAR(100) NOT NULL,
              entity_type VARCHAR(50),
              entity_id VARCHAR(50),
              metric_value DECIMAL(15,4),
              metric_data JSON,
              recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              INDEX idx_metrics_type (metric_type),
              INDEX idx_metrics_entity (entity_type, entity_id),
              INDEX idx_metrics_date (recorded_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `,
        },
      ];

      // Execute pending migrations
      for (const migration of migrations) {
        if (!executedNames.has(migration.name)) {
          console.log(`  ⚡ Running migration: ${migration.name}`);
          await this.query(migration.sql);
          await this.query(
            'INSERT INTO migrations (migration_name) VALUES (?)',
            [migration.name]
          );
          console.log(`  ✅ Migration completed: ${migration.name}`);
        }
      }

      console.log('✅ All migrations completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async seedData(): Promise<void> {
    console.log('🌱 Seeding initial data...');
    
    try {
      // Check if we already have data
      const productCount = await this.query('SELECT COUNT(*) as count FROM products');
      
      if (productCount[0].count > 0) {
        console.log('📊 Database already contains data, skipping seed');
        return;
      }

      // Create default store
      await this.query(`
        INSERT IGNORE INTO stores (id, name, domain, plan, status, seo_score, monthly_revenue, monthly_traffic)
        VALUES ('store-1', 'Demo Store', 'demo-store.myshopify.com', 'plus', 'active', 75, 125000.00, 45000)
      `);

      // Seed some sample products for testing
      const sampleProducts = [
        {
          id: 'product-1',
          title: 'Premium Wireless Headphones',
          handle: 'premium-wireless-headphones',
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
          vendor: 'AudioTech',
          product_type: 'Electronics',
          price: 299.99,
          seo_score: 85,
        },
        {
          id: 'product-2',
          title: 'Eco-Friendly Water Bottle',
          handle: 'eco-friendly-water-bottle',
          description: 'Sustainable and reusable water bottle made from recycled materials.',
          vendor: 'EcoLife',
          product_type: 'Accessories',
          price: 24.99,
          seo_score: 72,
        },
        {
          id: 'product-3',
          title: 'Smart Fitness Tracker',
          handle: 'smart-fitness-tracker',
          description: 'Advanced fitness tracker with heart rate monitoring and GPS.',
          vendor: 'FitTech',
          product_type: 'Electronics',
          price: 199.99,
          seo_score: 91,
        },
      ];

      for (const product of sampleProducts) {
        await this.query(`
          INSERT IGNORE INTO products (
            id, title, handle, description, vendor, product_type, price, seo_score,
            tags, inventory, image_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product.id,
          product.title,
          product.handle,
          product.description,
          product.vendor,
          product.product_type,
          product.price,
          product.seo_score,
          JSON.stringify(['demo', 'sample', product.vendor.toLowerCase()]),
          Math.floor(Math.random() * 100) + 10,
          `https://picsum.photos/400/400?random=${product.id.split('-')[1]}`
        ]);
      }

      console.log('✅ Initial data seeded successfully');
    } catch (error) {
      console.error('❌ Data seeding failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('🔌 Database connection closed');
    }
  }

  // Health check method
  async healthCheck(): Promise<{status: string, details: any}> {
    try {
      const result = await this.query('SELECT 1 as health_check');
      const connectionInfo = await this.query('SHOW STATUS LIKE "Threads_connected"');
      
      return {
        status: 'healthy',
        details: {
          connected: result.length > 0,
          activeConnections: connectionInfo[0]?.Value || 'unknown',
          database: this.config.database,
          host: this.config.host,
          port: this.config.port,
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          database: this.config.database,
          host: this.config.host,
          port: this.config.port,
        }
      };
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;

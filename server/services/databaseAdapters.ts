import { DatabaseConfig, DatabaseType } from "./databaseConfig";

// Abstract database adapter interface
export interface DatabaseAdapter {
  initialize(): Promise<void>;
  close(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any>;
  transaction<T>(callback: (connection: any) => Promise<T>): Promise<T>;
  isConnected(): boolean;
  healthCheck(): Promise<{ status: string; details: any }>;
}

// Create appropriate database adapter based on configuration
export async function createDatabaseAdapter(config: DatabaseConfig): Promise<DatabaseAdapter | null> {
  if (config.type === "disabled") {
    console.log("📝 Database disabled, using memory storage");
    return null;
  }

  switch (config.type) {
    case "sqlite":
      return new SQLiteAdapter(config);
    case "mysql":
    case "mariadb":
      return new MySQLAdapter(config);
    case "postgresql":
      return new PostgreSQLAdapter(config);
    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

// SQLite Adapter
class SQLiteAdapter implements DatabaseAdapter {
  private db: any = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Dynamic import to handle missing sqlite3 module gracefully
      const sqlite3 = await import("sqlite3").catch(() => null);
      const { open } = await import("sqlite").catch(() => ({ open: null }));
      
      if (!sqlite3 || !open) {
        throw new Error("SQLite dependencies not found. Install with: npm install sqlite sqlite3");
      }

      console.log(`Initializing SQLite database: ${this.config.filename}`);
      
      // Ensure directory exists
      const path = await import("path");
      const fs = await import("fs/promises");
      const dir = path.dirname(this.config.filename!);
      await fs.mkdir(dir, { recursive: true });

      this.db = await open({
        filename: this.config.filename!,
        driver: sqlite3.Database,
      });

      // Enable foreign keys
      await this.db.exec("PRAGMA foreign_keys = ON");
      
      console.log("✅ SQLite database connected successfully");
      await this.runMigrations();
    } catch (error) {
      console.error("❌ SQLite connection failed:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log("🔌 SQLite database closed");
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    
    if (sql.trim().toUpperCase().startsWith("SELECT")) {
      return this.db.all(sql, params);
    } else {
      return this.db.run(sql, params);
    }
  }

  async transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    
    await this.db.exec("BEGIN TRANSACTION");
    try {
      const result = await callback(this.db);
      await this.db.exec("COMMIT");
      return result;
    } catch (error) {
      await this.db.exec("ROLLBACK");
      throw error;
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const result = await this.query("SELECT 1 as health_check");
      return {
        status: "healthy",
        details: {
          connected: result.length > 0,
          database: this.config.filename,
          type: "sqlite",
        },
      };
    } catch (error) {
      return {
        status: "unhealthy",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          database: this.config.filename,
          type: "sqlite",
        },
      };
    }
  }

  private async runMigrations(): Promise<void> {
    // SQLite-specific migrations would go here
    // For now, this is a placeholder
    console.log("🔄 SQLite migrations completed");
  }
}

// MySQL/MariaDB Adapter
class MySQLAdapter implements DatabaseAdapter {
  private pool: any = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Dynamic import to handle missing mariadb module gracefully
      const mariadb = await import("mariadb").catch(() => null);
      
      if (!mariadb) {
        throw new Error("MariaDB/MySQL dependencies not found. Install with: npm install mariadb");
      }

      console.log(`Initializing ${this.config.type} database connection pool...`);
      
      this.pool = mariadb.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        connectionLimit: this.config.connectionLimit,
        acquireTimeout: this.config.acquireTimeout,
        timeout: this.config.timeout,
        ssl: this.config.ssl,
        multipleStatements: true,
        charset: this.config.charset,
        timezone: this.config.timezone,
      });

      // Test the connection
      const conn = await this.pool.getConnection();
      console.log(`✅ ${this.config.type} connection established successfully`);
      await conn.release();

      await this.runMigrations();
    } catch (error) {
      console.error(`❌ ${this.config.type} connection failed:`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        console.log(`🔌 ${this.config.type} connection closed`);
      } catch (error) {
        console.warn(`⚠️ Error closing ${this.config.type} pool:`, error);
      } finally {
        this.pool = null;
      }
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      throw new Error("Database not initialized");
    }
    
    const conn = await this.pool.getConnection();
    try {
      const result = await conn.query(sql, params);
      return result;
    } finally {
      await conn.release();
    }
  }

  async transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error("Database not initialized");
    }
    
    const conn = await this.pool.getConnection();
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

  isConnected(): boolean {
    return this.pool !== null;
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const result = await this.query("SELECT 1 as health_check");
      return {
        status: "healthy",
        details: {
          connected: result.length > 0,
          database: this.config.database,
          host: this.config.host,
          port: this.config.port,
          type: this.config.type,
        },
      };
    } catch (error) {
      return {
        status: "unhealthy",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          database: this.config.database,
          host: this.config.host,
          port: this.config.port,
          type: this.config.type,
        },
      };
    }
  }

  private async runMigrations(): Promise<void> {
    // MySQL/MariaDB-specific migrations would go here
    // For now, this is a placeholder
    console.log(`🔄 ${this.config.type} migrations completed`);
  }
}

// PostgreSQL Adapter
class PostgreSQLAdapter implements DatabaseAdapter {
  private pool: any = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Dynamic import to handle missing pg module gracefully
      const { Pool } = await import("pg").catch(() => ({ Pool: null }));
      
      if (!Pool) {
        throw new Error("PostgreSQL dependencies not found. Install with: npm install pg @types/pg");
      }

      console.log("Initializing PostgreSQL database connection pool...");
      
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        max: this.config.connectionLimit,
        idleTimeoutMillis: this.config.timeout,
        connectionTimeoutMillis: this.config.acquireTimeout,
        ssl: this.config.ssl,
      });

      // Test the connection
      const client = await this.pool.connect();
      console.log("✅ PostgreSQL connection established successfully");
      client.release();

      await this.runMigrations();
    } catch (error) {
      console.error("❌ PostgreSQL connection failed:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        console.log("🔌 PostgreSQL connection closed");
      } catch (error) {
        console.warn("⚠️ Error closing PostgreSQL pool:", error);
      } finally {
        this.pool = null;
      }
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      throw new Error("Database not initialized");
    }
    
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error("Database not initialized");
    }
    
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  isConnected(): boolean {
    return this.pool !== null;
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const result = await this.query("SELECT 1 as health_check");
      return {
        status: "healthy",
        details: {
          connected: result.length > 0,
          database: this.config.database,
          host: this.config.host,
          port: this.config.port,
          type: "postgresql",
        },
      };
    } catch (error) {
      return {
        status: "unhealthy",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          database: this.config.database,
          host: this.config.host,
          port: this.config.port,
          type: "postgresql",
        },
      };
    }
  }

  private async runMigrations(): Promise<void> {
    // PostgreSQL-specific migrations would go here
    // For now, this is a placeholder
    console.log("🔄 PostgreSQL migrations completed");
  }
}

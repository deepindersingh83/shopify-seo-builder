import { z } from "zod";

// Supported database types
export type DatabaseType =
  | "sqlite"
  | "mysql"
  | "mariadb"
  | "postgresql"
  | "disabled";

// Database configuration schema
const DatabaseConfigSchema = z.object({
  type: z.enum(["sqlite", "mysql", "mariadb", "postgresql", "disabled"]),
  host: z.string().optional(),
  port: z.number().optional(),
  user: z.string().optional(),
  password: z.string().optional(),
  database: z.string(),
  ssl: z.boolean().default(false),
  connectionLimit: z.number().default(10),
  acquireTimeout: z.number().default(30000),
  timeout: z.number().default(30000),
  // SQLite specific
  filename: z.string().optional(),
  // Additional options
  charset: z.string().default("utf8mb4"),
  timezone: z.string().default("UTC"),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

// Parse DATABASE_URL or individual environment variables
export function parseDatabaseConfig(): DatabaseConfig {
  const databaseUrl = process.env.DATABASE_URL;

  // If DATABASE_URL is provided, parse it
  if (databaseUrl && databaseUrl !== "") {
    return parseDatabaseUrl(databaseUrl);
  }

  // Check if database is explicitly disabled
  if (process.env.DB_ENABLED === "false") {
    return {
      type: "disabled",
      database: "disabled",
    };
  }

  // Fall back to individual environment variables (legacy MariaDB format)
  const type = (process.env.DB_TYPE as DatabaseType) || "mariadb";

  const config: DatabaseConfig = {
    type,
    database: process.env.DB_NAME || "app",
  };

  // Add connection details for non-SQLite databases
  if (type !== "sqlite" && type !== "disabled") {
    config.host = process.env.DB_HOST || "localhost";
    config.port = parseInt(
      process.env.DB_PORT || getDefaultPort(type).toString(),
    );
    config.user = process.env.DB_USER || "root";
    config.password = process.env.DB_PASSWORD || "";
    config.ssl = process.env.DB_SSL === "true";
  }

  // SQLite specific configuration
  if (type === "sqlite") {
    config.filename = process.env.DB_FILENAME || "./data/app.db";
  }

  // Additional options
  config.connectionLimit = parseInt(process.env.DB_POOL_SIZE || "10");
  config.acquireTimeout = parseInt(process.env.DB_ACQUIRE_TIMEOUT || "30000");
  config.timeout = parseInt(process.env.DB_TIMEOUT || "30000");
  config.charset = process.env.DB_CHARSET || "utf8mb4";
  config.timezone = process.env.DB_TIMEZONE || "UTC";

  return DatabaseConfigSchema.parse(config);
}

// Parse DATABASE_URL format
function parseDatabaseUrl(url: string): DatabaseConfig {
  try {
    const parsed = new URL(url);

    let type: DatabaseType;
    switch (parsed.protocol.replace(":", "")) {
      case "sqlite":
        type = "sqlite";
        break;
      case "mysql":
        type = "mysql";
        break;
      case "mariadb":
        type = "mariadb";
        break;
      case "postgresql":
      case "postgres":
        type = "postgresql";
        break;
      default:
        throw new Error(`Unsupported database protocol: ${parsed.protocol}`);
    }

    const config: DatabaseConfig = {
      type,
      database: parsed.pathname.replace("/", "") || "app",
    };

    // SQLite uses the pathname as filename
    if (type === "sqlite") {
      // Handle SQLite URL like sqlite:///path/to/db or sqlite:///%kernel.project_dir%/var/data.db
      let filename = parsed.pathname;
      if (filename.startsWith("/")) filename = filename.substring(1);

      // Handle special tokens like %kernel.project_dir%
      filename = filename.replace("%kernel.project_dir%", process.cwd());

      config.filename = filename || "./data/app.db";
    } else {
      // Network databases
      config.host = parsed.hostname || "localhost";
      config.port = parsed.port ? parseInt(parsed.port) : getDefaultPort(type);
      config.user = parsed.username || "root";
      config.password = parsed.password || "";
    }

    // Parse query parameters
    const searchParams = parsed.searchParams;
    config.ssl =
      searchParams.get("ssl") === "true" ||
      searchParams.get("sslmode") === "require";
    config.charset = searchParams.get("charset") || "utf8mb4";
    config.timezone = searchParams.get("timezone") || "UTC";

    // Parse connection pool settings
    if (searchParams.get("connectionLimit")) {
      config.connectionLimit = parseInt(searchParams.get("connectionLimit")!);
    }

    return DatabaseConfigSchema.parse(config);
  } catch (error) {
    console.error("Failed to parse DATABASE_URL:", error);
    throw new Error(`Invalid DATABASE_URL format: ${url}`);
  }
}

// Get default port for database type
function getDefaultPort(type: DatabaseType): number {
  switch (type) {
    case "mysql":
    case "mariadb":
      return 3306;
    case "postgresql":
      return 5432;
    case "sqlite":
    default:
      return 0; // Not applicable for SQLite
  }
}

// Generate example DATABASE_URL for each type
export function getExampleDatabaseUrls(): Record<DatabaseType, string> {
  return {
    sqlite: "sqlite:///%kernel.project_dir%/var/data.db",
    mysql:
      "mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=8.0.32&charset=utf8mb4",
    mariadb:
      "mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=10.11.2-MariaDB&charset=utf8mb4",
    postgresql:
      "postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8",
    disabled: "", // Not applicable
  };
}

// Validate database configuration
export function validateDatabaseConfig(config: DatabaseConfig): string[] {
  const errors: string[] = [];

  if (config.type === "disabled") {
    return errors; // No validation needed for disabled database
  }

  if (!config.database) {
    errors.push("Database name is required");
  }

  if (config.type === "sqlite") {
    if (!config.filename) {
      errors.push("SQLite filename is required");
    }
  } else {
    if (!config.host) {
      errors.push("Database host is required");
    }
    if (!config.port || config.port <= 0) {
      errors.push("Valid database port is required");
    }
    if (!config.user) {
      errors.push("Database user is required");
    }
  }

  return errors;
}

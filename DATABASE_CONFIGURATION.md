# Database Configuration Guide

This application supports multiple database types and can be configured to use any of the following databases:

## Supported Database Types

- **SQLite** - Local file-based database (great for development)
- **MySQL** - Popular open-source database
- **MariaDB** - MySQL-compatible database
- **PostgreSQL** - Advanced open-source database
- **Memory Storage** - In-memory storage (fallback mode)

## Configuration Methods

### Method 1: Using DATABASE_URL (Recommended)

Set the `DATABASE_URL` environment variable with the appropriate connection string:

```bash
# SQLite (local file)
DATABASE_URL="sqlite:///data/app.db"
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"

# MySQL
DATABASE_URL="mysql://username:password@host:3306/database?serverVersion=8.0.32&charset=utf8mb4"

# MariaDB
DATABASE_URL="mysql://username:password@host:3306/database?serverVersion=10.11.2-MariaDB&charset=utf8mb4"

# PostgreSQL
DATABASE_URL="postgresql://username:password@host:5432/database?serverVersion=16&charset=utf8"
```

### Method 2: Individual Environment Variables (Legacy)

```bash
# Database type
DB_TYPE=mariadb          # sqlite, mysql, mariadb, postgresql

# Connection details (not needed for SQLite)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=app

# SQLite specific (when DB_TYPE=sqlite)
DB_FILENAME=./data/app.db

# Optional settings
DB_SSL=false
DB_POOL_SIZE=10
DB_ACQUIRE_TIMEOUT=30000
DB_TIMEOUT=30000
DB_CHARSET=utf8mb4
DB_TIMEZONE=UTC
```

### Method 3: Disable Database

To run with in-memory storage only:

```bash
DATABASE_URL=""
# OR
DB_ENABLED=false
```

## Installation Requirements

Depending on the database type you choose, you may need to install additional dependencies:

### SQLite
```bash
npm install sqlite sqlite3
```

### MySQL/MariaDB
```bash
npm install mariadb
```

### PostgreSQL
```bash
npm install pg @types/pg
```

## Example Configurations

### Development (SQLite)
```bash
DATABASE_URL="sqlite:///data/development.db"
```

### Production (MariaDB)
```bash
DATABASE_URL="mysql://app_user:secure_password@db.example.com:3306/production_app?serverVersion=10.11.2-MariaDB&charset=utf8mb4&ssl=true"
```

### Cloud PostgreSQL
```bash
DATABASE_URL="postgresql://user:password@cloud-db.example.com:5432/app?serverVersion=16&charset=utf8&ssl=true"
```

### Local MySQL Development
```bash
DATABASE_URL="mysql://root:password@localhost:3306/seo_manager?serverVersion=8.0.32&charset=utf8mb4"
```

## Configuration Priority

The application uses the following priority order for database configuration:

1. `DATABASE_URL` environment variable (if set and not empty)
2. Individual `DB_*` environment variables
3. Default values with memory storage fallback

## Graceful Fallback

If the database connection fails, the application will automatically fall back to in-memory storage mode. This ensures the application remains functional even if:

- Database server is unavailable
- Connection credentials are incorrect
- Required database dependencies are not installed
- Network connectivity issues occur

In memory storage mode:
- Connected Shopify stores and their products are stored in memory
- All SEO tools continue to work with the in-memory data
- Data is lost when the server restarts
- Perfect for development and testing

## Migration and Schema

The application automatically:
- Creates necessary database tables on first run
- Runs database migrations to keep schema up to date
- Handles schema differences between database types
- Seeds initial data if needed

## Health Check

You can check database connectivity status through the application's health check endpoint or logs. The application will show:
- Database type and connection status
- Configuration details (passwords hidden)
- Migration status
- Fallback mode status

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check if database server is running
   - Verify network connectivity
   - Confirm firewall settings

2. **Authentication Failed**
   - Verify username and password
   - Check user permissions
   - Ensure database exists

3. **Dependencies Missing**
   - Install required npm packages for your database type
   - Check package.json for correct versions

4. **SSL Issues**
   - Set ssl=true in DATABASE_URL for secure connections
   - Verify SSL certificate configuration

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will show detailed database configuration and connection attempts.

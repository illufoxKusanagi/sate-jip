#!/bin/sh
set -e

echo "🚀 Starting SATE-ITIK application..."

# Determine which database we're using
DB_TYPE=${DB_TYPE:-mysql}
echo "📊 Database type: $DB_TYPE"

# Check if we should wait for database (only for local Docker Compose setups)
# Skip waiting if using managed/external databases (e.g., Render PostgreSQL, company MySQL)
if [ "$SKIP_DB_WAIT" = "true" ]; then
  echo "⏭️  Skipping database connection wait (using managed database)"
else
  echo "🔍 Checking database availability..."

  if [ "$DB_TYPE" = "postgres" ]; then
    # For PostgreSQL, prefer extracting from DATABASE_URL
    if [ -n "$DATABASE_URL" ]; then
      # Extract host and port from DATABASE_URL
      # Format: postgresql://user:pass@host:port/database
      EXTRACTED_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:\/]*\).*/\1/p')
      EXTRACTED_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*@[^:]*:\([0-9]*\)\/.*/\1/p')

      # Use extracted values if valid, otherwise use defaults
      if [ -n "$EXTRACTED_HOST" ] && [ "$EXTRACTED_HOST" != "localhost" ]; then
        DB_WAIT_HOST="$EXTRACTED_HOST"
        DB_WAIT_PORT="${EXTRACTED_PORT:-5432}"
      else
        # Local setup
        DB_WAIT_HOST="${DB_HOST:-postgres}"
        DB_WAIT_PORT="${DB_PORT:-5432}"
      fi
    else
      # No DATABASE_URL, use environment variables or defaults
      DB_WAIT_HOST="${DB_HOST:-postgres}"
      DB_WAIT_PORT="${DB_PORT:-5432}"
    fi

    echo "⏳ Waiting for PostgreSQL at $DB_WAIT_HOST:$DB_WAIT_PORT..."

    # Only wait if it's a local Docker container (not external managed DB)
    if [ "$DB_WAIT_HOST" = "postgres" ] || [ "$DB_WAIT_HOST" = "localhost" ] || [ "$DB_WAIT_HOST" = "127.0.0.1" ]; then
      until nc -z "$DB_WAIT_HOST" "$DB_WAIT_PORT" 2>/dev/null; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 2
      done
      echo "✅ PostgreSQL is ready!"
    else
      echo "ℹ️  Using external PostgreSQL at $DB_WAIT_HOST:$DB_WAIT_PORT (skipping wait)"
    fi

  elif [ "$DB_TYPE" = "mysql" ]; then
    # Wait for MySQL to be ready
    # Use mysql as default host for Docker Compose
    DB_WAIT_HOST="${DB_HOST:-mysql}"
    DB_WAIT_PORT="${DB_PORT:-3306}"

    echo "⏳ Waiting for MySQL at $DB_WAIT_HOST:$DB_WAIT_PORT..."

    # Only wait if it's a local Docker container (not external managed DB)
    if [ "$DB_WAIT_HOST" = "mysql" ] || [ "$DB_WAIT_HOST" = "localhost" ] || [ "$DB_WAIT_HOST" = "127.0.0.1" ]; then
      until nc -z "$DB_WAIT_HOST" "$DB_WAIT_PORT" 2>/dev/null; do
        echo "MySQL is unavailable - sleeping"
        sleep 2
      done
      echo "✅ MySQL is ready!"
    else
      echo "ℹ️  Using external MySQL at $DB_WAIT_HOST:$DB_WAIT_PORT (skipping wait)"
    fi

  else
    echo "⚠️  Unknown DB_TYPE: $DB_TYPE"
    exit 1
  fi
fi

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:migrate || echo "⚠️  Migration failed or already applied"

# Seed database if needed (optional - comment out in production if not needed)
# echo "🌱 Seeding database..."
# npm run db:seed || echo "⚠️  Seeding failed or already done"

echo "✅ Database setup complete!"

# Start the application
echo "🎯 Starting Next.js server..."
exec node server.js

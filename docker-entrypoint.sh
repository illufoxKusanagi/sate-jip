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
  if [ "$DB_TYPE" = "postgres" ]; then
    # Wait for PostgreSQL to be ready
    DB_HOST=${DB_HOST:-postgres}
    DB_PORT=${DB_PORT:-5432}
    echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

    # Only wait if host is reachable (not for external managed DBs)
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null || [ "$DB_HOST" != "postgres" ]; then
      until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 2
      done
      echo "✅ PostgreSQL is ready!"
    else
      echo "ℹ️  Using external PostgreSQL (skipping wait)"
    fi

  elif [ "$DB_TYPE" = "mysql" ]; then
    # Wait for MySQL to be ready
    DB_HOST=${DB_HOST:-mysql}
    DB_PORT=${DB_PORT:-3306}
    echo "⏳ Waiting for MySQL at $DB_HOST:$DB_PORT..."

    # Only wait if host is reachable (not for external managed DBs)
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null || [ "$DB_HOST" != "mysql" ]; then
      until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
        echo "MySQL is unavailable - sleeping"
        sleep 2
      done
      echo "✅ MySQL is ready!"
    else
      echo "ℹ️  Using external MySQL (skipping wait)"
    fi

  else
    echo "⚠️  Unknown DB_TYPE: $DB_TYPE"
    exit 1
  fi
fi

# Run database migrations
echo "🔄 Running database migrations..."
if [ "$DB_TYPE" = "postgres" ]; then
  npm run db:migrate:docker || echo "⚠️  Migration failed or already applied"
elif [ "$DB_TYPE" = "mysql" ]; then
  npm run db:migrate:docker || echo "⚠️  Migration failed or already applied"
fi

# Seed database if needed (optional - comment out in production if not needed)
# echo "🌱 Seeding database..."
# npm run db:seed:docker || echo "⚠️  Seeding failed or already done"

echo "✅ Database setup complete!"

# Start the application
echo "🎯 Starting Next.js server..."
exec node server.js

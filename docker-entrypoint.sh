#!/bin/sh
set -e

echo "🚀 Starting SATE-ITIK application..."

# Check if we should wait for database (only for local Docker Compose setups)
# Skip waiting if using managed/external databases (e.g., company MySQL)
if [ "$SKIP_DB_WAIT" = "true" ]; then
  echo "⏭️  Skipping database connection wait (using managed database)"
else
  echo "🔍 Checking database availability..."

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

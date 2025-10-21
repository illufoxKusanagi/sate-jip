#!/bin/sh
set -e

echo "🚀 Starting SATE-ITIK application..."

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
until nc -z mysql 3306; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done
echo "✅ MySQL is ready!"

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:migrate:docker || echo "⚠️  Migration failed or already applied"

# Seed database if needed (optional - comment out in production if not needed)
# echo "🌱 Seeding database..."
# npm run db:seed:docker || echo "⚠️  Seeding failed or already done"

echo "✅ Database setup complete!"

# Start the application
echo "🎯 Starting Next.js server..."
exec node server.js

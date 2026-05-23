#!/bin/sh
set -e

echo "=== LootMiner Backend Startup ==="

# Generate Prisma client (in case it wasn't generated during build)
npx prisma generate

# Run migrations if they exist, otherwise push schema
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
else
  echo "No migrations found. Pushing schema directly..."
  npx prisma db push --accept-data-loss
fi

# Seed data (idempotent)
echo "Seeding database..."
npx prisma db seed || true

echo "Starting server..."
exec node dist/index.js

# Multi-stage build for production deployment
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
# This leverages Docker layer caching. This layer is only rebuilt when package*.json changes.
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy source code
# A .dockerignore file is used to prevent copying unnecessary files (like .git, node_modules)
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for Next.js public env vars
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_MAPBOX_SESSION_TOKEN
ARG NEXT_PUBLIC_APP_URL

# Set environment variables for build
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_MAPBOX_SESSION_TOKEN=$NEXT_PUBLIC_MAPBOX_SESSION_TOKEN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Build arguments - these won't actually be used during build
# but prevents Next.js from trying to evaluate them
ARG DATABASE_URL=mysql://build:build@localhost:3306/build
ARG DB_HOST=localhost
ARG RESEND_API_KEY=re_build

# Set dummy environment variables for build only
ENV DATABASE_URL=$DATABASE_URL
ENV DB_HOST=$DB_HOST
ENV RESEND_API_KEY=$RESEND_API_KEY

# Build the Next.js application
# This generates the production build and the standalone output
RUN npm run build

# Stage 2: Production Runner Stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN adduser -S -u 1001 nextjs

# Install netcat for health checks in entrypoint
RUN apk add --no-cache netcat-openbsd

# Copy necessary files from builder
# Copy the standalone server output
COPY --from=builder /app/.next/standalone ./
# Copy static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Copy migration files and scripts for production
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/lib/db ./src/lib/db
# COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json

# Copy entrypoint script
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Set correct permissions
RUN chown -R nextjs:nextjs .

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000

# Use entrypoint script instead of direct node command
ENTRYPOINT ["/app/docker-entrypoint.sh"]

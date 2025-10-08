# Multi-stage build for production deployment

# Stage 1: Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
# This leverages Docker layer caching. This layer is only rebuilt when package*.json changes.
RUN npm ci

# Copy source code
# A .dockerignore file is used to prevent copying unnecessary files (like .git, node_modules)
COPY . .

# Build the Next.js application
# This generates the production build and the standalone output
RUN npm run build

# Stage 2: Production Runner Stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -S -g 1001 nodejs
RUN adduser -S -u 1001 nextjs

# Copy necessary files from builder
# Copy the standalone server output
COPY --from=builder /app/.next/standalone ./
# Copy static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs .

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000

# Start the production server
CMD ["node", "server.js"]
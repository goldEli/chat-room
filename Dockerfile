# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files for both server and client
COPY server/package.json server/pnpm-lock.yaml ./server/
COPY client/package.json client/pnpm-lock.yaml ./client/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies for both server and client
RUN cd /app/server && pnpm install --frozen-lockfile
RUN cd /app/client && pnpm install --frozen-lockfile

# Build client
FROM base AS client-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server ./server
COPY --from=deps /app/client ./client

# Build the client application
WORKDIR /app/client
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Install pnpm
RUN npm install -g pnpm

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Copy server dependencies and source
COPY --from=deps /app/server/package.json /app/server/pnpm-lock.yaml ./
COPY --from=deps /app/server/node_modules ./node_modules
COPY server/src ./src
COPY server/tsconfig.json ./

# Copy built client files to server public directory
COPY --from=client-builder /app/client/dist ./public

# Switch to non-root user
USER node

# Expose port 8075
EXPOSE 8075

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8075', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["pnpm", "start:prod"]
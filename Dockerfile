# Use Node.js 18 Alpine as base image
FROM node:18-alpine

WORKDIR /app

# Install pnpm first
RUN npm install -g pnpm

# Copy package files for both server and client
COPY server/package.json server/pnpm-lock.yaml server/tsconfig.json ./server/
COPY client/package.json client/pnpm-lock.yaml client/tsconfig*.json ./client/

# Install server dependencies and build server
RUN cd /app/server && pnpm install --frozen-lockfile
RUN cd /app/server && pnpm build

# Copy client source before building
COPY client/src ./client/src
COPY client/index.html ./client/
COPY client/vite.config.ts ./client/
COPY client/public ./client/public

# Install client dependencies and build client
RUN cd /app/client && pnpm install --frozen-lockfile
RUN cd /app/client && pnpm build

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Copy server source code
COPY server/src ./src
COPY server/tsconfig.json ./

# Copy built client files to server public directory
COPY client/dist ./public

# Copy built server files and dependencies
COPY server/dist ./dist
COPY server/node_modules ./node_modules

# Switch to non-root user
USER node

# Environment variables
ENV NODE_ENV=production

# Expose port 8075
EXPOSE 8075

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8075', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/main"]
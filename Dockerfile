# Use the official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build process)
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Remove dev dependencies after build (optional optimization)
# RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application (skip build since we already built)
CMD ["node", "index.js"]

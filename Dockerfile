# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Run linting
RUN npm run lint

# Run tests
RUN npm run test:run

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Build arguments for metadata
ARG BUILD_DATE
ARG VCS_REF

# Add labels for image metadata
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}"

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check for container using curl instead of wget
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl --fail --silent --show-error http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

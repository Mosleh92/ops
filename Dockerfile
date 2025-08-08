# =============================================================================
# MALLOS ENTERPRISE - DOCKERFILE for Render Deployment
# =============================================================================

FROM node:18-alpine AS builder

ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1

WORKDIR /app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cmake \
    git \
    curl \
    build-base \
    pkgconfig \
    libjpeg-turbo-dev \
    zlib-dev \
    libpng-dev \
    libwebp-dev \
    tiff-dev \
    && rm -rf /var/cache/apk/*

COPY package*.json ./
COPY tsconfig.json ./
COPY .env.example ./

RUN npm install --legacy-peer-deps

COPY src/ ./src/
RUN npm run build


FROM node:18-alpine AS production

ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs .env.example ./
COPY --chown=nodejs:nodejs ./uploads ./uploads

RUN mkdir -p /app/logs /app/temp /app/uploads && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]

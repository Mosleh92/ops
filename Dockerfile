# ---- Build stage ----
FROM node:20-bullseye-slim AS build
ENV NODE_ENV=production \
    npm_config_build_from_source=false \
    PUPPETEER_SKIP_DOWNLOAD=true
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates dumb-init && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-bullseye-slim
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    chromium fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libc6 libcairo2 libcups2 libdbus-1-3 libdrm2 libexpat1 libgbm1 \
    libglib2.0-0 libgtk-3-0 libnss3 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 \
    libxshmfence1 libxss1 libxtst6 xdg-utils && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:${PORT}/healthz || exit 1
CMD ["dumb-init","npm","start"]

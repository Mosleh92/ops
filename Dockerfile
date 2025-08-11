FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
# Use npm ci when lockfile is present; otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package*.json ./
# Install only production dependencies; fallback when lockfile is absent
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
COPY --from=build /app/dist ./dist
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:${PORT:-3001}/healthz || exit 1
CMD ["node", "dist/server.js"]

# --- 1. deps: install only what we need for the build ---------------------
FROM node:22-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# --- 2. builder: produce a standalone Next.js build -----------------------
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- 3. runner: minimal production image ----------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Static assets & public dir.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Standalone server bundle (next.config: output: 'standalone').
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# The admin needs to write to src/data/products.json at runtime — copy the
# seed file so the volume starts with the canonical product set on first
# boot. The compose volume is mounted ON TOP of this path and persists
# admin edits across restarts.
COPY --from=builder --chown=nextjs:nodejs /app/src/data ./src/data

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

# ----------------------------------------------------
# 1. Base image with minimal shared system libraries
# ----------------------------------------------------
FROM node:22-alpine AS base

# Install openssl for Prisma runtime on Alpine libc
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# ----------------------------------------------------
# 2. Dependencies stage
# ----------------------------------------------------
FROM base AS deps

COPY package*.json ./
RUN npm ci

# ----------------------------------------------------
# 3. Builder stage
# ----------------------------------------------------
FROM base AS builder

# Build arguments for Next.js client-side bundles (baked in at build time)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_ENABLED

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_ENABLED=$NEXT_PUBLIC_CLERK_ENABLED

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy application source code and build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ----------------------------------------------------
# 4. Production Runner stage (Hardened, Non-Root)
# ----------------------------------------------------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Prevent Privilege Escalation: Create a dedicated non-root system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy runtime assets and built output with non-root ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

# Pre-create cache directory with explicit non-root write access
RUN mkdir -p .next/cache && chown -R nextjs:nodejs /app/.next

# Drop root privileges: strictly run application as non-root user (UID 1001)
USER nextjs

# Only expose the application port (do not expose internal DB/cache ports)
EXPOSE 3000

CMD ["npm", "run", "start"]

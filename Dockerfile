FROM node:22-alpine AS base

# Install openssl for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 1. Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# 2. Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# 3. Copy application code and build Next.js
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 4. Expose Next.js port and start
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]

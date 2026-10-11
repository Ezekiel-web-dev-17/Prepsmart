/**
 * Rate Limiting Module for Prepsmart
 *
 * Implements a high-performance Sliding Window Counter rate limiter.
 * Supports:
 * - High-speed in-memory store with automated TTL pruning and memory leak safeguards.
 * - Global cache persistence across Next.js dev server hot-reloads.
 * - Optional Upstash Redis REST fallback for multi-instance distributed environments.
 * - Multi-tiered limits: API reads, API mutations, Auth endpoints, Page navigation, and Server Actions.
 * - Standard RFC-compliant HTTP response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After.
 */

export interface RateLimitOptions {
  /** Window duration in milliseconds (default: 60,000 = 1 minute) */
  windowMs: number;
  /** Maximum number of requests allowed in the window */
  max: number;
  /** Namespace prefix for isolation */
  prefix?: string;
}

export interface RateLimitResult {
  /** Whether the request is permitted */
  success: boolean;
  /** Maximum requests allowed in current window */
  limit: number;
  /** Remaining requests allowed in current window */
  remaining: number;
  /** Unix timestamp in seconds when window resets */
  reset: number;
  /** Cooldown time in seconds before next allowed request (0 if success) */
  retryAfter: number;
}

interface WindowRecord {
  currentWindowStart: number;
  currentCount: number;
  previousCount: number;
  lastAccess: number;
}

// In-memory sliding window cache stored on globalThis to survive Next.js dev hot-reloads
const globalForRateLimit = globalThis as unknown as {
  __rateLimitStore?: Map<string, WindowRecord>;
  __rateLimitLastSweep?: number;
};

const store: Map<string, WindowRecord> =
  globalForRateLimit.__rateLimitStore ?? new Map<string, WindowRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.__rateLimitStore = store;
}

const MAX_STORE_ENTRIES = 20000;
const SWEEP_INTERVAL_MS = 60000; // 1 minute

/**
 * Periodically cleans up expired keys to guarantee bounded memory usage.
 */
function sweepExpiredEntries(now: number, maxWindowMs: number) {
  const lastSweep = globalForRateLimit.__rateLimitLastSweep ?? 0;
  if (now - lastSweep < SWEEP_INTERVAL_MS && store.size < MAX_STORE_ENTRIES) {
    return;
  }
  globalForRateLimit.__rateLimitLastSweep = now;

  for (const [key, record] of store.entries()) {
    // A record older than 2 windows is completely irrelevant
    if (now - record.currentWindowStart >= maxWindowMs * 2) {
      store.delete(key);
    }
  }

  // If still above threshold, drop oldest entries
  if (store.size > MAX_STORE_ENTRIES) {
    const toDelete = store.size - MAX_STORE_ENTRIES;
    let deleted = 0;
    for (const key of store.keys()) {
      store.delete(key);
      deleted++;
      if (deleted >= toDelete) break;
    }
  }
}

/**
 * Sliding Window Counter Rate Limiter
 */
export class RateLimiter {
  readonly windowMs: number;
  readonly max: number;
  readonly prefix: string;

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.prefix = options.prefix ?? "rl:default";
  }

  /**
   * Evaluates and records a request for the given identifier.
   */
  async check(identifier: string): Promise<RateLimitResult> {
    const isRateLimitDisabled = process.env.RATE_LIMIT_ENABLED === "false";
    if (isRateLimitDisabled) {
      return {
        success: true,
        limit: this.max,
        remaining: this.max,
        reset: Math.ceil((Date.now() + this.windowMs) / 1000),
        retryAfter: 0,
      };
    }

    const key = `${this.prefix}:${identifier}`;
    const now = Date.now();

    // 1. Try Upstash Redis if configured
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const upstashResult = await this.checkUpstash(key, now);
        if (upstashResult) return upstashResult;
      } catch (err) {
        // Fallback to in-memory on Upstash network failure
        console.warn("[RateLimiter] Upstash Redis request failed, falling back to memory store:", err);
      }
    }

    // 2. High-performance In-Memory Sliding Window
    return this.checkMemory(key, now);
  }

  private checkMemory(key: string, now: number): RateLimitResult {
    sweepExpiredEntries(now, this.windowMs);

    const currentWindowStart = Math.floor(now / this.windowMs) * this.windowMs;
    let record = store.get(key);

    if (!record || now - record.currentWindowStart >= this.windowMs * 2) {
      // New or expired window
      record = {
        currentWindowStart,
        currentCount: 1,
        previousCount: 0,
        lastAccess: now,
      };
      store.set(key, record);

      const reset = Math.ceil((currentWindowStart + this.windowMs) / 1000);
      return {
        success: true,
        limit: this.max,
        remaining: Math.max(0, this.max - 1),
        reset,
        retryAfter: 0,
      };
    }

    if (now - record.currentWindowStart >= this.windowMs) {
      // Shifted into next window
      record.previousCount = record.currentCount;
      record.currentCount = 1;
      record.currentWindowStart = currentWindowStart;
      record.lastAccess = now;
    } else {
      // Still in current window (cap increment to prevent integer overflow during floods)
      if (record.currentCount < this.max * 5) {
        record.currentCount += 1;
      }
      record.lastAccess = now;
    }

    // Calculate sliding window approximation
    const timeElapsedInCurrent = now - record.currentWindowStart;
    const previousWeight = Math.max(0, (this.windowMs - timeElapsedInCurrent) / this.windowMs);
    const estimatedCount = Math.floor(record.previousCount * previousWeight + record.currentCount);

    const reset = Math.ceil((currentWindowStart + this.windowMs) / 1000);
    const retryAfter = Math.max(1, Math.ceil((currentWindowStart + this.windowMs - now) / 1000));

    if (estimatedCount > this.max) {
      return {
        success: false,
        limit: this.max,
        remaining: 0,
        reset,
        retryAfter,
      };
    }

    return {
      success: true,
      limit: this.max,
      remaining: Math.max(0, this.max - estimatedCount),
      reset,
      retryAfter: 0,
    };
  }

  /**
   * Upstash Redis REST API fallback
   */
  private async checkUpstash(key: string, now: number): Promise<RateLimitResult | null> {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;

    const windowSec = Math.ceil(this.windowMs / 1000);
    const currentWindow = Math.floor(now / this.windowMs);
    const redisKey = `${key}:${currentWindow}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    try {
      // Increment and set expire in an atomic pipeline
      const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["EXPIRE", redisKey, windowSec * 2],
        ]),
        signal: controller.signal,
      });

      if (!response.ok) return null;

      const results = (await response.json()) as Array<{ result?: number }>;
      const count = Number(results[0]?.result ?? 1);

      const reset = Math.ceil(((currentWindow + 1) * this.windowMs) / 1000);
      const retryAfter = Math.max(1, reset - Math.ceil(now / 1000));

      if (count > this.max) {
        return {
          success: false,
          limit: this.max,
          remaining: 0,
          reset,
          retryAfter,
        };
      }

      return {
        success: true,
        limit: this.max,
        remaining: Math.max(0, this.max - count),
        reset,
        retryAfter: 0,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Sanitizes input identifier to alphanumeric and safe boundary characters.
 */
function sanitizeIdentifier(id: string): string {
  return id.replace(/[^a-zA-Z0-9:._-]/g, "").slice(0, 100) || "anonymous";
}

/**
 * Extracts a dependable client identifier from request headers or user session.
 */
export function getClientIdentifier(
  headers: Headers | { get(name: string): string | null },
  userId?: string | null
): string {
  if (userId && typeof userId === "string") {
    return `user:${sanitizeIdentifier(userId)}`;
  }

  // Cloudflare
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return `ip:${sanitizeIdentifier(cfIp.trim())}`;

  // Nginx / Standard proxy
  const realIp = headers.get("x-real-ip");
  if (realIp) return `ip:${sanitizeIdentifier(realIp.trim())}`;

  // Forwarded-For header (first address is the client)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return `ip:${sanitizeIdentifier(firstIp)}`;
  }

  return "ip:127.0.0.1";
}

/**
 * Converts RateLimitResult to standard RFC/IETF HTTP response headers.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": Math.max(0, result.remaining).toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };

  if (!result.success && result.retryAfter > 0) {
    headers["Retry-After"] = result.retryAfter.toString();
  }

  return headers;
}

// ==========================================
// Pre-configured Tiered Rate Limiters
// ==========================================

const envApiMax = Number(process.env.RATE_LIMIT_API_MAX) || 60;
const envMutationMax = Number(process.env.RATE_LIMIT_MUTATION_MAX) || 20;
const envAuthMax = Number(process.env.RATE_LIMIT_AUTH_MAX) || 15;
const envPageMax = Number(process.env.RATE_LIMIT_PAGE_MAX) || 120;
const envActionMax = Number(process.env.RATE_LIMIT_ACTION_MAX) || 20;

/** API Read endpoints (e.g. GET /api/*) */
export const apiLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: envApiMax,
  prefix: "rl:api:read",
});

/** API Mutation endpoints (e.g. POST, PUT, DELETE /api/*) */
export const apiMutationLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: envMutationMax,
  prefix: "rl:api:mutation",
});

/** Auth-related sensitive paths (e.g. /sign-in, /sign-up) */
export const authLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: envAuthMax,
  prefix: "rl:auth",
});

/** Standard Web Page Navigation (HTML pages) */
export const pageLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: envPageMax,
  prefix: "rl:page",
});

/** Server Actions */
export const actionLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: envActionMax,
  prefix: "rl:action",
});

/**
 * Selects the appropriate limiter for an incoming NextRequest.
 */
export async function rateLimitRequest(
  pathname: string,
  method: string,
  identifier: string
): Promise<RateLimitResult> {
  const upperMethod = method.toUpperCase();

  // 1. API routes
  if (pathname.startsWith("/api")) {
    if (["POST", "PUT", "DELETE", "PATCH"].includes(upperMethod)) {
      return apiMutationLimiter.check(identifier);
    }
    return apiLimiter.check(identifier);
  }

  // 2. Authentication pages
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return authLimiter.check(identifier);
  }

  // 3. General web pages
  return pageLimiter.check(identifier);
}

/**
 * Server Action rate limit helper.
 * Call this at the start of any Server Action to guard against automated spam.
 */
export async function checkServerActionRateLimit(
  customLimiter: RateLimiter = actionLimiter
): Promise<{ allowed: true } | { allowed: false; error: string; retryAfter: number }> {
  try {
    // Dynamic import to avoid issues in edge / client contexts
    const { headers } = await import("next/headers");
    const headerList = await headers();
    const identifier = getClientIdentifier(headerList);

    const result = await customLimiter.check(identifier);
    if (!result.success) {
      return {
        allowed: false,
        error: `Rate limit exceeded. Please wait ${result.retryAfter} seconds before trying again.`,
        retryAfter: result.retryAfter,
      };
    }

    return { allowed: true };
  } catch {
    // If headers() is unavailable or fails, allow execution safely
    return { allowed: true };
  }
}

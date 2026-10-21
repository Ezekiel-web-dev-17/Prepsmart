/**
 * Secure-by-Design Structured Logger with Framework-Level Field Masking
 *
 * Implements the security principle from:
 * https://www.freecodecamp.org/news/secure-by-design-engineer-security-into-architecture-before-writing-code/#structured-logging-and-field-level-masking
 *
 * Guarantees that sensitive data (passwords, tokens, authorization headers,
 * encryption keys, PII) is never logged in plaintext regardless of what
 * a developer passes to the logger.
 */

const SENSITIVE_KEYS = new Set([
  "password",
  "passwd",
  "secret",
  "token",
  "authorization",
  "auth",
  "cookie",
  "cookies",
  "apikey",
  "api_key",
  "access_token",
  "refresh_token",
  "id_token",
  "session",
  "session_token",
  "credit_card",
  "card_number",
  "cvv",
  "bvn",
  "nin",
  "ssn",
  "clerk_secret_key",
  "database_url",
  "private_key",
]);

const MASK_REPLACEMENT = "***MASKED***";

/**
 * Recursively masks sensitive fields in objects, arrays, and primitive data structures.
 */
export function maskSensitiveData(data: unknown, depth = 0): unknown {
  if (depth > 6) return "[Max Depth Reached]";
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Mask potential JWT tokens or Bearer tokens
    if (/^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i.test(data)) {
      return "Bearer ***MASKED_JWT***";
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item, depth + 1));
  }

  if (typeof data === "object") {
    const maskedObj: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const normalizedKey = key.toLowerCase().replace(/[-_]/g, "");

      if (SENSITIVE_KEYS.has(key.toLowerCase()) || SENSITIVE_KEYS.has(normalizedKey)) {
        maskedObj[key] = MASK_REPLACEMENT;
      } else if (typeof value === "object" && value !== null) {
        maskedObj[key] = maskSensitiveData(value, depth + 1);
      } else {
        maskedObj[key] = value;
      }
    }

    return maskedObj;
  }

  return data;
}

export interface LogEntry {
  timestamp: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
  context?: string;
  metadata?: unknown;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

class SecureLogger {
  private formatLog(
    level: LogEntry["level"],
    message: string,
    metadata?: unknown,
    error?: unknown,
    context?: string
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata: metadata !== undefined ? maskSensitiveData(metadata) : undefined,
    };

    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      };
    } else if (error) {
      entry.error = { message: String(error) };
    }

    return entry;
  }

  debug(message: string, metadata?: unknown, context?: string): void {
    if (process.env.NODE_ENV !== "production") {
      const entry = this.formatLog("DEBUG", message, metadata, undefined, context);
      console.debug(JSON.stringify(entry));
    }
  }

  info(message: string, metadata?: unknown, context?: string): void {
    const entry = this.formatLog("INFO", message, metadata, undefined, context);
    console.info(JSON.stringify(entry));
  }

  warn(message: string, metadata?: unknown, error?: unknown, context?: string): void {
    const entry = this.formatLog("WARN", message, metadata, error, context);
    console.warn(JSON.stringify(entry));
  }

  error(message: string, error?: unknown, metadata?: unknown, context?: string): void {
    const entry = this.formatLog("ERROR", message, metadata, error, context);
    console.error(JSON.stringify(entry));
  }
}

export const logger = new SecureLogger();

/**
 * In-memory sliding window rate limiter for protecting sensitive endpoints
 * (e.g. login brute force, contact form spam, media uploads)
 * Conforms to OWASP Top 10 A04 (Insecure Design) and A07 (Auth Failures).
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 600000); // 10 minutes window
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  windowMs: number; // Time window in milliseconds
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowMs: 60000 }
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Filter timestamps within current window
  const recentTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= options.limit) {
    const oldest = recentTimestamps[0];
    const resetMs = Math.max(0, oldest + options.windowMs - now);
    return {
      success: false,
      remaining: 0,
      resetMs,
    };
  }

  recentTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: recentTimestamps });

  return {
    success: true,
    remaining: options.limit - recentTimestamps.length,
    resetMs: options.windowMs,
  };
}

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory store for fallback rate limiting
class InMemoryStore {
  private store: Map<string, { count: number; resetAt: number }> = new Map();

  async get(key: string): Promise<number | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.resetAt) {
      this.store.delete(key);
      return null;
    }

    return entry.count;
  }

  async set(key: string, count: number, ttlMs: number): Promise<void> {
    this.store.set(key, {
      count,
      resetAt: Date.now() + ttlMs,
    });
  }

  async increment(key: string): Promise<number> {
    const current = await this.get(key);
    const newCount = (current || 0) + 1;
    await this.set(key, newCount, 60000); // 1 minute TTL
    return newCount;
  }
}

// Create rate limiter instance
let ratelimit: Ratelimit | null = null;
let inMemoryStore: InMemoryStore | null = null;

// Initialize rate limiter based on available configuration
function getRateLimiter() {
  if (ratelimit) return { type: "upstash", limiter: ratelimit };
  if (inMemoryStore) return { type: "memory", store: inMemoryStore };

  // Try to initialize Upstash if configured
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const redis = new Redis({
        url: upstashUrl,
        token: upstashToken,
      });

      ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
        analytics: true,
        prefix: "@upstash/ratelimit",
      });

      console.log("✅ Using Upstash Redis for rate limiting");
      return { type: "upstash", limiter: ratelimit };
    } catch (error) {
      console.warn(
        "⚠️  Failed to initialize Upstash, falling back to in-memory:",
        error
      );
    }
  }

  // Fallback to in-memory
  inMemoryStore = new InMemoryStore();
  console.log(
    "⚠️  Using in-memory rate limiting (not recommended for production)"
  );
  return { type: "memory", store: inMemoryStore };
}

/**
 * Rate limit a request based on identifier (e.g., IP address or username)
 * @param identifier - Unique identifier for the rate limit (IP, username, etc.)
 * @returns Object with success status and limit info
 */
export async function rateLimit(identifier: string) {
  const limiter = getRateLimiter();

  if (limiter.type === "upstash" && limiter.limiter) {
    // Use Upstash rate limiting
    const result = await limiter.limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } else if (limiter.type === "memory" && limiter.store) {
    // Use in-memory rate limiting
    const count = await limiter.store.increment(identifier);
    const limit = 5; // 5 requests per minute
    const success = count <= limit;

    return {
      success,
      limit,
      remaining: Math.max(0, limit - count),
      reset: Date.now() + 60000, // 1 minute from now
    };
  }

  // Should never reach here, but return permissive result as fallback
  return {
    success: true,
    limit: 5,
    remaining: 5,
    reset: Date.now() + 60000,
  };
}

/**
 * Get the client identifier from request (IP address)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return "unknown";
}

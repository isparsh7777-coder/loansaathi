const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Simple fixed-window limiter, in-memory. Good enough for launch traffic;
 * swap for Upstash/Redis if you're on multiple serverless instances at scale.
 */
export function rateLimit(key: string, maxAttempts: number, windowSeconds: number): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }

  if (entry.count >= maxAttempts) return false;

  entry.count += 1;
  return true;
}

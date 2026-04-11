// lib/rateLimit.ts — sliding-window rate limiter (in-process, per instance)
// Good enough for a Vercel hobby project; swap for Upstash Redis in Phase 4+.
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, number[]>({
  max: 500,          // track up to 500 unique IPs
  ttl: 60 * 1000,   // entries expire after 60 s
})

/**
 * Returns { success: true } when the IP is within the allowed limit.
 * Returns { success: false } when the IP has exceeded it.
 *
 * @param ip      - the caller's IP address
 * @param limit   - max requests allowed per window
 * @param windowMs - rolling window length in milliseconds
 */
export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { success: boolean } {
  const now = Date.now()
  const cutoff = now - windowMs

  const hits = (cache.get(ip) ?? []).filter((t) => t > cutoff)

  if (hits.length >= limit) {
    return { success: false }
  }

  hits.push(now)
  cache.set(ip, hits)
  return { success: true }
}

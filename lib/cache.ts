/**
 * Simple in-memory cache to reduce database queries
 * Reduces bandwidth by caching frequently accessed data
 */

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function get<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  
  return cached.data as T
}

export function set(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export function invalidate(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

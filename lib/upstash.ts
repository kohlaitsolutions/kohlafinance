import { Redis } from "@upstash/redis"

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error("Missing Upstash Redis environment variables")
}

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

// Cache keys
export const CACHE_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,
  USER_ACCOUNTS: (userId: string) => `accounts:${userId}`,
  USER_TRANSACTIONS: (userId: string) => `transactions:${userId}`,
  CRYPTO_PRICES: "crypto:prices",
  EXCHANGE_RATES: "exchange:rates",
  MARKET_DATA: "market:data",
} as const

// Cache TTL in seconds
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  DAILY: 86400, // 24 hours
} as const

// Helper functions
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data as T
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export async function setCachedData<T>(key: string, data: T, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
  try {
    await redis.setex(key, ttl, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Redis set error:", error)
    return false
  }
}

export async function deleteCachedData(key: string): Promise<boolean> {
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error("Redis delete error:", error)
    return false
  }
}

export async function incrementCounter(key: string, ttl?: number): Promise<number> {
  try {
    const count = await redis.incr(key)
    if (ttl && count === 1) {
      await redis.expire(key, ttl)
    }
    return count
  } catch (error) {
    console.error("Redis increment error:", error)
    return 0
  }
}

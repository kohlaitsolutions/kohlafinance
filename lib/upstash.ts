import { kv } from "@vercel/kv"

export async function storeInKV(key: string, value: any, expirationSeconds?: number): Promise<void> {
  try {
    if (expirationSeconds) {
      await kv.set(key, value, { ex: expirationSeconds })
    } else {
      await kv.set(key, value)
    }
  } catch (error) {
    console.error("Error storing in KV:", error)
    throw error
  }
}

export async function getFromKV<T>(key: string): Promise<T | null> {
  try {
    return await kv.get(key)
  } catch (error) {
    console.error("Error getting from KV:", error)
    return null
  }
}

export async function deleteFromKV(key: string): Promise<void> {
  try {
    await kv.del(key)
  } catch (error) {
    console.error("Error deleting from KV:", error)
    throw error
  }
}

import { Redis } from "@upstash/redis"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function storeInKV<T>(key: string, value: T): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value))
  } catch (error) {
    console.error("Error storing in KV:", error)
    throw error
  }
}

export async function getFromKV<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value as string) : null
  } catch (error) {
    console.error("Error getting from KV:", error)
    return null
  }
}

export async function deleteFromKV(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("Error deleting from KV:", error)
    throw error
  }
}

// Demo data storage functions
export async function storeDemoData() {
  const demoAccounts = [
    {
      id: "demo-1",
      name: "Checking Account",
      balance: 5280.42,
      type: "checking",
    },
    {
      id: "demo-2",
      name: "Savings Account",
      balance: 12750.89,
      type: "savings",
    },
  ]

  const demoTransactions = [
    {
      id: "demo-tx-1",
      account_id: "demo-1",
      amount: 125.5,
      description: "Netflix Subscription",
      type: "payment",
      date: new Date().toISOString(),
    },
  ]

  await storeInKV("demo:accounts", demoAccounts)
  await storeInKV("demo:transactions", demoTransactions)
}

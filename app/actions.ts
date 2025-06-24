"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Demo actions that simulate functionality without database
export async function createAccount(formData: FormData) {
  const accountName = formData.get("accountName") as string
  const accountType = formData.get("accountType") as string
  const currency = formData.get("currency") as string
  const initialDeposit = Number.parseFloat(formData.get("initialDeposit") as string) || 0

  // Simulate account creation
  console.log("Creating account:", { accountName, accountType, currency, initialDeposit })

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function createCard(formData: FormData) {
  const accountId = formData.get("accountId") as string
  const cardType = formData.get("cardType") as string

  // Simulate card creation
  console.log("Creating card:", { accountId, cardType })

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  revalidatePath("/account")
  redirect("/account")
}

export async function updateUserProfile(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string

  // Simulate profile update
  console.log("Updating profile:", { firstName, lastName, email })

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  revalidatePath("/account")
}

export async function updateUserSettings(formData: FormData) {
  const theme = formData.get("theme") as string
  const emailNotifications = formData.has("emailNotifications")
  const pushNotifications = formData.has("pushNotifications")
  const smsNotifications = formData.has("smsNotifications")

  // Simulate settings update
  console.log("Updating settings:", { theme, emailNotifications, pushNotifications, smsNotifications })

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  revalidatePath("/settings")
}

export async function makeTransaction(formData: FormData) {
  const fromAccountId = formData.get("fromAccount") as string
  const toAccount = formData.get("toAccount") as string
  const recipientName = formData.get("recipientName") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = (formData.get("description") as string) || null

  // Simulate transaction
  console.log("Making transaction:", { fromAccountId, toAccount, recipientName, amount, description })

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
}

// Remove all Supabase-related actions
export async function storeUserCredentials(userData: {
  userId: string
  email: string
  firstName: string
  lastName: string
}) {
  // Demo implementation
  console.log("Storing user credentials:", userData)
  return { success: true }
}

export async function getUserByEmail(email: string) {
  // Demo implementation
  console.log("Getting user by email:", email)
  return { success: true, data: { userId: "demo-user", email } }
}

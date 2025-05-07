"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { generateAccountNumber, generateCardNumber } from "@/lib/utils"
import { storeInKV, getFromKV } from "@/lib/upstash"

export async function createAccount(formData: FormData) {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/")
  }

  const userId = session.user.id
  const accountName = formData.get("accountName") as string
  const accountType = formData.get("accountType") as string
  const currency = formData.get("currency") as string
  const initialDeposit = Number.parseFloat(formData.get("initialDeposit") as string) || 0

  const accountNumber = generateAccountNumber()

  const { error } = await supabase.from("accounts").insert({
    user_id: userId,
    account_name: accountName,
    account_type: accountType,
    account_number: accountNumber,
    balance: initialDeposit,
    currency,
    is_primary: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function createCard(formData: FormData) {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/")
  }

  const userId = session.user.id
  const accountId = formData.get("accountId") as string
  const cardType = formData.get("cardType") as string

  const { data: userData } = await supabase.from("users").select("first_name, last_name").eq("id", userId).single()

  if (!userData) {
    throw new Error("User not found")
  }

  const cardHolder = `${userData.first_name} ${userData.last_name}`.toUpperCase()
  const cardNumber = generateCardNumber()

  // Generate expiry date 3 years from now
  const expiryDate = new Date()
  expiryDate.setFullYear(expiryDate.getFullYear() + 3)
  const month = String(expiryDate.getMonth() + 1).padStart(2, "0")
  const year = String(expiryDate.getFullYear()).slice(-2)
  const expiryDateString = `${month}/${year}`

  const { error } = await supabase.from("cards").insert({
    user_id: userId,
    account_id: accountId,
    card_number: cardNumber,
    card_holder: cardHolder,
    expiry_date: expiryDateString,
    card_type: cardType,
    is_active: true,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/account")
  redirect("/account")
}

export async function updateUserProfile(formData: FormData) {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/")
  }

  const userId = session.user.id
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string

  const { error } = await supabase
    .from("users")
    .update({
      first_name: firstName,
      last_name: lastName,
      email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/account")
}

export async function updateUserSettings(formData: FormData) {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/")
  }

  const userId = session.user.id
  const theme = formData.get("theme") as string
  const emailNotifications = formData.has("emailNotifications")
  const pushNotifications = formData.has("pushNotifications")
  const smsNotifications = formData.has("smsNotifications")

  const { data } = await supabase.from("user_settings").select().eq("user_id", userId).maybeSingle()

  if (data) {
    // Update existing settings
    await supabase
      .from("user_settings")
      .update({
        theme,
        notification_preferences: {
          email: emailNotifications,
          push: pushNotifications,
          sms: smsNotifications,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
  } else {
    // Create new settings
    await supabase.from("user_settings").insert({
      user_id: userId,
      theme,
      notification_preferences: {
        email: emailNotifications,
        push: pushNotifications,
        sms: smsNotifications,
      },
    })
  }

  revalidatePath("/settings")
}

export async function makeTransaction(formData: FormData) {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/")
  }

  const fromAccountId = formData.get("fromAccount") as string
  const toAccount = formData.get("toAccount") as string
  const recipientName = formData.get("recipientName") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = (formData.get("description") as string) || null

  // Start a transaction
  const { data: fromAccount } = await supabase.from("accounts").select("balance").eq("id", fromAccountId).single()

  if (!fromAccount) {
    throw new Error("Account not found")
  }

  if (fromAccount.balance < amount) {
    throw new Error("Insufficient funds")
  }

  // Update sender's account balance
  const { error: updateError } = await supabase
    .from("accounts")
    .update({
      balance: fromAccount.balance - amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", fromAccountId)

  if (updateError) {
    throw new Error(updateError.message)
  }

  // Record the transaction
  const { error: transactionError } = await supabase.from("transactions").insert({
    account_id: fromAccountId,
    transaction_type: "payment",
    amount,
    description,
    recipient_name: recipientName,
    recipient_account: toAccount,
    status: "completed",
  })

  if (transactionError) {
    throw new Error(transactionError.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
}

export async function confirmEmail(userId: string) {
  try {
    const supabase = getSupabaseServerClient()

    // Use the admin API to update the user's email_confirmed_at field
    const { error } = await supabase.auth.admin.updateUserById(userId, { email_confirmed_at: new Date().toISOString() })

    if (error) {
      console.error("Error confirming email:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in confirmEmail action:", error)
    return { success: false, error: "Server error confirming email" }
  }
}

export async function autoVerifyUser(userId: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })

    if (error) {
      console.error("Error auto-verifying user:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in autoVerifyUser action:", error)
    return { success: false, error: "Server error auto-verifying user" }
  }
}

// New actions for Upstash KV integration
export async function storeUserCredentials(userData: {
  userId: string
  email: string
  firstName: string
  lastName: string
}) {
  try {
    // Store user credentials in Upstash KV
    // Use the user ID as the key
    const key = `user:${userData.userId}`
    await storeInKV(key, userData)

    // Also store a mapping from email to user ID for easy lookup
    const emailKey = `email:${userData.email}`
    await storeInKV(emailKey, userData.userId)

    return { success: true }
  } catch (error) {
    console.error("Error storing user credentials:", error)
    return { success: false, error: "Failed to store user credentials" }
  }
}

export async function getUserByEmail(email: string) {
  try {
    // Get the user ID from the email mapping
    const emailKey = `email:${email}`
    const userId = await getFromKV<string>(emailKey)

    if (!userId) {
      return { success: false, error: "User not found" }
    }

    // Get the user data using the user ID
    const userKey = `user:${userId}`
    const userData = await getFromKV(userKey)

    return { success: true, data: userData }
  } catch (error) {
    console.error("Error getting user by email:", error)
    return { success: false, error: "Failed to get user" }
  }
}

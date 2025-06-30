"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { transferSchema, profileUpdateSchema } from "@/lib/validation"

// Demo data store (in production, this would be a database)
const demoTransactions: any[] = []
const demoUsers = new Map()

export async function makeTransaction(formData: FormData) {
  try {
    const data = {
      fromAccount: formData.get("fromAccount") as string,
      toAccount: formData.get("toAccount") as string,
      recipientName: formData.get("recipientName") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      description: (formData.get("description") as string) || "",
    }

    // Validate the data
    const validatedData = transferSchema.parse(data)

    // Create demo transaction
    const transaction = {
      id: `tx_${Date.now()}`,
      account_id: validatedData.fromAccount,
      transaction_type: "payment",
      amount: validatedData.amount,
      description: validatedData.description,
      recipient_name: validatedData.recipientName,
      recipient_account: validatedData.toAccount,
      status: "completed",
      category: "transfer",
      created_at: new Date().toISOString(),
    }

    demoTransactions.push(transaction)

    revalidatePath("/dashboard")
    revalidatePath("/transactions")

    return { success: true, transaction }
  } catch (error) {
    console.error("Transaction error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors,
      }
    }

    return {
      success: false,
      error: "Transaction failed. Please try again.",
    }
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "",
      dateOfBirth: (formData.get("dateOfBirth") as string) || "",
      address: (formData.get("address") as string) || "",
      city: (formData.get("city") as string) || "",
      state: (formData.get("state") as string) || "",
      zipCode: (formData.get("zipCode") as string) || "",
    }

    // Validate the data
    const validatedData = profileUpdateSchema.parse(data)

    // Update demo user data
    demoUsers.set("demo", {
      ...validatedData,
      updated_at: new Date().toISOString(),
    })

    revalidatePath("/account")

    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    console.error("Profile update error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.errors,
      }
    }

    return {
      success: false,
      error: "Profile update failed. Please try again.",
    }
  }
}

export async function createBudget(formData: FormData) {
  try {
    const data = {
      category: formData.get("category") as string,
      monthlyLimit: Number.parseFloat(formData.get("monthlyLimit") as string),
    }

    // Simple validation
    if (!data.category || !data.monthlyLimit || data.monthlyLimit <= 0) {
      return { success: false, error: "Invalid budget data" }
    }

    // Create demo budget
    const budget = {
      id: `budget_${Date.now()}`,
      user_id: "demo",
      category: data.category,
      monthly_limit: data.monthlyLimit,
      current_spending: 0,
      percentage_used: 0,
      created_at: new Date().toISOString(),
      is_active: true,
    }

    revalidatePath("/analytics")

    return { success: true, budget }
  } catch (error) {
    console.error("Budget creation error:", error)
    return { success: false, error: "Failed to create budget" }
  }
}

export async function createGoal(formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      targetAmount: Number.parseFloat(formData.get("targetAmount") as string),
      targetDate: formData.get("targetDate") as string,
      category: formData.get("category") as string,
    }

    // Simple validation
    if (!data.title || !data.targetAmount || !data.targetDate || !data.category) {
      return { success: false, error: "Invalid goal data" }
    }

    // Create demo goal
    const goal = {
      id: `goal_${Date.now()}`,
      user_id: "demo",
      title: data.title,
      description: data.description,
      target_amount: data.targetAmount,
      current_amount: 0,
      target_date: data.targetDate,
      category: data.category,
      is_achieved: false,
      created_at: new Date().toISOString(),
    }

    revalidatePath("/goals")

    return { success: true, goal }
  } catch (error) {
    console.error("Goal creation error:", error)
    return { success: false, error: "Failed to create goal" }
  }
}

export async function signOut() {
  // In a real app, this would clear the session
  redirect("/login")
}

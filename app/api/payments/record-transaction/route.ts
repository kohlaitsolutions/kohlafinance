import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient()

    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const { amount, description, paymentIntentId } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Get user's primary account
    const { data: accountData } = await supabase
      .from("accounts")
      .select("id, balance")
      .eq("user_id", session.user.id)
      .eq("is_primary", true)
      .single()

    if (!accountData) {
      return NextResponse.json({ error: "No primary account found" }, { status: 404 })
    }

    // Update account balance
    await supabase
      .from("accounts")
      .update({
        balance: accountData.balance + amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountData.id)

    // Record the transaction
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        account_id: accountData.id,
        transaction_type: "deposit",
        amount,
        description: description || "Card payment",
        payment_method: "card",
        payment_id: paymentIntentId,
        status: "completed",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    return NextResponse.json({
      success: true,
      transaction: transactionData,
    })
  } catch (error: any) {
    console.error("Error recording transaction:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while recording the transaction" },
      { status: 500 },
    )
  }
}

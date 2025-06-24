import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

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
    const { amount, currency = "usd", paymentMethodId, description } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Get user from database
    const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has a Stripe customer ID
    let customerId = userData.stripe_customer_id

    // If not, create a new customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: `${userData.first_name} ${userData.last_name}`,
        metadata: {
          userId: session.user.id,
        },
      })

      customerId = customer.id

      // Update user with Stripe customer ID
      await supabase.from("users").update({ stripe_customer_id: customerId }).eq("id", session.user.id)
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      description,
      confirm: !!paymentMethodId,
      automatic_payment_methods: paymentMethodId ? undefined : { enabled: true },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while processing your payment" },
      { status: 500 },
    )
  }
}

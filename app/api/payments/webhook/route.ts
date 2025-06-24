import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/config"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature provided" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        console.log("Payment succeeded:", paymentIntent.id)
        // Handle successful payment
        await handlePaymentSuccess(paymentIntent)
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object
        console.log("Payment failed:", failedPayment.id)
        // Handle failed payment
        await handlePaymentFailure(failedPayment)
        break

      case "customer.subscription.created":
        const subscription = event.data.object
        console.log("Subscription created:", subscription.id)
        // Handle new subscription
        await handleSubscriptionCreated(subscription)
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object
        console.log("Subscription updated:", updatedSubscription.id)
        // Handle subscription update
        await handleSubscriptionUpdated(updatedSubscription)
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object
        console.log("Invoice payment succeeded:", invoice.id)
        // Handle successful invoice payment
        await handleInvoicePaymentSuccess(invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  // Store successful payment in database
  // Update user account balance
  // Send confirmation email
  // Create transaction record
}

async function handlePaymentFailure(paymentIntent: any) {
  // Log failed payment
  // Notify user of failure
  // Update payment status
}

async function handleSubscriptionCreated(subscription: any) {
  // Create subscription record
  // Update user subscription status
  // Send welcome email
}

async function handleSubscriptionUpdated(subscription: any) {
  // Update subscription record
  // Handle plan changes
  // Update billing information
}

async function handleInvoicePaymentSuccess(invoice: any) {
  // Update subscription payment status
  // Send receipt
  // Update account credits
}

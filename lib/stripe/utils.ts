import { stripe } from "./config"

export function formatAmount(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)
}

export function formatStripeAmount(amount: number): number {
  // Stripe expects amounts in cents
  return Math.round(amount * 100)
}

export function parseStripeAmount(amount: number): number {
  // Convert from cents to dollars
  return amount / 100
}

export async function createPaymentIntent(amount: number, currency = "usd", metadata?: Record<string, string>) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatStripeAmount(amount),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    })

    return { success: true, paymentIntent }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return { success: false, error: error.message }
  }
}

export async function createCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })

    return { success: true, customer }
  } catch (error) {
    console.error("Error creating customer:", error)
    return { success: false, error: error.message }
  }
}

export async function createSubscription(customerId: string, priceId: string, paymentMethodId?: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      ...(paymentMethodId && {
        default_payment_method: paymentMethodId,
      }),
    })

    return { success: true, subscription }
  } catch (error) {
    console.error("Error creating subscription:", error)
    return { success: false, error: error.message }
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return { success: true, subscription }
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return { success: false, error: error.message }
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return { success: true, paymentIntent }
  } catch (error) {
    console.error("Error retrieving payment intent:", error)
    return { success: false, error: error.message }
  }
}

export function constructWebhookEvent(body: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    return { success: true, event }
  } catch (error) {
    console.error("Error constructing webhook event:", error)
    return { success: false, error: error.message }
  }
}

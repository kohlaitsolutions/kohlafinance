import { stripe } from "./config"
import type { Stripe } from "stripe"

export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  customerId?: string
  paymentMethodId?: string
  description?: string
  metadata?: Record<string, string>
}

export interface CreateCustomerParams {
  email: string
  name: string
  phone?: string
  address?: Stripe.AddressParam
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency,
      customer: params.customerId,
      payment_method: params.paymentMethodId,
      description: params.description,
      metadata: params.metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { success: true, paymentIntent }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createCustomer(params: CreateCustomerParams) {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      address: params.address,
    })

    return { success: true, customer }
  } catch (error) {
    console.error("Error creating customer:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return { success: true, paymentIntent }
  } catch (error) {
    console.error("Error retrieving payment intent:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    })

    return { success: true, subscription }
  } catch (error) {
    console.error("Error creating subscription:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export function formatAmount(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)
}

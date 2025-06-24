import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  currency: "usd",
  paymentMethods: ["card", "apple_pay", "google_pay", "link"],
}

// Payment method configurations
export const PAYMENT_METHODS = {
  card: {
    name: "Credit/Debit Card",
    icon: "CreditCard",
    description: "Visa, Mastercard, American Express",
  },
  apple_pay: {
    name: "Apple Pay",
    icon: "Smartphone",
    description: "Pay with Touch ID or Face ID",
  },
  google_pay: {
    name: "Google Pay",
    icon: "Smartphone",
    description: "Pay with your Google account",
  },
  link: {
    name: "Link",
    icon: "Link",
    description: "Pay with Link by Stripe",
  },
}

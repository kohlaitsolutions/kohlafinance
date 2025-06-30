import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export const STRIPE_CONFIG = {
  currency: "usd",
  payment_method_types: ["card", "apple_pay", "google_pay"],
  automatic_payment_methods: {
    enabled: true,
  },
} as const

export const SUBSCRIPTION_PLANS = {
  basic: {
    name: "Basic",
    price: 0,
    priceId: null,
    features: ["Up to 3 accounts", "Basic transaction tracking", "Monthly reports", "Email support"],
  },
  premium: {
    name: "Premium",
    price: 9.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Unlimited accounts",
      "Advanced analytics",
      "Real-time notifications",
      "Investment tracking",
      "Priority support",
      "Export data",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 29.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      "Everything in Premium",
      "Multi-user access",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Advanced security",
    ],
  },
} as const

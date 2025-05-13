import { loadStripe } from "@stripe/stripe-js"
import type { Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export type PaymentMethod = {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export type StripeCustomer = {
  id: string
  email: string
  name: string
  paymentMethods: PaymentMethod[]
}

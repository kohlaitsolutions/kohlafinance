import { type NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/stripe/utils"
import { z } from "zod"

const createIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("usd"),
  customerId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createIntentSchema.parse(body)

    const result = await createPaymentIntent(validatedData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      clientSecret: result.paymentIntent.client_secret,
      paymentIntentId: result.paymentIntent.id,
    })
  } catch (error) {
    console.error("Error in create-intent API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

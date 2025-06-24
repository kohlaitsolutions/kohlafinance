import { type NextRequest, NextResponse } from "next/server"
import { retrievePaymentIntent } from "@/lib/stripe/utils"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentIntentId = searchParams.get("payment_intent_id")

  if (!paymentIntentId) {
    return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
  }

  try {
    const result = await retrievePaymentIntent(paymentIntentId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      paymentIntent: result.paymentIntent,
    })
  } catch (error) {
    console.error("Error in retrieve payment API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

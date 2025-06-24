import { type NextRequest, NextResponse } from "next/server"
import { createCustomer } from "@/lib/stripe/utils"
import { z } from "zod"

const createCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z
    .object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postal_code: z.string(),
      country: z.string(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCustomerSchema.parse(body)

    const result = await createCustomer(validatedData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      customerId: result.customer.id,
      customer: result.customer,
    })
  } catch (error) {
    console.error("Error in create-customer API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

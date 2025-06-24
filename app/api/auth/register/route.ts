import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { storeUserCredentials } from "@/app/actions"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).maybeSingle()

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // Store user in our database
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      // Store user credentials in KV store
      await storeUserCredentials({
        userId: data.user.id,
        email,
        firstName,
        lastName,
      })

      return NextResponse.json({
        success: true,
        message: "User registered successfully",
        userId: data.user.id,
      })
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { render, screen, waitFor } from "@/lib/test-utils"
import { EmailVerification } from "@/components/auth/email-verification"
import { createMockSupabaseClient } from "@/lib/test-utils"
import jest from "jest" // Declare the jest variable

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => createMockSupabaseClient(),
}))

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn((key) => {
      if (key === "token") return "mock-token"
      if (key === "type") return "email"
      return null
    }),
  }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

describe("Email Verification", () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    jest.clearAllMocks() // Ensure jest is declared before use
  })

  it("should verify email with valid token", async () => {
    mockSupabase.auth.verifyOtp.mockResolvedValue({
      data: {
        user: { id: "test-user-id", email: "test@example.com" },
        session: { access_token: "token" },
      },
      error: null,
    })

    render(<EmailVerification />)

    await waitFor(() => {
      expect(mockSupabase.auth.verifyOtp).toHaveBeenCalledWith({
        token_hash: "mock-token",
        type: "email",
      })
    })

    expect(screen.getByText(/email verified successfully/i)).toBeInTheDocument()
  })

  it("should handle verification errors", async () => {
    mockSupabase.auth.verifyOtp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid or expired token" },
    })

    render(<EmailVerification />)

    await waitFor(() => {
      expect(screen.getByText(/invalid or expired token/i)).toBeInTheDocument()
    })
  })

  it("should show loading state during verification", () => {
    mockSupabase.auth.verifyOtp.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)))

    render(<EmailVerification />)

    expect(screen.getByText(/verifying your email/i)).toBeInTheDocument()
  })
})

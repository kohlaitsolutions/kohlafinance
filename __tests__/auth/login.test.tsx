import { render, screen, waitFor } from "@/lib/test-utils"
import userEvent from "@testing-library/user-event"
import { EnhancedLoginForm } from "@/components/auth/enhanced-login-form"
import { createMockSupabaseClient } from "@/lib/test-utils"
import jest from "jest" // Declaring the jest variable

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => createMockSupabaseClient(),
}))

describe("Login Form", () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    jest.clearAllMocks()
  })

  describe("Form Validation", () => {
    it("should display validation errors for empty fields", async () => {
      const user = userEvent.setup()
      render(<EnhancedLoginForm />)

      const submitButton = screen.getByRole("button", { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it("should validate email format", async () => {
      const user = userEvent.setup()
      render(<EnhancedLoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, "invalid-email")

      const submitButton = screen.getByRole("button", { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })
  })

  describe("Successful Login", () => {
    it("should login user with valid credentials", async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: "test-user-id", email: "test@example.com" },
          session: { access_token: "token" },
        },
        error: null,
      })

      render(<EnhancedLoginForm />)

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.type(screen.getByLabelText(/password/i), "password123")
      await user.click(screen.getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        })
      })
    })
  })

  describe("Error Handling", () => {
    it("should handle invalid credentials", async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" },
      })

      render(<EnhancedLoginForm />)

      await user.type(screen.getByLabelText(/email/i), "test@example.com")
      await user.type(screen.getByLabelText(/password/i), "wrongpassword")
      await user.click(screen.getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument()
      })
    })

    it("should handle unverified email", async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email not confirmed" },
      })

      render(<EnhancedLoginForm />)

      await user.type(screen.getByLabelText(/email/i), "unverified@example.com")
      await user.type(screen.getByLabelText(/password/i), "password123")
      await user.click(screen.getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/email not confirmed/i)).toBeInTheDocument()
      })
    })
  })

  describe("Remember Me Functionality", () => {
    it("should handle remember me option", async () => {
      const user = userEvent.setup()
      render(<EnhancedLoginForm />)

      const rememberMeCheckbox = screen.getByLabelText(/remember me/i)
      await user.click(rememberMeCheckbox)

      expect(rememberMeCheckbox).toBeChecked()
    })
  })

  describe("Social Login", () => {
    it("should render social login buttons", () => {
      render(<EnhancedLoginForm />)

      expect(screen.getByText(/continue with google/i)).toBeInTheDocument()
      expect(screen.getByText(/continue with github/i)).toBeInTheDocument()
    })
  })
})

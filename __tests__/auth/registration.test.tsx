import { render, screen, waitFor } from "@/lib/test-utils"
import userEvent from "@testing-library/user-event"
import { EnhancedRegisterForm } from "@/components/auth/enhanced-register-form"
import { createMockSupabaseClient } from "@/lib/test-utils"
import jest from "jest" // Declare the jest variable

// Mock the Supabase client
jest.mock("@/lib/supabase/client", () => ({
  createClient: () => createMockSupabaseClient(),
}))

describe("Registration Form", () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    jest.clearAllMocks()
  })

  describe("Form Validation", () => {
    it("should display validation errors for empty fields", async () => {
      const user = userEvent.setup()
      render(<EnhancedRegisterForm />)

      const submitButton = screen.getByRole("button", { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it("should validate email format", async () => {
      const user = userEvent.setup()
      render(<EnhancedRegisterForm />)

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, "invalid-email")

      const submitButton = screen.getByRole("button", { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it("should validate password strength", async () => {
      const user = userEvent.setup()
      render(<EnhancedRegisterForm />)

      const passwordInput = screen.getByLabelText(/^password$/i)
      await user.type(passwordInput, "123")

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })
    })

    it("should validate password confirmation match", async () => {
      const user = userEvent.setup()
      render(<EnhancedRegisterForm />)

      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

      await user.type(passwordInput, "StrongPassword123!")
      await user.type(confirmPasswordInput, "DifferentPassword123!")

      const submitButton = screen.getByRole("button", { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })

    it("should validate phone number format", async () => {
      const user = userEvent.setup()
      render(<EnhancedRegisterForm />)

      const phoneInput = screen.getByLabelText(/phone/i)
      await user.type(phoneInput, "123")

      const submitButton = screen.getByRole("button", { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument()
      })
    })
  })

  describe("Successful Registration", () => {
    it("should register user with valid data", async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: "test-user-id", email: "test@example.com" },
          session: null,
        },
        error: null,
      })

      render(<EnhancedRegisterForm />)

      // Fill out the form
      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.type(screen.getByLabelText(/last name/i), "Doe")
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com")
      await user.type(screen.getByLabelText(/phone/i), "+1234567890")
      await user.type(screen.getByLabelText(/^password$/i), "StrongPassword123!")
      await user.type(screen.getByLabelText(/confirm password/i), "StrongPassword123!")

      // Accept terms
      const termsCheckbox = screen.getByLabelText(/i agree to the terms/i)
      await user.click(termsCheckbox)

      // Submit form
      const submitButton = screen.getByRole("button", { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: "john.doe@example.com",
          password: "StrongPassword123!",
          options: {
            data: {
              first_name: "John",
              last_name: "Doe",
              phone: "+1234567890",
            },
            emailRedirectTo: expect.stringContaining("/auth/callback"),
          },
        })
      })
    })

    it("should show success message after registration", async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: "test-user-id", email: "test@example.com" },
          session: null,
        },
        error: null,
      })

      render(<EnhancedRegisterForm />)

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.type(screen.getByLabelText(/last name/i), "Doe")
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com")
      await user.type(screen.getByLabelText(/phone/i), "+1234567890")
      await user.type(screen.getByLabelText(/^password$/i), "StrongPassword123!")
      await user.type(screen.getByLabelText(/confirm password/i), "StrongPassword123!")
      await user.click(screen.getByLabelText(/i agree to the terms/i))
      await user.click(screen.getByRole("button", { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/check your email for verification/i)).toBeInTheDocument()
      })
    })
  })

  describe("Error Handling", () => {
    it("should handle registration errors", async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "User already registered" },
      })

      render(<EnhancedRegisterForm />)

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.type(screen.getByLabelText(/last name/i), "Doe")
      await user.type(screen.getByLabelText(/email/i), "existing@example.com")
      await user.type(screen.getByLabelText(/phone/i), "+1234567890")
      await user.type(screen.getByLabelText(/^password$/i), "StrongPassword123!")
      await user.type(screen.getByLabelText(/confirm password/i), "StrongPassword123!")
      await user.click(screen.getByLabelText(/i agree to the terms/i))
      await user.click(screen.getByRole("button", { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/user already registered/i)).toBeInTheDocument()
      })
    })

    it("should handle network errors", async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signUp.mockRejectedValue(new Error("Network error"))

      render(<EnhancedRegisterForm />)

      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.type(screen.getByLabelText(/last name/i), "Doe")
      await user.type(screen.getByLabelText(/email/i), "john.doe@example.com")
      await user.type(screen.getByLabelText(/phone/i), "+1234567890")
      await user.type(screen.getByLabelText(/^password$/i), "StrongPassword123!")
      await user.type(screen.getByLabelText(/confirm password/i), "StrongPassword123!")
      await user.click(screen.getByLabelText(/i agree to the terms/i))
      await user.click(screen.getByRole("button", { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe("Real-time Validation", () => {
    it("should show password strength indicator", async () => {
      const user = userEvent.setup()
      render(<EnhancedRegisterForm />)

      const passwordInput = screen.getByLabelText(/^password$/i)

      // Weak password
      await user.type(passwordInput, "123")
      expect(screen.getByText(/weak/i)).toBeInTheDocument()

      // Medium password
      await user.clear(passwordInput)
      await user.type(passwordInput, "password123")
      expect(screen.getByText(/medium/i)).toBeInTheDocument()

      // Strong password
      await user.clear(passwordInput)
      await user.type(passwordInput, "StrongPassword123!")
      expect(screen.getByText(/strong/i)).toBeInTheDocument()
    })

    it("should validate email in real-time", async () => {
      const user = userEvent.setup()
      render(<EnhancedRegisterForm />)

      const emailInput = screen.getByLabelText(/email/i)

      await user.type(emailInput, "invalid")
      await user.tab() // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })

      await user.clear(emailInput)
      await user.type(emailInput, "valid@example.com")
      await user.tab()

      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
      })
    })
  })
})

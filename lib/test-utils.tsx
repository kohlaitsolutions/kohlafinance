import type React from "react"
import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { AuthProvider } from "@/lib/auth/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import jest from "jest"

// Mock user data for testing
export const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  emailVerified: true,
  onboardingCompleted: false,
}

export const mockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_at: Date.now() + 3600000,
  user: mockUser,
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }

// Test helpers
export const createMockSupabaseClient = () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(),
    verifyOtp: jest.fn(),
    resetPasswordForEmail: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    maybeSingle: jest.fn(),
  })),
})

// Form validation test helpers
export const fillForm = async (user: any, formData: Record<string, string>) => {
  for (const [field, value] of Object.entries(formData)) {
    const input = document.querySelector(`[name="${field}"]`) as HTMLInputElement
    if (input) {
      await user.clear(input)
      await user.type(input, value)
    }
  }
}

export const submitForm = async (user: any) => {
  const submitButton = document.querySelector('[type="submit"]') as HTMLButtonElement
  if (submitButton) {
    await user.click(submitButton)
  }
}

// Wait for async operations
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 100))
}

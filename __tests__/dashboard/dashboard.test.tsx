import { render, screen } from "@/lib/test-utils"
import DashboardPage from "@/app/(dashboard)/dashboard/page"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the server components
jest.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: "test-user-id",
              email: "test@example.com",
            },
          },
        },
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: "test-user-id",
          first_name: "John",
          last_name: "Doe",
          email: "test@example.com",
          created_at: new Date().toISOString(),
        },
      }),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    })),
  }),
}))

describe("Dashboard Page", () => {
  it("should render welcome message for authenticated user", async () => {
    render(await DashboardPage())

    expect(screen.getByText(/welcome back, john/i)).toBeInTheDocument()
  })

  it("should display account cards", async () => {
    render(await DashboardPage())

    expect(screen.getByText(/checking account/i)).toBeInTheDocument()
    expect(screen.getByText(/savings account/i)).toBeInTheDocument()
  })

  it("should show recent transactions", async () => {
    render(await DashboardPage())

    expect(screen.getByText(/recent transactions/i)).toBeInTheDocument()
  })

  it("should display quick actions", async () => {
    render(await DashboardPage())

    expect(screen.getByText(/send money/i)).toBeInTheDocument()
    expect(screen.getByText(/pay bills/i)).toBeInTheDocument()
  })

  it("should show spending insights", async () => {
    render(await DashboardPage())

    expect(screen.getByText(/spending summary/i)).toBeInTheDocument()
  })
})

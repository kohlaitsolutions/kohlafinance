import { render, screen, waitFor } from "@/lib/test-utils"
import userEvent from "@testing-library/user-event"
import { UserOnboarding } from "@/components/onboarding/user-onboarding"
import jest from "jest" // Import jest to fix the undeclared variable error

describe("User Onboarding", () => {
  it("should render welcome step", () => {
    render(<UserOnboarding />)

    expect(screen.getByText(/welcome to kohlawise/i)).toBeInTheDocument()
    expect(screen.getByText(/let's get you started/i)).toBeInTheDocument()
  })

  it("should navigate through onboarding steps", async () => {
    const user = userEvent.setup()
    render(<UserOnboarding />)

    // Step 1: Welcome
    expect(screen.getByText(/welcome to kohlawise/i)).toBeInTheDocument()

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    // Step 2: Account Setup
    await waitFor(() => {
      expect(screen.getByText(/set up your account/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /next/i }))

    // Step 3: Security
    await waitFor(() => {
      expect(screen.getByText(/secure your account/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /next/i }))

    // Step 4: Complete
    await waitFor(() => {
      expect(screen.getByText(/you're all set/i)).toBeInTheDocument()
    })
  })

  it("should allow skipping optional steps", async () => {
    const user = userEvent.setup()
    render(<UserOnboarding />)

    const skipButton = screen.getByRole("button", { name: /skip/i })
    await user.click(skipButton)

    await waitFor(() => {
      expect(screen.getByText(/set up your account/i)).toBeInTheDocument()
    })
  })

  it("should complete onboarding", async () => {
    const user = userEvent.setup()
    const onComplete = jest.fn()

    render(<UserOnboarding onComplete={onComplete} />)

    // Navigate to final step
    for (let i = 0; i < 3; i++) {
      const nextButton = screen.getByRole("button", { name: /next/i })
      await user.click(nextButton)
      await waitFor(() => {})
    }

    const completeButton = screen.getByRole("button", { name: /get started/i })
    await user.click(completeButton)

    expect(onComplete).toHaveBeenCalled()
  })
})

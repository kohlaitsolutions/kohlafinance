import { cn } from "@/lib/utils"

type StrengthLevel = "very-weak" | "weak" | "fair" | "good" | "strong" | "very-strong"

export function calculatePasswordStrength(password: string): number {
  if (!password) return 0

  let score = 0

  // Length check
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  // Cap the score at 5
  return Math.min(score, 5)
}

export function getStrengthLevel(score: number): StrengthLevel {
  switch (score) {
    case 0:
      return "very-weak"
    case 1:
      return "weak"
    case 2:
      return "fair"
    case 3:
      return "good"
    case 4:
      return "strong"
    case 5:
      return "very-strong"
    default:
      return "very-weak"
  }
}

export function getStrengthText(level: StrengthLevel): string {
  switch (level) {
    case "very-weak":
      return "Very Weak"
    case "weak":
      return "Weak"
    case "fair":
      return "Fair"
    case "good":
      return "Good"
    case "strong":
      return "Strong"
    case "very-strong":
      return "Very Strong"
  }
}

export function getStrengthColor(level: StrengthLevel): string {
  switch (level) {
    case "very-weak":
      return "bg-destructive"
    case "weak":
      return "bg-orange-500"
    case "fair":
      return "bg-yellow-500"
    case "good":
      return "bg-green-500"
    case "strong":
      return "bg-blue-500"
    case "very-strong":
      return "bg-purple-500"
  }
}

interface PasswordRequirementProps {
  text: string
  isMet: boolean
}

function PasswordRequirement({ text, isMet }: PasswordRequirementProps) {
  return (
    <li className={cn("text-xs", isMet ? "text-green-500" : "text-muted-foreground")}>
      {isMet ? "✓" : "○"} {text}
    </li>
  )
}

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password)
  const level = getStrengthLevel(strength)
  const text = getStrengthText(level)
  const color = getStrengthColor(level)

  // Only show the meter if the user has started typing
  if (!password) {
    return null
  }

  // Check which requirements are met
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Password strength:</p>
          <p className={cn("text-xs font-medium", color.replace("bg-", "text-"))}>{text}</p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", color)}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
      </div>
      <ul className="space-y-1">
        <PasswordRequirement text="At least 8 characters" isMet={hasMinLength} />
        <PasswordRequirement text="At least one uppercase letter (A-Z)" isMet={hasUppercase} />
        <PasswordRequirement text="At least one lowercase letter (a-z)" isMet={hasLowercase} />
        <PasswordRequirement text="At least one number (0-9)" isMet={hasNumber} />
        <PasswordRequirement text="At least one special character (!@#$...)" isMet={hasSpecial} />
      </ul>
    </div>
  )
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Password validation functions
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Email validation
export function validateEmail(email: string): {
  isValid: boolean
  error?: string
} {
  if (!email) {
    return { isValid: false, error: "Email is required" }
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" }
  }

  return { isValid: true }
}

// Name validation
export function validateName(
  name: string,
  fieldName: string,
): {
  isValid: boolean
  error?: string
} {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` }
  }

  return { isValid: true }
}

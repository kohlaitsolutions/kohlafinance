export interface ValidationResult {
  isValid: boolean
  error?: string
  errors?: string[]
}

// Enhanced name validation
export function validateName(name: string, fieldName = "Name"): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` }
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` }
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` }
  }

  return { isValid: true }
}

// Enhanced email validation
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: "Email address is required" }
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address" }
  }

  // Check email length
  if (email.length > 254) {
    return { isValid: false, error: "Email address is too long" }
  }

  // Check for common invalid patterns
  const invalidPatterns = [
    /\.{2,}/, // Multiple consecutive dots
    /^\./, // Starts with dot
    /\.$/, // Ends with dot
    /@\./, // @ followed by dot
    /\.@/, // Dot followed by @
  ]

  for (const pattern of invalidPatterns) {
    if (pattern.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" }
    }
  }

  return { isValid: true }
}

// Enhanced password validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []

  if (!password || password.length === 0) {
    return { isValid: false, error: "Password is required" }
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (password.length > 128) {
    errors.push("Password must be less than 128 characters")
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

  // Check for common weak patterns
  const weakPatterns = [
    /(.)\1{2,}/, // Three or more consecutive identical characters
    /123456/, // Sequential numbers
    /abcdef/, // Sequential letters
    /qwerty/i, // Common keyboard patterns
    /password/i, // Contains "password"
  ]

  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      errors.push("Password contains common patterns and may be weak")
      break
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors, error: errors[0] }
  }

  return { isValid: true }
}

// Phone number validation
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: "Phone number is required" }
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, "")

  if (digitsOnly.length < 10) {
    return { isValid: false, error: "Phone number must be at least 10 digits" }
  }

  if (digitsOnly.length > 15) {
    return { isValid: false, error: "Phone number must be less than 15 digits" }
  }

  return { isValid: true }
}

// Real-time validation helper
export function validateField(fieldType: string, value: string, fieldName?: string): ValidationResult {
  switch (fieldType) {
    case "firstName":
    case "lastName":
      return validateName(value, fieldName || fieldType)
    case "email":
      return validateEmail(value)
    case "password":
      return validatePassword(value)
    case "phone":
      return validatePhone(value)
    default:
      return { isValid: true }
  }
}

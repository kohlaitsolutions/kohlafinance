import { z } from "zod"

// User authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Transaction schemas
export const sendMoneySchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  toAccount: z.string().min(1, "Please enter recipient account"),
  recipientName: z.string().min(1, "Please enter recipient name"),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  description: z.string().optional(),
})

export const addMoneySchema = z.object({
  toAccount: z.string().min(1, "Please select an account"),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  source: z.string().min(1, "Please select a source"),
  description: z.string().optional(),
})

export const payBillSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  billType: z.string().min(1, "Please select a bill type"),
  billNumber: z.string().min(1, "Please enter a bill number"),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  dueDate: z.string().min(1, "Please select a due date"),
})

// Investment schemas
export const investSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  investmentType: z.string().min(1, "Please select an investment type"),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  duration: z.string().optional(),
})

// Profile schemas
export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

export const settingsSchema = z.object({
  theme: z.string(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
})

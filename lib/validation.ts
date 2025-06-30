import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const transferSchema = z.object({
  fromAccount: z.string().min(1, "Please select an account"),
  toAccount: z.string().min(1, "Please enter recipient account"),
  recipientName: z.string().min(2, "Please enter recipient name"),
  amount: z.coerce
    .number({ required_error: "Please enter an amount" })
    .positive("Amount must be positive")
    .max(1000000, "Amount cannot exceed $1,000,000"),
  description: z.string().optional(),
})

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

export const budgetSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  monthlyLimit: z.coerce
    .number({ required_error: "Please enter a monthly limit" })
    .positive("Monthly limit must be positive"),
})

export const goalSchema = z.object({
  title: z.string().min(2, "Goal title must be at least 2 characters"),
  description: z.string().optional(),
  targetAmount: z.coerce
    .number({ required_error: "Please enter a target amount" })
    .positive("Target amount must be positive"),
  targetDate: z.string().min(1, "Please select a target date"),
  category: z.enum(["emergency", "vacation", "house", "car", "education", "retirement", "other"]),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>
export type TransferFormData = z.infer<typeof transferSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
export type BudgetFormData = z.infer<typeof budgetSchema>
export type GoalFormData = z.infer<typeof goalSchema>

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  created_at: string
  updated_at: string
  is_verified: boolean
  kyc_status: "pending" | "approved" | "rejected"
  subscription_tier: "basic" | "premium" | "enterprise"
}

export interface Account {
  id: string
  user_id: string
  account_number: string
  account_name: string
  account_type: "checking" | "savings" | "investment" | "credit"
  balance: number
  currency: string
  is_primary: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  interest_rate?: number
  credit_limit?: number
}

export interface Transaction {
  id: string
  account_id: string
  transaction_type: "deposit" | "withdrawal" | "payment" | "transfer"
  amount: number
  description?: string
  recipient_name?: string
  recipient_account?: string
  sender_name?: string
  sender_account?: string
  status: "pending" | "completed" | "failed" | "cancelled"
  category?: string
  reference_number?: string
  fee?: number
  created_at: string
  updated_at: string
  scheduled_date?: string
  recurring?: boolean
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly"
}

export interface Investment {
  id: string
  user_id: string
  asset_type: "stock" | "crypto" | "etf" | "bond"
  asset_symbol: string
  asset_name: string
  quantity: number
  purchase_price: number
  current_price: number
  total_value: number
  profit_loss: number
  profit_loss_percentage: number
  purchase_date: string
  last_updated: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  monthly_limit: number
  current_spending: number
  percentage_used: number
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  target_amount: number
  current_amount: number
  target_date: string
  category: "emergency" | "vacation" | "house" | "car" | "education" | "retirement" | "other"
  is_achieved: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  is_read: boolean
  action_url?: string
  created_at: string
}

export interface PaymentMethod {
  id: string
  user_id: string
  type: "card" | "bank_account" | "digital_wallet"
  provider: string
  last_four: string
  expiry_date?: string
  is_default: boolean
  is_verified: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_name: string
  plan_type: "basic" | "premium" | "enterprise"
  price: number
  billing_cycle: "monthly" | "yearly"
  status: "active" | "cancelled" | "expired"
  current_period_start: string
  current_period_end: string
  created_at: string
}

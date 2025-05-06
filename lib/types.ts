export type User = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Account = {
  id: string
  user_id: string
  account_number: string
  account_name: string
  balance: number
  account_type: string
  currency: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  account_id: string
  transaction_type: string
  amount: number
  description: string | null
  recipient_name: string | null
  recipient_account: string | null
  status: string
  category: string | null
  created_at: string
}

export type Card = {
  id: string
  user_id: string
  account_id: string
  card_number: string
  card_holder: string
  expiry_date: string
  card_type: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export type UserSettings = {
  id: string
  user_id: string
  theme: string
  notification_preferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
  created_at: string
  updated_at: string
}

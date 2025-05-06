import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function generateAccountNumber(): string {
  return Math.floor(Math.random() * 9000000000 + 1000000000).toString()
}

export function generateCardNumber(): string {
  const prefix = "4532" // Visa-like prefix
  const parts = []

  for (let i = 0; i < 3; i++) {
    parts.push(
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0"),
    )
  }

  return `${prefix} ${parts.join(" ")}`
}

export function maskCardNumber(cardNumber: string): string {
  const parts = cardNumber.split(" ")
  if (parts.length !== 4) return cardNumber

  return `${parts[0].slice(0, 2)}** **** **** ${parts[3]}`
}

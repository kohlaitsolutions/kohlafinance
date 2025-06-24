"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function useRedirectService() {
  const router = useRouter()
  const { toast } = useToast()

  const storeRedirectUrl = (url: string) => {
    if (url && url !== "/login" && url !== "/register") {
      localStorage.setItem("kohlawise_redirect_url", url)
    }
  }

  const getRedirectUrl = () => {
    const stored = localStorage.getItem("kohlawise_redirect_url")
    localStorage.removeItem("kohlawise_redirect_url")
    return stored || "/dashboard"
  }

  const redirect = async (options?: {
    fallback?: string
    delay?: number
    showToast?: boolean
    toastMessage?: string
  }) => {
    const { fallback = "/dashboard", delay = 0, showToast = true, toastMessage = "Redirecting..." } = options || {}

    if (showToast && toastMessage) {
      toast({
        title: "Success",
        description: toastMessage,
      })
    }

    const redirectUrl = getRedirectUrl() || fallback

    if (delay > 0) {
      setTimeout(() => {
        router.push(redirectUrl)
        router.refresh()
      }, delay)
    } else {
      router.push(redirectUrl)
      router.refresh()
    }
  }

  return {
    storeRedirectUrl,
    getRedirectUrl,
    redirect,
  }
}

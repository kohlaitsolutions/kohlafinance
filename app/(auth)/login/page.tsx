import { Suspense } from "react"
import { LoginContainer } from "@/components/auth/login-container"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
      <Suspense fallback={<LoginLoadingFallback />}>
        <LoginContainer />
      </Suspense>
    </div>
  )
}

function LoginLoadingFallback() {
  return (
    <div className="w-full max-w-md p-8 space-y-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="h-8 w-48 mx-auto bg-muted animate-pulse rounded"></div>
      <div className="h-4 w-32 mx-auto bg-muted animate-pulse rounded"></div>
      <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg mt-4"></div>
    </div>
  )
}

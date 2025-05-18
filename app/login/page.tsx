import { LoginForm } from "@/components/login-form"
import { Suspense } from "react"
import Loading from "./loading"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<Loading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import Loading from "./loading"
import TradingViewWidget from "@/components/TradingViewWidget"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center">
      <div className="w-dvw max-w-sm md:max-w-7xl lg:max-w-full h-screen">
        <Suspense fallback={<Loading />}>
          <TradingViewWidget />
        </Suspense>
      </div>
    </div>
  )
}



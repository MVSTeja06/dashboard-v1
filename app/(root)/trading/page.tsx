import { Suspense } from "react"
import Loading from "./loading"
import TradingViewWidget from "@/components/TradingViewWidget"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center">
      <div className="w-full max-w-sm md:max-w-7xl lg:max-w-full h-full">
        <Suspense fallback={<Loading />}>
          <TradingViewWidget />
        </Suspense>
      </div>
    </div>
  )
}



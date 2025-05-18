"use client";

import { LoginForm } from "@/components/login-form";
import { Suspense, useState } from "react";
import Loading from "./loading";

export default function LoginPage() {
  const [needsSignUp, setNeedsSignUp] = useState(false);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<Loading />}>
          <LoginForm
            setNeedsSignUp={setNeedsSignUp}
            needsSignUp={needsSignUp}
          />
        </Suspense>
      </div>
    </div>
  );
}

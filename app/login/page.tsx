"use client";

import { LoginForm } from "@/components/login-form";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const [needsSignUp, setNeedsSignUp] = useState(false);
  const { data: session } = useSession();
  console.log("session", session);
  const router = useRouter();
  // Redirect in useEffect, not in render
  useEffect(() => {
    if (session?.user) {
      router.replace("/dashboard");
    }
  }, [session, router]);
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

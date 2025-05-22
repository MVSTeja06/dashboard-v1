"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  console.log("session", session);

  if (session?.user) {
    return redirect("/dashboard");
  }
  return redirect("/login");
}

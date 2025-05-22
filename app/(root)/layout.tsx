"use client";

import { useSession } from "next-auth/react";
import { AppSidebar } from "../../components/app-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { data: session } = useSession();
  console.log("session", session);

  if (!session?.user) {
    return redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

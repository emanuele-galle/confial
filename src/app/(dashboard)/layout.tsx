"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TopBar } from "@/components/admin/top-bar";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { useIsMounted } from "@/hooks/use-is-mounted";

function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- next-auth User type
  user: any | null;
}) {
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar user={user} />

      <div className="flex">
        {/* Sidebar with Dropdowns - Hidden on mobile */}
        <aside className="hidden md:block">
          <SidebarNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      <ToasterProvider />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SessionProvider>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const mounted = useIsMounted();

  useEffect(() => {
    if (mounted && status !== "loading" && !session?.user) {
      window.location.href = "/login";
    }
  }, [mounted, session, status]);

  const user = mounted && session?.user ? session.user : null;

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}

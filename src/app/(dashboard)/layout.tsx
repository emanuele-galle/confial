"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { MobileBottomNav } from "@/components/admin/mobile-bottom-nav";
import { SwipeableSidebar } from "@/components/admin/swipeable-sidebar";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { SkipLink } from "@/components/admin/skip-link";
import { useIsMounted } from "@/hooks/use-is-mounted";

function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading during initial hydration if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#016030]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip link for keyboard navigation (A11Y-02) */}
      <SkipLink />

      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <DashboardSidebar user={user} />
      </aside>

      {/* Mobile swipeable sidebar */}
      <div className="lg:hidden">
        <SwipeableSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <DashboardSidebar
            user={user}
            onNavClick={() => setSidebarOpen(false)}
          />
        </SwipeableSidebar>
      </div>

      {/* Main content with responsive padding */}
      <div className="lg:pl-64">
        <DashboardHeader
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

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
    // Only redirect after mount (client-side only)
    if (mounted && status !== "loading" && !session?.user) {
      window.location.href = "/login";
    }
  }, [mounted, session, status]);

  // CRITICAL: Always render same structure during initial hydration
  // User can be null initially - components handle it gracefully
  const user = mounted && session?.user ? session.user : null;

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}

"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show Header/Footer on admin or auth pages
  const isAdminOrAuth = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isAdminOrAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}

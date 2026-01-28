import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { SessionProvider } from "@/components/providers/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar user={session.user} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader user={session.user} />

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>

        <ToasterProvider />
      </div>
    </SessionProvider>
  );
}

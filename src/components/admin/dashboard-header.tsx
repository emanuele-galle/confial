"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";

const pathNameMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/news": "News",
  "/admin/news/new": "Crea News",
  "/admin/events": "Eventi",
  "/admin/events/new": "Crea Evento",
  "/admin/documents": "Documenti",
  "/admin/documents/new": "Carica Documento",
  "/admin/users": "Utenti",
  "/admin/users/new": "Crea Utente",
  "/admin/settings": "Impostazioni",
};

export function DashboardHeader({ user }: { user: any }) {
  const pathname = usePathname();

  // Get page title from pathname
  let pageTitle = "Dashboard";
  for (const [path, title] of Object.entries(pathNameMap)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      pageTitle = title;
      break;
    }
  }

  // Handle edit pages
  if (pathname.includes("/edit")) {
    const section = pathname.split("/")[2];
    pageTitle = `Modifica ${section.charAt(0).toUpperCase() + section.slice(1, -1)}`;
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search (placeholder for future) */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Cerca (Coming soon)">
          <Search className="h-5 w-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString("it-IT", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}

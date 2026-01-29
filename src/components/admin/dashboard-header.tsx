"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";
import { GlobalSearch } from "./global-search";

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
  "/admin/media": "Media Library",
};

export function DashboardHeader({ user }: { user: any }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

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

  // Global Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">{pageTitle}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Search button with Cmd+K hint */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            title="Cerca (⌘K)"
          >
            <Search className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500 hidden md:inline">Cerca...</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Date */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
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

      {/* Global Search Dialog */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

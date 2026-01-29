"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Eventi", href: "/admin/events", icon: Calendar },
  { name: "Documenti", href: "/admin/documents", icon: FileText },
  { name: "Utenti", href: "/admin/users", icon: Users },
  { name: "Impostazioni", href: "/admin/settings", icon: Settings },
];

interface DashboardSidebarProps {
  user: any;
  onNavClick?: () => void;
}

export function DashboardSidebar({ user, onNavClick }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-gradient-to-r from-[#018856] to-[#016b43]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white">CONFIAL</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onNavClick?.()}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#018856] to-[#016b43] text-white shadow-md"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-[#018856]"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive
                    ? "scale-110"
                    : "group-hover:scale-110 group-hover:text-[#018856]"
                )}
              />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-3 px-2 py-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-[#018856] to-[#016b43] rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {user.name?.charAt(0) || "A"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
        >
          <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Esci</span>
        </button>
      </div>
    </div>
  );
}

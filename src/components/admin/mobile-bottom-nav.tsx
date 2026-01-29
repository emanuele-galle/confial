"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  FileText,
  Image,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Home" },
  { href: "/admin/news", icon: Newspaper, label: "News" },
  { href: "/admin/events", icon: Calendar, label: "Eventi" },
  { href: "/admin/documents", icon: FileText, label: "Documenti" },
  { href: "/admin/media", icon: Image, label: "Media" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden pb-safe">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] transition-colors duration-200",
                isActive ? "text-[#018856]" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-all duration-200",
                  isActive && "scale-110"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

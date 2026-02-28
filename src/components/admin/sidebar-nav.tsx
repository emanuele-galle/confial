"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  ChevronDown,
  Plus,
  FileStack,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subItems?: { name: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    color: "emerald", // Verde FAILMS
  },
  {
    name: "News",
    href: "/admin/news",
    icon: Newspaper,
    color: "blue",
    subItems: [
      { name: "Tutte le News", href: "/admin/news", icon: FileStack },
      { name: "Crea Nuova", href: "/admin/news/new", icon: Plus },
    ],
  },
  {
    name: "Eventi",
    href: "/admin/events",
    icon: Calendar,
    color: "amber",
    subItems: [
      { name: "Tutti gli Eventi", href: "/admin/events", icon: FileStack },
      { name: "Crea Evento", href: "/admin/events/new", icon: Plus },
    ],
  },
  {
    name: "Documenti",
    href: "/admin/documents",
    icon: FileText,
    color: "violet",
    subItems: [
      { name: "Tutti i Documenti", href: "/admin/documents", icon: FileStack },
      { name: "Carica Documento", href: "/admin/documents/new", icon: Plus },
    ],
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: ImageIcon,
    color: "pink",
  },
  {
    name: "Utenti",
    href: "/admin/users",
    icon: Users,
    color: "cyan",
  },
  {
    name: "Impostazioni",
    href: "/admin/settings",
    icon: Settings,
    color: "gray",
  },
];

const colorClasses = {
  emerald: {
    active: "bg-gradient-to-r from-[#018856] to-[#016643] text-white shadow-md",
    hover: "hover:bg-emerald-50 hover:text-emerald-700",
    icon: "text-emerald-600",
    activeBg: "bg-emerald-50",
  },
  blue: {
    active: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
    hover: "hover:bg-blue-50 hover:text-blue-700",
    icon: "text-blue-600",
    activeBg: "bg-blue-50",
  },
  amber: {
    active: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md",
    hover: "hover:bg-amber-50 hover:text-amber-700",
    icon: "text-amber-600",
    activeBg: "bg-amber-50",
  },
  violet: {
    active: "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md",
    hover: "hover:bg-violet-50 hover:text-violet-700",
    icon: "text-violet-600",
    activeBg: "bg-violet-50",
  },
  pink: {
    active: "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md",
    hover: "hover:bg-pink-50 hover:text-pink-700",
    icon: "text-pink-600",
    activeBg: "bg-pink-50",
  },
  cyan: {
    active: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md",
    hover: "hover:bg-cyan-50 hover:text-cyan-700",
    icon: "text-cyan-600",
    activeBg: "bg-cyan-50",
  },
  gray: {
    active: "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md",
    hover: "hover:bg-gray-50 hover:text-gray-700",
    icon: "text-gray-600",
    activeBg: "bg-gray-50",
  },
};

export function SidebarNav() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          Navigazione
        </h2>
        <p className="text-xs text-gray-400">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const isParentActive = item.subItems?.some(sub => pathname === sub.href);
          const colors = colorClasses[item.color as keyof typeof colorClasses];

          return (
            <div key={item.name}>
              {/* Main Item */}
              {hasSubItems ? (
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive || isParentActive
                      ? colors.active
                      : `text-gray-700 ${colors.hover}`
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn(
                      "h-5 w-5",
                      isActive || isParentActive ? "text-white" : colors.icon
                    )} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive
                      ? colors.active
                      : `text-gray-700 ${colors.hover}`
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : colors.icon
                  )} />
                  <span>{item.name}</span>
                </Link>
              )}

              {/* Sub Items */}
              {hasSubItems && isExpanded && (
                <div className="mt-1 ml-6 space-y-1 pl-4 border-l-2 border-gray-200">
                  {item.subItems!.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                          isSubActive
                            ? `${colors.activeBg} font-semibold ${colors.icon}`
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                        <span>{subItem.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

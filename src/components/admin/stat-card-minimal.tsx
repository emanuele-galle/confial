"use client";

import { Newspaper, TrendingUp, FileText, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  newspaper: Newspaper,
  trendingUp: TrendingUp,
  fileText: FileText,
  eye: Eye,
};

const colorMap = {
  newspaper: {
    gradient: "from-blue-500 to-blue-600",
    glow: "group-hover:shadow-blue-500/20",
    lightBg: "bg-blue-50",
    icon: "text-blue-600"
  },
  trendingUp: {
    gradient: "from-[#018856] to-[#016643]",
    glow: "group-hover:shadow-emerald-500/20",
    lightBg: "bg-emerald-50",
    icon: "text-[#018856]"
  },
  fileText: {
    gradient: "from-violet-500 to-violet-600",
    glow: "group-hover:shadow-violet-500/20",
    lightBg: "bg-violet-50",
    icon: "text-violet-600"
  },
  eye: {
    gradient: "from-amber-500 to-amber-600",
    glow: "group-hover:shadow-amber-500/20",
    lightBg: "bg-amber-50",
    icon: "text-amber-600"
  },
};

interface StatCardMinimalProps {
  title: string;
  value: number;
  iconName: keyof typeof iconMap;
  change: { value: number; isPositive: boolean };
}

export function StatCardMinimal({
  title,
  value,
  iconName,
  change,
}: StatCardMinimalProps) {
  const Icon = iconMap[iconName];
  const colors = colorMap[iconName];

  return (
    <div className={cn(
      "relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100",
      colors.glow
    )}>
      {/* Decorative corner gradient */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full blur-2xl transition-opacity",
        colors.gradient,
        "group-hover:opacity-10"
      )} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">{title}</span>
          <div className={cn(
            "w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300",
            colors.gradient
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="text-4xl font-black text-gray-900 tabular-nums tracking-tight">
            {value.toLocaleString()}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm",
              change.isPositive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {change.isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {change.value}%
          </span>
        </div>
      </div>
    </div>
  );
}

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "emerald" | "blue" | "purple" | "orange" | "red";
}

const colorClasses = {
  emerald: {
    bg: "from-emerald-500/90 to-teal-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-emerald-400/20",
    glow: "shadow-emerald-500/20",
  },
  blue: {
    bg: "from-blue-500/90 to-indigo-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-blue-400/20",
    glow: "shadow-blue-500/20",
  },
  purple: {
    bg: "from-purple-500/90 to-pink-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-purple-400/20",
    glow: "shadow-purple-500/20",
  },
  orange: {
    bg: "from-orange-500/90 to-red-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-orange-400/20",
    glow: "shadow-orange-500/20",
  },
  red: {
    bg: "from-red-500/90 to-rose-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-red-400/20",
    glow: "shadow-red-500/20",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "emerald",
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="group relative overflow-hidden">
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-500",
          colors.bg,
          "group-hover:scale-105 group-hover:opacity-100"
        )}
      />

      {/* SVG Pattern Background */}
      <svg
        className="absolute right-0 top-0 h-full w-2/3 pointer-events-none opacity-30"
        viewBox="0 0 300 200"
        fill="none"
      >
        <circle cx="220" cy="100" r="90" fill="#fff" fillOpacity="0.08" />
        <circle cx="260" cy="60" r="60" fill="#fff" fillOpacity="0.10" />
        <circle cx="200" cy="160" r="50" fill="#fff" fillOpacity="0.07" />
        <circle cx="270" cy="150" r="30" fill="#fff" fillOpacity="0.12" />
      </svg>

      {/* Card Content */}
      <div
        className={cn(
          "relative rounded-2xl border backdrop-blur-sm p-6",
          "transition-all duration-300",
          colors.border,
          "group-hover:shadow-2xl group-hover:-translate-y-1",
          colors.glow
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-semibold text-white/90">{title}</p>
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "backdrop-blur-md border border-white/20",
              "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              colors.iconBg
            )}
          >
            <Icon className={cn("h-6 w-6", colors.iconText)} />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full",
                "backdrop-blur-md border border-white/20",
                trend.isPositive
                  ? "bg-white/20 text-white"
                  : "bg-black/20 text-white/90"
              )}
            >
              <span className={cn(trend.isPositive ? "↑" : "↓")}>
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -top-full -left-full h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}

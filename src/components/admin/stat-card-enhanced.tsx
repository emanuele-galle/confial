"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";

interface StatCardEnhancedProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "emerald" | "blue" | "purple" | "orange";
  sparkline: number[];
  change: { value: number; isPositive: boolean };
}

const colorClasses = {
  emerald: {
    bg: "from-emerald-500/90 to-teal-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-emerald-400/20",
    glow: "shadow-emerald-500/20",
    sparkline: "#10b981",
    sparklineGradient: "rgba(16, 185, 129, 0.2)",
  },
  blue: {
    bg: "from-blue-500/90 to-indigo-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-blue-400/20",
    glow: "shadow-blue-500/20",
    sparkline: "#3b82f6",
    sparklineGradient: "rgba(59, 130, 246, 0.2)",
  },
  purple: {
    bg: "from-purple-500/90 to-pink-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-purple-400/20",
    glow: "shadow-purple-500/20",
    sparkline: "#a855f7",
    sparklineGradient: "rgba(168, 85, 247, 0.2)",
  },
  orange: {
    bg: "from-orange-500/90 to-red-600/90",
    iconBg: "bg-white/20",
    iconText: "text-white",
    border: "border-orange-400/20",
    glow: "shadow-orange-500/20",
    sparkline: "#f97316",
    sparklineGradient: "rgba(249, 115, 22, 0.2)",
  },
};

export function StatCardEnhanced({
  title,
  value,
  icon: Icon,
  color,
  sparkline,
  change,
}: StatCardEnhancedProps) {
  const colors = colorClasses[color];
  const countRef = useRef<HTMLParagraphElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (latest) => {
      if (countRef.current) {
        countRef.current.textContent = latest.toString();
      }
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, motionValue, rounded]);

  // Generate SVG sparkline path
  const generateSparklinePath = () => {
    if (sparkline.length === 0) return "";

    const width = 70;
    const height = 24;
    const padding = 2;

    // Normalize data to fit height
    const max = Math.max(...sparkline, 1);
    const min = Math.min(...sparkline, 0);
    const range = max - min || 1;

    const points = sparkline.map((value, index) => {
      const x = (index / (sparkline.length - 1)) * width;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    // Create smooth path
    let path = `M ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i]}`;
    }

    return path;
  };

  const sparklinePath = generateSparklinePath();

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

        {/* Animated Counter and Sparkline */}
        <div className="flex items-end justify-between mb-3">
          <p
            ref={countRef}
            className="text-4xl font-bold text-white tracking-tight"
          >
            0
          </p>

          {/* Mini Sparkline Chart */}
          <svg
            width="70"
            height="24"
            viewBox="0 0 70 24"
            className="flex-shrink-0"
            style={{ marginBottom: "4px" }}
          >
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={colors.sparkline} stopOpacity="0.3" />
                <stop offset="100%" stopColor={colors.sparkline} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Gradient fill area */}
            {sparklinePath && (
              <path
                d={`${sparklinePath} L 70,24 L 0,24 Z`}
                fill={`url(#gradient-${color})`}
              />
            )}
            {/* Line */}
            {sparklinePath && (
              <path
                d={sparklinePath}
                fill="none"
                stroke={colors.sparkline}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>

        {/* Trend Badge */}
        <div className="flex items-center justify-end">
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full",
              "backdrop-blur-md border border-white/20",
              change.isPositive
                ? "bg-white/20 text-white"
                : "bg-black/20 text-white/90"
            )}
          >
            {change.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{change.value}%</span>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -top-full -left-full h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}

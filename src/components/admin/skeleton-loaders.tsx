"use client";

import { cn } from "@/lib/utils";

/**
 * Skeleton Loaders - Design System CONFIAL
 *
 * Componenti skeleton per loading states consistenti in tutta la dashboard.
 * Usano la palette colori CONFIAL (verde) per mantenere brand consistency.
 */

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "shimmer 2s ease-in-out infinite",
      }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="group relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 opacity-50" />

      {/* Card Content */}
      <div className="relative rounded-2xl border border-gray-200 backdrop-blur-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>

        {/* Counter and Sparkline */}
        <div className="flex items-end justify-between mb-3">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="w-[70px] h-6 rounded" />
        </div>

        {/* Trend Badge */}
        <div className="flex items-center justify-end">
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function NewsListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-start justify-between p-4 rounded-xl border border-gray-200"
        >
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full ml-3" />
        </div>
      ))}
    </div>
  );
}

export function DocumentListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 rounded-lg ml-3" />
        </div>
      ))}
    </div>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-64 rounded-lg" />
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

// Add shimmer animation to global CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;
  document.head.appendChild(style);
}

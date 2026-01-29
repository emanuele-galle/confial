"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium transition-colors",
          "text-xs px-2 py-0.5 rounded-full",
          {
            "bg-[#018856] text-white": variant === "default",
            "bg-gray-100 text-gray-700 hover:bg-gray-200": variant === "secondary",
            "border border-gray-300 text-gray-700": variant === "outline",
            "bg-green-100 text-green-700": variant === "success",
            "bg-yellow-100 text-yellow-700": variant === "warning",
            "bg-red-100 text-red-700": variant === "danger",
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };

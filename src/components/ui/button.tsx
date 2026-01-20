"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white",
          {
            // Primary: pill-shaped verde CONFIAL
            "bg-[#018856] hover:bg-[#016b43] text-white focus:ring-[#018856] rounded-full": variant === "primary",
            // Secondary: grigio scuro CONFIAL
            "bg-[#34495e] hover:bg-[#2c3e50] text-white focus:ring-[#34495e] rounded-full": variant === "secondary",
            // Outline: bordo verde
            "border-2 border-[#018856] hover:bg-[#018856] text-[#018856] hover:text-white focus:ring-[#018856] rounded-full": variant === "outline",
            // Ghost: hover subtile
            "hover:bg-gray-100 text-gray-700 hover:text-[#018856] rounded-lg": variant === "ghost",
          },
          {
            "text-sm px-4 py-2": size === "sm",
            "text-base px-6 py-3": size === "md",
            "text-lg px-8 py-4": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

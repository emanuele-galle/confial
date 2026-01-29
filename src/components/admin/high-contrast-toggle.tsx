"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * High Contrast Toggle Component (A11Y-06)
 *
 * Provides a toggle button to switch between normal and high contrast modes
 * for users with visual impairments or low vision.
 *
 * High contrast mode uses pure black/white colors for maximum contrast ratio.
 * Preference is saved to localStorage and persists across sessions.
 *
 * WCAG 2.1 AA Compliance: Use of Color (1.4.1), Contrast (1.4.3)
 */
export function HighContrastToggle() {
  const [highContrast, setHighContrast] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only using localStorage after mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("highContrast");
    if (saved === "true") {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const toggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("highContrast", String(newValue));

    if (newValue) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded hover:bg-gray-100 transition-colors touch-target"
        disabled
        aria-label="Caricamento preferenze contrasto..."
      >
        <Eye className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={highContrast}
      aria-label={
        highContrast
          ? "Disattiva alto contrasto"
          : "Attiva alto contrasto"
      }
      className="p-2 rounded hover:bg-gray-100 transition-colors touch-target"
      title={
        highContrast
          ? "Disattiva alto contrasto"
          : "Attiva alto contrasto"
      }
    >
      {highContrast ? (
        <EyeOff className="w-5 h-5 text-gray-600" />
      ) : (
        <Eye className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}

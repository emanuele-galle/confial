"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: "var(--font-geist-sans)",
        },
        className: "rounded-lg border",
      }}
    />
  );
}

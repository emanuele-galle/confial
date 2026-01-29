"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Media page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8">
      <div className="mb-4 rounded-full bg-red-100 p-3">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Errore nel caricamento della libreria media
      </h2>

      <p className="mb-6 text-center text-gray-600">
        Si è verificato un errore durante il caricamento dei media.
        <br />
        Riprova o contatta il supporto se il problema persiste.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => reset()}>
          Riprova
        </Button>
        <Button onClick={() => (window.location.href = "/dashboard")} variant="outline">
          Torna alla Dashboard
        </Button>
      </div>

      {error.digest && (
        <p className="mt-4 text-xs text-gray-500">
          Codice errore: {error.digest}
        </p>
      )}
    </div>
  );
}

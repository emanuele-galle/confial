"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TemplatesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Templates page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Errore nel caricamento dei template
        </h2>
        <p className="text-gray-600 mb-6">
          Si è verificato un errore durante il caricamento della pagina.
        </p>
      </div>
      <Button onClick={reset}>Riprova</Button>
    </div>
  );
}

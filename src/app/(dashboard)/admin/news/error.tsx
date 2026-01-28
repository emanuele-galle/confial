"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("News error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">News</h1>
        <p className="text-gray-600">Gestisci le news del sito</p>
      </div>

      <div className="bg-white rounded-xl border border-red-200 p-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Si è verificato un errore
            </h2>
            <p className="text-gray-600 mb-4">
              Impossibile caricare le news. Riprova più tardi.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <Button onClick={reset}>Riprova</Button>
        </div>
      </div>
    </div>
  );
}

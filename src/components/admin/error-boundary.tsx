"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Cattura errori React durante rendering e mostra fallback UI user-friendly.
 * Include opzione per reset e retry.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, would send to error tracking service)
    console.error("ErrorBoundary caught error:", error, errorInfo);

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Qualcosa è andato storto
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Si è verificato un errore imprevisto. Prova a ricaricare il componente.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mb-6">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                  Dettagli errore (solo in sviluppo)
                </summary>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={this.resetError}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#018856] hover:bg-[#016b43] text-white font-semibold rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Riprova
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Compact Error Fallback - per componenti piccoli
 */
export function CompactErrorFallback({
  error,
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800">Errore di caricamento</p>
          <p className="text-xs text-red-600 mt-1">
            {error?.message || "Si è verificato un errore"}
          </p>
        </div>
        {reset && (
          <button
            onClick={reset}
            className="text-xs text-red-700 hover:text-red-800 font-semibold underline flex-shrink-0"
          >
            Riprova
          </button>
        )}
      </div>
    </div>
  );
}

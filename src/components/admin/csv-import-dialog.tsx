"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  entityType: "news" | "events";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Phase = "upload" | "validation" | "progress" | "complete";

interface ValidationResult {
  valid: number;
  invalid: number;
  errors: Array<{ row: number; errors: string[] }>;
  preview: Array<Record<string, unknown>>;
}

interface ProgressData {
  processed: number;
  total: number;
  current: string;
}

export function CSVImportDialog({ entityType, open, onOpenChange, onSuccess }: Props) {
  const [phase, setPhase] = useState<Phase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPhase("upload");
      setFile(null);
      setValidationResult(null);
      setProgress(null);
      setError(null);
      setSuccessMessage(null);
      setShowErrorDetails(false);
      setIsLoading(false);
    } else {
      // Cleanup EventSource on close
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
  }, [open]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      handleFileSelect(droppedFile);
    } else {
      setError("Per favore carica un file CSV valido");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Il file supera il limite di 5MB");
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Validate immediately
    await validateFile(selectedFile);
  };

  const validateFile = async (fileToValidate: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", fileToValidate);
      formData.append("entityType", entityType);

      const response = await fetch("/api/admin/csv/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Errore durante la validazione");
      }

      const result = await response.json();
      setValidationResult(result);
      setPhase("validation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la validazione");
      setPhase("upload");
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const executeImport = async () => {
    if (!file || !validationResult) return;

    setPhase("progress");
    setError(null);

    try {
      // First upload the file again with execute flag
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entityType", entityType);

      const uploadResponse = await fetch("/api/admin/csv/import", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Errore durante il caricamento del file");
      }

      const uploadResult = await uploadResponse.json();
      const fileId = uploadResult.fileId || "temp";

      // Then start SSE stream for progress
      const eventSource = new EventSource(
        `/api/admin/csv/import?execute=true&entityType=${entityType}&fileId=${fileId}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.type === "progress") {
          setProgress({
            processed: data.processed,
            total: data.total,
            current: data.current,
          });
        } else if (data.type === "complete") {
          setPhase("complete");
          setSuccessMessage(`Importati ${data.count} elementi con successo`);
          eventSource.close();
          eventSourceRef.current = null;
        } else if (data.type === "error") {
          setPhase("complete");
          setError(data.message);
          eventSource.close();
          eventSourceRef.current = null;
        }
      };

      eventSource.onerror = () => {
        setPhase("complete");
        setError("Connessione interrotta durante l'importazione");
        eventSource.close();
        eventSourceRef.current = null;
      };
    } catch (err) {
      setPhase("complete");
      setError(err instanceof Error ? err.message : "Errore durante l'importazione");
    }
  };

  const handleClose = () => {
    if (phase === "progress") return; // Don't close during import

    if (phase === "complete" && successMessage) {
      onSuccess(); // Refresh parent list
    }

    onOpenChange(false);
  };

  if (!open) return null;

  const entityLabel = entityType === "news" ? "News" : "Eventi";
  const formatExample = entityType === "news"
    ? "titolo,contenuto,stato,categoria,slug"
    : "titolo,descrizione,data_evento,luogo,stato,slug";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Importa {entityLabel} da CSV
          </h2>
          <button
            onClick={handleClose}
            disabled={phase === "progress"}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Phase */}
          {phase === "upload" && (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
                  isDragging
                    ? "border-[#018856] bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Trascina il file CSV qui
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  oppure clicca per selezionarlo
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm">
                  Seleziona File
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                  Formato richiesto:
                </h4>
                <code className="text-xs text-blue-800 font-mono block">
                  {formatExample}
                </code>
                <p className="text-xs text-blue-700 mt-2">
                  Massimo 5MB • Prima riga: intestazioni colonne
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Validation Phase */}
          {phase === "validation" && validationResult && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-800">
                      {validationResult.valid} righe valide
                    </span>
                  </div>
                  {validationResult.invalid > 0 && (
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <span className="font-semibold text-amber-800">
                        {validationResult.invalid} righe con errori
                      </span>
                    </div>
                  )}
                </div>

                {/* Preview */}
                {validationResult.preview.length > 0 && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200 overflow-x-auto">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Anteprima prime 5 righe:
                    </p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {Object.keys(validationResult.preview[0]).map((key) => (
                            <th key={key} className="text-left py-2 px-2 font-semibold text-gray-700">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {validationResult.preview.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            {Object.values(row).map((value, vidx) => (
                              <td key={vidx} className="py-2 px-2 text-gray-600">
                                {String(value).substring(0, 30)}
                                {String(value).length > 30 ? "..." : ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Error Details */}
              {validationResult.invalid > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <button
                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-semibold text-amber-900 text-sm">
                      Dettagli errori ({validationResult.errors.length})
                    </span>
                    <span className="text-amber-700 text-xs">
                      {showErrorDetails ? "Nascondi" : "Mostra"}
                    </span>
                  </button>

                  {showErrorDetails && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                      {validationResult.errors.map((error, idx) => (
                        <div key={idx} className="bg-white rounded p-2 border border-amber-200">
                          <p className="text-xs font-semibold text-amber-900">
                            Riga {error.row}:
                          </p>
                          <ul className="text-xs text-amber-800 list-disc list-inside mt-1">
                            {error.errors.map((msg, midx) => (
                              <li key={midx}>{msg}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Progress Phase */}
          {phase === "progress" && progress && (
            <div className="space-y-4">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-[#018856] animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Importazione in corso...
                </h3>
                <p className="text-sm text-gray-600">Non chiudere questa finestra</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">
                    {progress.processed} / {progress.total}
                  </span>
                  <span className="text-gray-600">
                    {Math.round((progress.processed / progress.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#018856] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(progress.processed / progress.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 truncate">
                  Importazione: {progress.current}
                </p>
              </div>
            </div>
          )}

          {/* Complete Phase */}
          {phase === "complete" && (
            <div className="text-center space-y-4">
              {successMessage ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Importazione completata!
                  </h3>
                  <p className="text-gray-600">{successMessage}</p>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Importazione annullata
                  </h3>
                  <p className="text-red-600">{error}</p>
                </>
              )}
            </div>
          )}

          {isLoading && phase === "upload" && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 text-[#018856] animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Validazione in corso...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          {phase === "validation" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPhase("upload");
                  setFile(null);
                  setValidationResult(null);
                }}
              >
                Annulla
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={executeImport}
                disabled={!validationResult || validationResult.valid === 0}
              >
                Procedi con l&apos;importazione
              </Button>
            </>
          )}

          {phase === "complete" && (
            <Button type="button" variant="primary" onClick={handleClose}>
              Chiudi
            </Button>
          )}

          {phase === "upload" && !isLoading && (
            <Button type="button" variant="outline" onClick={handleClose}>
              Annulla
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

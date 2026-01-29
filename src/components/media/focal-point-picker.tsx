"use client";

import { useState, useRef, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Media {
  id: string;
  filename: string;
  url: string;
  focalPointX?: number | null;
  focalPointY?: number | null;
  width?: number | null;
  height?: number | null;
}

interface FocalPointPickerProps {
  media: Media;
  onChange: (x: number, y: number) => void;
}

export function FocalPointPicker({ media, onChange }: FocalPointPickerProps) {
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({
    x: media.focalPointX ?? 50,
    y: media.focalPointY ?? 50,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newFocalPoint = {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };

    setFocalPoint(newFocalPoint);
    onChange(newFocalPoint.x, newFocalPoint.y);
    setConfidence(null); // Reset confidence on manual change
  };

  const handleAutoDetect = async () => {
    setIsAnalyzing(true);
    setConfidence(null);

    try {
      const response = await fetch("/api/media/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: media.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore nell'analisi");
      }

      const result = await response.json();

      setFocalPoint({ x: result.x, y: result.y });
      setConfidence(result.confidence);
      onChange(result.x, result.y);

      if (result.confidence > 0.7) {
        toast.success("Punto focale rilevato con alta confidenza");
      } else if (result.confidence > 0.3) {
        toast.success("Punto focale rilevato");
      } else {
        toast.info("Nessun soggetto chiaro, usato centro immagine");
      }
    } catch (error) {
      console.error("Auto-detect error:", error);
      toast.error(error instanceof Error ? error.message : "Errore nel rilevamento automatico");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image with focal point overlay */}
      <div
        ref={imageRef}
        className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-crosshair group"
        onClick={handleImageClick}
      >
        <img
          src={media.url}
          alt={media.filename}
          className="w-full h-full object-contain"
        />

        {/* Focal point marker */}
        <div
          className="absolute w-10 h-10 pointer-events-none transition-all"
          style={{
            left: `${focalPoint.x}%`,
            top: `${focalPoint.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg" />
          {/* Inner circle */}
          <div className="absolute inset-2 rounded-full bg-[#018856] opacity-80" />
          {/* Crosshair */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white -ml-px opacity-60" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white -mt-px opacity-60" />
        </div>

        {/* Confidence badge */}
        {confidence !== null && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Confidenza: {(confidence * 100).toFixed(0)}%
          </div>
        )}

        {/* Instructions overlay (shows on hover) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium text-gray-900">
              Clicca per posizionare il punto focale
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Posizione:</span> {focalPoint.x.toFixed(1)}%, {focalPoint.y.toFixed(1)}%
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoDetect}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analisi in corso...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Rileva automaticamente
            </>
          )}
        </Button>
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500">
        Il punto focale determina quale parte dell'immagine mantenere visibile quando viene ritagliata automaticamente.
      </p>
    </div>
  );
}

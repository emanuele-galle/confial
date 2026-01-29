"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface Media {
  id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  folder?: string | null;
  tags: string[];
  alt?: string | null;
}

interface MediaCropDialogProps {
  media: Media;
  open: boolean;
  onClose: () => void;
  onCropComplete: (newMedia: Media) => void;
}

const ASPECT_RATIOS = [
  { label: "Libero", value: undefined },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "9:16", value: 9 / 16 },
];

export function MediaCropDialog({ media, open, onClose, onCropComplete }: MediaCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropCompleteCallback = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels || !media.width || !media.height) {
      toast.error("Impossibile ritagliare: dimensioni immagine non disponibili");
      return;
    }

    setIsLoading(true);

    try {
      // Convert pixels to percentages for API
      const cropData = {
        x: (croppedAreaPixels.x / media.width) * 100,
        y: (croppedAreaPixels.y / media.height) * 100,
        width: (croppedAreaPixels.width / media.width) * 100,
        height: (croppedAreaPixels.height / media.height) * 100,
      };

      const response = await fetch("/api/media/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId: media.id,
          crop: cropData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore nel ritaglio");
      }

      const newMedia = await response.json();
      toast.success("Immagine ritagliata con successo");
      onCropComplete(newMedia);
      onClose();
    } catch (error) {
      console.error("Crop error:", error);
      toast.error(error instanceof Error ? error.message : "Errore nel ritaglio");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ritaglia immagine</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cropper area */}
          <div className="relative h-[400px] w-full bg-gray-900 rounded-lg overflow-hidden">
            <Cropper
              image={media.url}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteCallback}
              cropShape="rect"
              showGrid={true}
            />
          </div>

          {/* Aspect ratio buttons */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Proporzioni
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <Button
                  key={ratio.label}
                  type="button"
                  variant={aspect === ratio.value ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setAspect(ratio.value)}
                >
                  {ratio.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Zoom slider */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Zoom: {zoom.toFixed(1)}x
            </label>
            <Slider
              value={[zoom]}
              onValueChange={(values: number[]) => setZoom(values[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Annulla
          </Button>
          <Button type="button" onClick={handleCrop} disabled={isLoading}>
            {isLoading ? "Ritaglio in corso..." : "Ritaglia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

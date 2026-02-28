"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MediaLibrary } from "@/components/media/media-library";
import { MediaCropDialog } from "@/components/media/media-crop-dialog";

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

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, alt?: string) => void;
}

export function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);

  const handleMediaSelect = (media: Media) => {
    setSelectedMedia(media);
  };

  const handleSelectClick = () => {
    if (selectedMedia) {
      onSelect(selectedMedia.url, selectedMedia.alt || undefined);
    }
  };

  const handleCropClick = () => {
    if (selectedMedia) {
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = (newMedia: Media) => {
    setSelectedMedia(newMedia);
    setCropDialogOpen(false);
    // Automatically select the cropped image
    onSelect(newMedia.url, newMedia.alt || undefined);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Seleziona un&apos;immagine</DialogTitle>
          </DialogHeader>

          {/* Media Library in dialog mode */}
          <div className="flex h-[600px]">
            <div className="flex-1">
              <MediaLibrary
                mode="dialog"
                onSelect={handleMediaSelect}
                isOpen={true}
                onClose={() => {}} // Don't close parent dialog
              />
            </div>
          </div>

          {/* Action buttons */}
          {selectedMedia && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Selezionato:</span> {selectedMedia.filename}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCropClick}
                >
                  Ritaglia
                </Button>
                <Button
                  type="button"
                  onClick={handleSelectClick}
                >
                  Seleziona
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Crop Dialog */}
      {selectedMedia && (
        <MediaCropDialog
          media={selectedMedia}
          open={cropDialogOpen}
          onClose={() => setCropDialogOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}

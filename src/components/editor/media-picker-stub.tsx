"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image, Calendar } from "lucide-react";

interface MediaPickerStubProps {
  open: boolean;
  onClose: () => void;
}

export function MediaPickerStub({ open, onClose }: MediaPickerStubProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Libreria Media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center p-6 bg-blue-50 border-2 border-blue-200 border-dashed rounded-xl">
            <div className="text-center space-y-2">
              <Image className="h-12 w-12 text-blue-400 mx-auto" />
              <p className="text-sm font-medium text-blue-900">
                La libreria media sarà disponibile nella Fase 3
              </p>
              <p className="text-xs text-blue-600">
                Potrai gestire e inserire immagini dalla libreria centralizzata
              </p>
            </div>
          </div>

          {/* Placeholder grid - simulates future media library */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Anteprima Futura
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <div className="relative z-10 text-gray-400">
                    <Image className="h-8 w-8" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                    <p className="text-[10px] font-medium text-gray-600 truncate">
                      Media {i}
                    </p>
                    <p className="text-[9px] text-gray-400 flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" />
                      2026-01-{10 + i}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

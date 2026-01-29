"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: "square" | "video" | "banner"; // 1:1, 16:9, 3:1
  maxSizeMB?: number;
  label?: string;
  folder?: "news-covers" | "events-covers" | "general";
}

const ASPECT_RATIOS = {
  square: "aspect-square",
  video: "aspect-video",
  banner: "aspect-[3/1]",
};

export function ImageUpload({
  value,
  onChange,
  onRemove,
  aspectRatio = "video",
  maxSizeMB = 5,
  label = "Immagine di copertina",
  folder = "general",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Seleziona un file immagine");
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      alert(`File troppo grande. Dimensione massima: ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore durante l'upload");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Errore durante l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleRemove = () => {
    onChange("");
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className="relative group">
          <div className={cn("relative rounded-lg overflow-hidden", ASPECT_RATIOS[aspectRatio])}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleRemove}
                className="bg-red-600 hover:bg-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Rimuovi
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Aspect ratio: {aspectRatio} ({ASPECT_RATIOS[aspectRatio]})
          </p>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-2">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                uploading && "opacity-50 pointer-events-none"
              )}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Upload in corso...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Trascina un'immagine o clicca per selezionare
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP o GIF (max {maxSizeMB}MB)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Aspect ratio consigliato: {aspectRatio}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </TabsContent>

          <TabsContent value="url" className="space-y-2">
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://esempio.com/immagine.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!urlInput.trim()}>
                <LinkIcon className="h-4 w-4 mr-1" />
                Usa URL
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              Inserisci l'URL di un'immagine esterna
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

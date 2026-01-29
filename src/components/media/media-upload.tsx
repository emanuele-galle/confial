"use client";

import { useState, DragEvent } from "react";
import { toast } from "sonner";

interface UploadedMedia {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  folder?: string | null;
  tags: string[];
  alt?: string | null;
}

interface MediaUploadProps {
  onUploadComplete: (media: UploadedMedia[]) => void;
  folder?: string;
}

interface FileProgress {
  name: string;
  progress: number;
  error?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;

export function MediaUpload({ onUploadComplete, folder }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filesProgress, setFilesProgress] = useState<FileProgress[]>([]);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    if (files.length > MAX_FILES) {
      errors.push(`Massimo ${MAX_FILES} file alla volta`);
      return { valid, errors };
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: tipo non supportato (usa JPEG, PNG, WebP o GIF)`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: troppo grande (max 10MB)`);
        continue;
      }

      valid.push(file);
    }

    return { valid, errors };
  };

  const uploadFiles = async (files: File[]) => {
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      if (valid.length === 0) return;
    }

    setUploading(true);
    setFilesProgress(valid.map((f) => ({ name: f.name, progress: 0 })));

    try {
      const formData = new FormData();
      valid.forEach((file) => formData.append("files", file));
      if (folder) formData.append("folder", folder);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload fallito");
      }

      const data = await response.json();

      // Update progress to 100% for all files
      setFilesProgress(valid.map((f) => ({ name: f.name, progress: 100 })));

      toast.success(`${data.count} ${data.count === 1 ? "file caricato" : "file caricati"} con successo`);

      // Call completion callback
      onUploadComplete(data.media);

      // Reset after brief delay
      setTimeout(() => {
        setFilesProgress([]);
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Errore durante l'upload");
      setFilesProgress([]);
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadFiles(files);
    }
    e.target.value = ""; // Reset input
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-lg border-2 border-dashed p-8 text-center transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : uploading
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
          }
        `}
      >
        {!uploading ? (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-900">
              Trascina qui le immagini o clicca per selezionare
            </p>
            <p className="mt-1 text-xs text-gray-500">
              JPEG, PNG, WebP o GIF fino a 10MB (max {MAX_FILES} file)
            </p>
            <input
              type="file"
              multiple
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileInput}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Caricamento in corso...
            </p>
            {filesProgress.map((file, i) => (
              <div key={i} className="mx-auto max-w-md text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate text-gray-700">{file.name}</span>
                  <span className="text-gray-500">{file.progress}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

export default function DocumentUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        if (!formData.title) {
          setFormData({
            ...formData,
            title: file.name.replace(".pdf", ""),
          });
        }
      } else {
        toast.error("Solo file PDF sono permessi");
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        if (!formData.title) {
          setFormData({
            ...formData,
            title: file.name.replace(".pdf", ""),
          });
        }
      } else {
        toast.error("Solo file PDF sono permessi");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Seleziona un file PDF");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("title", formData.title);
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.category) {
        formDataToSend.append("category", formData.category);
      }

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Documento caricato con successo!");
        router.push("/admin/documents");
      } else {
        const error = await response.json();
        toast.error(error.error || "Errore durante l'upload");
      }
    } catch (error) {
      toast.error("Errore di rete");
    } finally {
      setLoading(false);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Carica Documento</h1>
        <p className="text-gray-600 mt-1">Carica un nuovo documento PDF</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Upload className="h-4 w-4 text-emerald-700" />
            </div>
            File Upload
          </h3>
          <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            File PDF *
          </label>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-[#018856] bg-emerald-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Trascina un file PDF qui
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  oppure clicca per selezionare
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Scegli File
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Dimensione massima: 10MB
                </p>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Metadata Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-700" />
            </div>
            Informazioni Documento
          </h3>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Titolo *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
                placeholder="Titolo del documento"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Descrizione
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
                placeholder="Descrizione breve (opzionale)"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Categoria
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              >
                <option value="">Seleziona categoria</option>
                <option value="Contratti">Contratti</option>
                <option value="Modulistica">Modulistica</option>
                <option value="Comunicati">Comunicati</option>
                <option value="Regolamenti">Regolamenti</option>
                <option value="Statuti">Statuti</option>
                <option value="Altri">Altri</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || !selectedFile} size="lg" className="bg-[#018856] hover:bg-[#016b43] shadow-lg">
            {loading ? "Caricamento..." : "Carica Documento"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annulla
          </Button>
        </div>
      </form>
    </div>
  );
}

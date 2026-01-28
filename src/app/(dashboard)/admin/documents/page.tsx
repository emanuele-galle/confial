"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  filename: string;
  category: string | null;
  fileSize: number;
  downloadCount: number;
  uploadedAt: string;
  uploadedBy: {
    name: string;
  };
}

export default function DocumentsListPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const response = await fetch("/api/admin/documents");
      const data = await response.json();
      setDocuments(data.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Sei sicuro di voler eliminare questo documento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Documento eliminato con successo!");
        setDocuments(documents.filter((doc) => doc.id !== id));
      } else {
        toast.error("Errore durante l'eliminazione");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documenti</h1>
          <p className="text-gray-600">Gestisci i documenti PDF del sito</p>
        </div>

        <Link href="/admin/documents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Carica Documento
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Caricamento...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 gap-4 p-6">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Nessun documento ancora caricato.
                </p>
                <Link href="/admin/documents/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Carica il primo documento
                  </Button>
                </Link>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doc.filename} • {formatFileSize(doc.fileSize)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Caricato da {doc.uploadedBy.name} •{" "}
                        {new Date(doc.uploadedAt).toLocaleDateString("it-IT")} •{" "}
                        {doc.downloadCount} download
                      </p>
                    </div>
                    {doc.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {doc.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <a
                      href={`/api/documents/${doc.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

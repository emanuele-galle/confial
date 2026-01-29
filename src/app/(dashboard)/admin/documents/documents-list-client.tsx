"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-bar";
import { FilterDropdown } from "@/components/admin/filter-dropdown";
import { BulkActionsBar, bulkActions } from "@/components/admin/bulk-actions-bar";
import { Plus, FileText, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  filename: string;
  category: string | null;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: { name: string };
}

export function DocumentsListClient() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, [search, categoryFilter, page]);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(categoryFilter && { category: categoryFilter }),
      });

      const response = await fetch(`/api/admin/documents?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      toast.error("Errore nel caricamento dei documenti");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelection(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === documents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(documents.map((d) => d.id));
    }
  }

  async function handleBulkDelete(ids: string[]) {
    try {
      const response = await fetch("/api/admin/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entityType: "documents",
          ids,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.success} documenti eliminati`);
        if (result.failed > 0) {
          toast.error(`${result.failed} errori`);
        }
        setSelectedIds([]);
        fetchDocuments();
      } else {
        toast.error("Errore nell'eliminazione");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documenti</h1>
          <p className="text-gray-600 mt-1">
            Gestisci i documenti FAILMS ({total} totali)
          </p>
        </div>

        <Link href="/admin/documents/new">
          <Button className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Carica Documento
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cerca per titolo, descrizione, nome file..."
          />
        </div>
        <FilterDropdown
          label="Categoria"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { label: "Contratti", value: "contratti" },
            { label: "Moduli", value: "moduli" },
            { label: "Circolari", value: "circolari" },
            { label: "Comunicazioni", value: "comunicazioni" },
          ]}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Caricamento...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nessun documento trovato
            </h3>
            <p className="text-gray-600 mb-6">
              {search || categoryFilter
                ? "Prova a cambiare i filtri"
                : "Inizia a caricare documenti"}
            </p>
            <Link href="/admin/documents/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Carica il primo documento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === documents.length && documents.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Titolo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Dimensione
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Caricato
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors group ${
                      selectedIds.includes(item.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="w-4 h-4 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-[#018856] transition-colors">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500">{item.filename}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.category ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {formatFileSize(item.fileSize)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.uploadedAt).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/api/documents/${item.id}/download`}
                        className="inline-flex items-center gap-2 text-[#018856] hover:text-[#016b43] font-semibold text-sm group-hover:gap-3 transition-all"
                      >
                        <Download className="h-4 w-4" />
                        Scarica
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        actions={[bulkActions.delete((ids) => handleBulkDelete(ids))]}
      />
    </div>
  );
}

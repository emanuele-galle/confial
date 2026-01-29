"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/admin/search-bar";
import { FilterDropdown } from "@/components/admin/filter-dropdown";
import { BulkActionsBar, bulkActions } from "@/components/admin/bulk-actions-bar";
import { Plus, Edit, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface News {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  createdAt: string;
  author: { name: string };
}

export function NewsListClient() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [search, statusFilter, featuredFilter, page]);

  async function fetchNews() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(featuredFilter && { featured: featuredFilter }),
      });

      const response = await fetch(`/api/admin/news?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      toast.error("Errore nel caricamento delle news");
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
    if (selectedIds.length === news.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(news.map((n) => n.id));
    }
  }

  async function handleBulkAction(action: string, ids: string[]) {
    try {
      const response = await fetch("/api/admin/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entityType: "news",
          ids,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.success} elementi aggiornati`);
        if (result.failed > 0) {
          toast.error(`${result.failed} errori`);
        }
        setSelectedIds([]);
        fetchNews();
      } else {
        toast.error("Errore nell'operazione batch");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">News</h1>
          <p className="text-gray-600 mt-1">
            Gestisci le news del sito FAILMS ({total} totali)
          </p>
        </div>

        <Link href="/admin/news/new">
          <Button className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Crea News
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cerca per titolo, contenuto..."
          />
        </div>
        <FilterDropdown
          label="Stato"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Pubblicato", value: "PUBLISHED" },
            { label: "Bozza", value: "DRAFT" },
            { label: "Archiviato", value: "ARCHIVED" },
          ]}
        />
        <FilterDropdown
          label="In evidenza"
          value={featuredFilter}
          onChange={setFeaturedFilter}
          options={[
            { label: "Sì", value: "true" },
            { label: "No", value: "false" },
          ]}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Caricamento...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nessuna news trovata
            </h3>
            <p className="text-gray-600 mb-6">
              {search || statusFilter || featuredFilter
                ? "Prova a cambiare i filtri"
                : "Inizia a creare contenuti per il sito"}
            </p>
            <Link href="/admin/news/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crea la prima news
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
                      checked={selectedIds.length === news.length && news.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Titolo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Autore
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Stato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {news.map((item) => (
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
                      <p className="font-semibold text-gray-800 group-hover:text-[#018856] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 font-mono">
                        /news/{item.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#018856] to-[#016b43] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {item.author.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {item.author.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : item.status === "DRAFT"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {item.status === "PUBLISHED"
                          ? "✓ Pubblicato"
                          : item.status === "DRAFT"
                          ? "○ Bozza"
                          : "□ Archiviato"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.createdAt).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="inline-flex items-center gap-2 text-[#018856] hover:text-[#016b43] font-semibold text-sm group-hover:gap-3 transition-all"
                      >
                        <Edit className="h-4 w-4" />
                        Modifica
                      </Link>
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
        actions={[
          bulkActions.publish((ids) => handleBulkAction("publish", ids)),
          bulkActions.unpublish((ids) => handleBulkAction("unpublish", ids)),
          bulkActions.archive((ids) => handleBulkAction("archive", ids)),
          bulkActions.delete((ids) => handleBulkAction("delete", ids)),
        ]}
      />
    </div>
  );
}

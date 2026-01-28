"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function NewsEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });

  useEffect(() => {
    fetchNews();
  }, [params.id]);

  async function fetchNews() {
    try {
      const response = await fetch(`/api/admin/news/${params.id}`);
      if (response.ok) {
        const news: News = await response.json();
        setFormData({
          title: news.title,
          content: news.content,
          excerpt: news.excerpt || "",
          status: news.status,
        });
      } else {
        alert("News non trovata");
        router.push("/admin/news");
      }
    } catch (error) {
      alert("Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/news/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/news");
      } else {
        alert("Errore nel salvataggio della news");
      }
    } catch (error) {
      alert("Errore di rete");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Sei sicuro di voler eliminare questa news?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/news/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/news");
      } else {
        alert("Errore nell'eliminazione");
      }
    } catch (error) {
      alert("Errore di rete");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Caricamento...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifica News</h1>
          <p className="text-gray-600">Aggiorna i campi della news</p>
        </div>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Elimina News
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
            placeholder="Titolo della news"
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Estratto
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
            placeholder="Breve estratto (opzionale)"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenuto *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
            rows={12}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
            placeholder="Contenuto completo della news"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Stato
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "DRAFT" | "PUBLISHED",
              })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
          >
            <option value="DRAFT">Bozza</option>
            <option value="PUBLISHED">Pubblicato</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvataggio..." : "Salva Modifiche"}
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

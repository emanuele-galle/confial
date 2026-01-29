"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedEditor } from "@/components/editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { FormField } from "@/components/admin/form-field";
import { toast } from "sonner";
import { Newspaper, Settings } from "lucide-react";

interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  metaTitle: string | null;
  metaDescription: string | null;
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
    coverImage: "",
    featured: false,
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    fetchNews();
  }, [params.id]);

  async function fetchNews() {
    try {
      const response = await fetch(`/api/admin/news/${params.id}`);
      if (response.ok) {
        const { data: news } = await response.json();
        setFormData({
          title: news.title,
          content: news.content,
          excerpt: news.excerpt || "",
          coverImage: news.coverImage || "",
          featured: news.featured || false,
          status: news.status,
          metaTitle: news.metaTitle || "",
          metaDescription: news.metaDescription || "",
        });
      } else {
        toast.error("News non trovata");
        router.push("/admin/news");
      }
    } catch (error) {
      toast.error("Errore nel caricamento");
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
        toast.success("News aggiornata con successo!");
        router.push("/admin/news");
      } else {
        toast.error("Errore nel salvataggio della news");
      }
    } catch (error) {
      toast.error("Errore di rete");
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
        toast.success("News eliminata con successo!");
        router.push("/admin/news");
      } else {
        toast.error("Errore nell'eliminazione");
      }
    } catch (error) {
      toast.error("Errore di rete");
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
          <h1 className="text-3xl font-bold text-gray-800">Modifica News</h1>
          <p className="text-gray-600 mt-1">Aggiorna i campi della news</p>
        </div>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          Elimina News
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Sezione Informazioni Principali */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Newspaper className="h-4 w-4 text-emerald-700" />
            </div>
            Informazioni Principali
          </h3>

          <FormField label="Titolo" required>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="Titolo della news"
            />
          </FormField>

          <FormField label="Estratto">
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="Breve estratto (opzionale)"
            />
          </FormField>

          <FormField label="Immagine di copertina">
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              aspectRatio="video"
              folder="news-covers"
            />
          </FormField>

          <FormField label="Contenuto" required>
            <AdvancedEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Scrivi il contenuto della news..."
            />
          </FormField>
        </div>

        {/* Sezione Impostazioni */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-gray-700" />
            </div>
            Impostazioni
          </h3>

          <div className="flex items-center gap-2">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
            />
            <label
              htmlFor="featured"
              className="text-sm font-semibold text-gray-700"
            >
              News in evidenza
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Stato">
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "DRAFT" | "PUBLISHED",
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              >
                <option value="DRAFT">Bozza</option>
                <option value="PUBLISHED">Pubblicato</option>
              </select>
            </FormField>

            <FormField label="Meta Title (SEO)" helperText="Max 60 caratteri">
              <input
                id="metaTitle"
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                maxLength={60}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
                placeholder="Titolo SEO"
              />
            </FormField>
          </div>

          <FormField label="Meta Description (SEO)" helperText="Max 160 caratteri">
            <textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              maxLength={160}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="Descrizione SEO"
            />
          </FormField>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} size="lg" className="bg-[#018856] hover:bg-[#016b43] shadow-lg">
            {saving ? "Salvataggio..." : "Salva Modifiche"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Annulla
          </Button>
        </div>
      </form>
    </div>
  );
}

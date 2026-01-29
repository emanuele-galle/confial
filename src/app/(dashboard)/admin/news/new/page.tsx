"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AdvancedEditor } from "@/components/editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { FormField } from "@/components/admin/form-field";
import { TemplatePicker } from "@/components/admin/template-picker";
import { createNewsSchema, CreateNewsInput } from "@/lib/schemas/news";
import { toast } from "sonner";
import {
  DocumentDuplicateIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NewsCreatePage() {
  const router = useRouter();
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState("generale");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      coverImage: "",
      featured: false,
      status: "DRAFT",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const content = watch("content");
  const coverImage = watch("coverImage");
  const title = watch("title");
  const excerpt = watch("excerpt");

  const onSubmit = async (data: CreateNewsInput) => {
    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("News creata con successo!");
        router.push("/admin/news");
      } else {
        const error = await response.json();
        toast.error(error.error || "Errore nella creazione della news");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  };

  const handleLoadTemplate = (templateContent: any) => {
    if (templateContent.title) setValue("title", templateContent.title);
    if (templateContent.excerpt) setValue("excerpt", templateContent.excerpt);
    if (templateContent.body) setValue("content", templateContent.body);
    toast.success("Template caricato con successo!");
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Inserisci un nome per il template");
      return;
    }

    try {
      const response = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          description: templateDescription || null,
          category: templateCategory,
          entityType: "news",
          content: {
            title: title || "",
            excerpt: excerpt || "",
            body: content || "",
          },
        }),
      });

      if (response.ok) {
        toast.success("Template salvato con successo!");
        setSaveTemplateOpen(false);
        setTemplateName("");
        setTemplateDescription("");
        setTemplateCategory("generale");
      } else {
        const error = await response.json();
        toast.error(error.error || "Errore nel salvataggio del template");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Crea News</h1>
        <p className="text-gray-600 mt-1">Compila i campi per creare una nuova news</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <FormField label="Titolo" required error={errors.title}>
          <input
            {...register("title")}
            type="text"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
            placeholder="Titolo della news"
          />
        </FormField>

        <FormField label="Estratto" error={errors.excerpt} helperText="Breve descrizione (opzionale)">
          <textarea
            {...register("excerpt")}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
            placeholder="Breve estratto (opzionale)"
          />
        </FormField>

        <FormField label="Immagine di copertina" error={errors.coverImage}>
          <ImageUpload
            value={coverImage || ""}
            onChange={(url) => setValue("coverImage", url)}
            aspectRatio="video"
            folder="news-covers"
          />
        </FormField>

        <FormField label="Contenuto" required error={errors.content}>
          <AdvancedEditor
            content={content}
            onChange={(content) => setValue("content", content)}
            placeholder="Scrivi il contenuto della news..."
          />
        </FormField>

        <div className="flex items-center gap-2">
          <input
            {...register("featured")}
            id="featured"
            type="checkbox"
            className="w-4 h-4 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
          />
          <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
            News in evidenza
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Stato" error={errors.status}>
            <select
              {...register("status")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
            >
              <option value="DRAFT">Bozza</option>
              <option value="PUBLISHED">Pubblicato</option>
            </select>
          </FormField>

          <FormField label="Meta Title (SEO)" error={errors.metaTitle} helperText="Max 60 caratteri">
            <input
              {...register("metaTitle")}
              type="text"
              maxLength={60}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="Titolo SEO"
            />
          </FormField>
        </div>

        <FormField label="Meta Description (SEO)" error={errors.metaDescription} helperText="Max 160 caratteri">
          <textarea
            {...register("metaDescription")}
            maxLength={160}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
            placeholder="Descrizione SEO"
          />
        </FormField>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} size="lg" className="shadow-lg">
            {isSubmitting ? "Salvataggio..." : "Crea News"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setTemplatePickerOpen(true)}
          >
            <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
            Carica da template
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setSaveTemplateOpen(true)}
          >
            <BookmarkIcon className="w-4 h-4 mr-2" />
            Salva come template
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

      {/* Template Picker Dialog */}
      <TemplatePicker
        entityType="news"
        open={templatePickerOpen}
        onOpenChange={setTemplatePickerOpen}
        onSelect={handleLoadTemplate}
      />

      {/* Save Template Dialog */}
      <Dialog open={saveTemplateOpen} onOpenChange={setSaveTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salva come template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome template *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Es. Comunicato stampa standard"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Descrizione (opzionale)
              </label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Breve descrizione del template"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Categoria
              </label>
              <input
                type="text"
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Es. Comunicati stampa"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveTemplate}>Salva template</Button>
              <Button
                variant="outline"
                onClick={() => setSaveTemplateOpen(false)}
              >
                Annulla
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

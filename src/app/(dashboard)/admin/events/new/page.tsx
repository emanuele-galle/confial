"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedEditor } from "@/components/editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { TemplatePicker } from "@/components/admin/template-picker";
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

export default function EventCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState("generale");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    address: "",
    coverImage: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    featured: false,
    registrationOpen: false,
    maxParticipants: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
        eventTime: formData.eventTime || null,
        location: formData.location || null,
        address: formData.address || null,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
      };

      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Evento creato con successo!");
        router.push("/admin/events");
      } else {
        toast.error("Errore nella creazione dell'evento");
      }
    } catch (error) {
      toast.error("Errore di rete");
    } finally {
      setLoading(false);
    }
  }

  const handleLoadTemplate = (templateContent: any) => {
    if (templateContent.title) {
      setFormData({ ...formData, title: templateContent.title });
    }
    if (templateContent.body) {
      setFormData({ ...formData, description: templateContent.body });
    }
    if (templateContent.location) {
      setFormData({ ...formData, location: templateContent.location });
    }
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
          entityType: "events",
          content: {
            title: formData.title || "",
            body: formData.description || "",
            location: formData.location || "",
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Crea Evento</h1>
        <p className="text-gray-600 mt-1">
          Compila i campi per creare un nuovo evento
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-700 text-sm">📝</span>
            </div>
            Informazioni Principali
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titolo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="Titolo dell'evento"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrizione *
            </label>
            <AdvancedEditor
              content={formData.description}
              onChange={(content) =>
                setFormData({ ...formData, description: content })
              }
              placeholder="Descrivi l'evento in dettaglio..."
            />
          </div>

          <ImageUpload
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            aspectRatio="video"
            folder="events-covers"
            label="Immagine di copertina evento"
          />
        </div>

        {/* Date & Location Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-700 text-sm">📍</span>
            </div>
            Data e Luogo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Evento *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ora Evento
              </label>
              <input
                type="time"
                value={formData.eventTime}
                onChange={(e) =>
                  setFormData({ ...formData, eventTime: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Luogo
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="es. Sede CONFIAL, Roma"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Indirizzo Completo
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="Via, Città, CAP"
            />
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-700 text-sm">⚙️</span>
            </div>
            Impostazioni
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stato
              </label>
              <select
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Partecipanti Massimi
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({ ...formData, maxParticipants: e.target.value })
                }
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
                placeholder="Lascia vuoto per illimitato"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
              />
              <div>
                <span className="text-sm font-semibold text-gray-800 block">
                  Evento in evidenza
                </span>
                <span className="text-xs text-gray-500">
                  L'evento apparirà nella homepage
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={formData.registrationOpen}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationOpen: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
              />
              <div>
                <span className="text-sm font-semibold text-gray-800 block">
                  Registrazioni aperte
                </span>
                <span className="text-xs text-gray-500">
                  Gli utenti possono registrarsi all'evento
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} size="lg" className="shadow-lg">
            {loading ? "Creazione..." : "Crea Evento"}
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
        entityType="events"
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
                placeholder="Es. Evento formativo standard"
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
                placeholder="Es. Eventi formativi"
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

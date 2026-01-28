"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { toast } from "sonner";

export default function EventCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    address: "",
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crea Evento</h1>
        <p className="text-gray-600">
          Compila i campi per creare un nuovo evento
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-200">
            Informazioni Principali
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titolo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              placeholder="Titolo dell'evento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione *
            </label>
            <RichTextEditor
              content={formData.description}
              onChange={(content) =>
                setFormData({ ...formData, description: content })
              }
              placeholder="Descrivi l'evento in dettaglio..."
            />
          </div>
        </div>

        {/* Date & Location Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-200">
            Data e Luogo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Evento *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ora Evento
              </label>
              <input
                type="time"
                value={formData.eventTime}
                onChange={(e) =>
                  setFormData({ ...formData, eventTime: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Luogo
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              placeholder="es. Sede CONFIAL, Roma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indirizzo Completo
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              placeholder="Via, Città, CAP"
            />
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 pb-2 border-b border-gray-200">
            Impostazioni
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
              >
                <option value="DRAFT">Bozza</option>
                <option value="PUBLISHED">Pubblicato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Partecipanti Massimi
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({ ...formData, maxParticipants: e.target.value })
                }
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018856] focus:border-[#018856]"
                placeholder="Lascia vuoto per illimitato"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
              />
              <span className="text-sm font-medium text-gray-700">
                Evento in evidenza
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
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
              <span className="text-sm font-medium text-gray-700">
                Registrazioni aperte
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creazione..." : "Crea Evento"}
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

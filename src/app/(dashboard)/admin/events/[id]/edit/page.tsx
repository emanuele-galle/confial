"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdvancedEditor } from "@/components/editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { FileEdit, MapPin, Settings } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string | null;
  location: string | null;
  address: string | null;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  registrationOpen: boolean;
  maxParticipants: number | null;
}

export default function EventEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  async function fetchEvent() {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`);
      if (response.ok) {
        const event: Event = await response.json();
        setFormData({
          title: event.title,
          description: event.description,
          eventDate: new Date(event.eventDate).toISOString().split("T")[0],
          eventTime: event.eventTime || "",
          location: event.location || "",
          address: event.address || "",
          coverImage: event.coverImage || "",
          status: event.status,
          featured: event.featured,
          registrationOpen: event.registrationOpen,
          maxParticipants: event.maxParticipants?.toString() || "",
        });
      } else {
        toast.error("Evento non trovato");
        router.push("/admin/events");
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

      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Evento aggiornato con successo!");
        router.push("/admin/events");
      } else {
        toast.error("Errore nel salvataggio dell'evento");
      }
    } catch (error) {
      toast.error("Errore di rete");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Sei sicuro di voler eliminare questo evento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Evento eliminato con successo!");
        router.push("/admin/events");
      } else {
        toast.error("Errore nell'eliminazione");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Caricamento...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Modifica Evento</h1>
          <p className="text-gray-600 mt-1">Aggiorna i dettagli dell'evento</p>
        </div>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          Elimina Evento
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileEdit className="h-4 w-4 text-emerald-700" />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
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
              <MapPin className="h-4 w-4 text-blue-700" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
              placeholder="Via, Città, CAP"
            />
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-800 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-purple-700" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#018856] focus:border-[#018856] transition-all"
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

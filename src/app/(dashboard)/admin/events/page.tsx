"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";

interface Event {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  location: string | null;
  status: "DRAFT" | "PUBLISHED";
}

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const response = await fetch("/api/admin/events");
      const data = await response.json();
      setEvents(data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Caricamento...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventi</h1>
          <p className="text-gray-600">Gestisci gli eventi del sito</p>
        </div>

        <Link href="/admin/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crea Evento
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nessun evento ancora creato.</p>
            <Link href="/admin/events/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crea il primo evento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  <span
                    className={`flex-shrink-0 ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.status === "PUBLISHED" ? "Pubblicato" : "Bozza"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(event.eventDate).toLocaleDateString("it-IT")}
                  </p>
                  {event.location && (
                    <p className="text-gray-500">{event.location}</p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-[#018856] hover:text-[#016b43] font-medium text-sm"
                  >
                    Modifica →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

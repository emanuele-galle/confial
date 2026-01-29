"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Edit, Trash2, LogIn, LogOut, FileText, Newspaper, Calendar, Users } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
  user: {
    name: string;
  };
}

interface ActivityFeedResponse {
  items: ActivityItem[];
  nextCursor: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function getActionIcon(action: string) {
  switch (action) {
    case "CREATE":
      return Plus;
    case "UPDATE":
      return Edit;
    case "DELETE":
      return Trash2;
    case "LOGIN":
      return LogIn;
    case "LOGOUT":
      return LogOut;
    default:
      return FileText;
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "CREATE":
      return "bg-emerald-100 text-emerald-700";
    case "UPDATE":
      return "bg-blue-100 text-blue-700";
    case "DELETE":
      return "bg-red-100 text-red-700";
    case "LOGIN":
    case "LOGOUT":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getEntityIcon(entityType: string) {
  switch (entityType) {
    case "news":
      return Newspaper;
    case "events":
      return Calendar;
    case "documents":
      return FileText;
    case "users":
      return Users;
    default:
      return FileText;
  }
}

function getEntityLabel(entityType: string) {
  switch (entityType) {
    case "news":
      return "News";
    case "events":
      return "Evento";
    case "documents":
      return "Documento";
    case "users":
      return "Utente";
    default:
      return entityType;
  }
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Ora";
  if (diffMins < 60) return `${diffMins} minuti fa`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "ora" : "ore"} fa`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "giorno" : "giorni"} fa`;

  return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

export function ActivityFeed() {
  const [allItems, setAllItems] = useState<ActivityItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial fetch with 30-second polling
  const { data, error, isLoading } = useSWR<ActivityFeedResponse>(
    "/api/admin/activity-feed?limit=10",
    fetcher,
    {
      refreshInterval: 30000, // Poll every 30 seconds
      onSuccess: (data) => {
        setAllItems(data.items);
        setNextCursor(data.nextCursor);
      },
    }
  );

  async function loadMore() {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetcher(`/api/admin/activity-feed?limit=10&cursor=${nextCursor}`);
      setAllItems([...allItems, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (err) {
      console.error("Failed to load more items:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              Attività Recenti
            </h2>
            <p className="text-sm text-gray-500 mt-1">Aggiornata ogni 30 secondi</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm text-red-600">Errore nel caricamento delle attività</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Nessuna attività recente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

              {/* Activity items */}
              {allItems.map((item, index) => {
                const ActionIcon = getActionIcon(item.action);
                const EntityIcon = getEntityIcon(item.entityType);
                const actionColor = getActionColor(item.action);

                return (
                  <div key={item.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                    {/* Icon badge */}
                    <div className={`relative z-10 w-10 h-10 ${actionColor} rounded-xl flex items-center justify-center shadow-sm`}>
                      <ActionIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.user.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            <span className="capitalize">{item.action.toLowerCase()}</span>{" "}
                            {getEntityLabel(item.entityType)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {getRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      {/* Entity indicator */}
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <EntityIcon className="h-3.5 w-3.5" />
                        <span>{getEntityLabel(item.entityType)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more button */}
            {nextCursor && (
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="w-full py-2.5 px-4 text-sm font-semibold text-[#016030] hover:text-[#014d26] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? "Caricamento..." : "Carica altri"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

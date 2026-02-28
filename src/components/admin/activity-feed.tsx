"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Edit, Trash2, LogIn, LogOut, FileText, Newspaper, Calendar, Users, Activity } from "lucide-react";
import { useIsMounted } from "@/hooks/use-is-mounted";

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

const fetcher = async (url: string) => {
  const res = await fetch(url);

  // Check if response is JSON before parsing
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Invalid response format");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};

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
      return "bg-gradient-to-br from-emerald-500 to-[#018856] text-white shadow-lg shadow-emerald-500/20";
    case "UPDATE":
      return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20";
    case "DELETE":
      return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20";
    case "LOGIN":
      return "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20";
    case "LOGOUT":
      return "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/20";
    default:
      return "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/20";
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

function RelativeTime({ dateString }: { dateString: string }) {
  const mounted = useIsMounted();
  const date = new Date(dateString);

  if (!mounted) {
    // Static fallback during SSR
    return <>{date.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}</>;
  }

  // Client-side: show relative time
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return <>Ora</>;
  if (diffMins < 60) return <>{diffMins} minuti fa</>;
  if (diffHours < 24) return <>{diffHours} {diffHours === 1 ? "ora" : "ore"} fa</>;
  if (diffDays < 7) return <>{diffDays} {diffDays === 1 ? "giorno" : "giorni"} fa</>;

  return <>{date.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}</>;
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
    <div
      className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden group"
      role="feed"
      aria-label="Feed attività recenti"
      aria-live="polite"
    >
      {/* Premium header with gradient accent */}
      <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#018856] via-emerald-400 to-[#018856] opacity-70" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#018856] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              {/* Pulse indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-md" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Attività Recenti
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live • Ogni 30 secondi
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
        {isLoading ? (
          <div className="space-y-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-11 h-11 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-sm text-red-600 font-medium">Errore nel caricamento delle attività</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Nessuna attività recente</p>
            <p className="text-xs text-gray-400 mt-1">Le attività verranno visualizzate qui</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Timeline */}
            <div className="relative">
              {/* Vertical gradient line */}
              <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

              {/* Activity items with staggered entrance animation */}
              {allItems.map((item, index) => {
                const ActionIcon = getActionIcon(item.action);
                const EntityIcon = getEntityIcon(item.entityType);
                const actionColor = getActionColor(item.action);

                return (
                  <div
                    key={item.id}
                    className="relative flex items-start gap-4 pb-5 last:pb-0 group animate-in fade-in slide-in-from-left-3 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                    role="article"
                    aria-label={`${item.user.name} ${item.action.toLowerCase()} ${getEntityLabel(item.entityType)}`}
                  >
                    {/* Icon badge with enhanced styling */}
                    <div className={`relative z-10 w-11 h-11 ${actionColor} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <ActionIcon className="h-5 w-5" />
                    </div>

                    {/* Content with hover effect */}
                    <div className="flex-1 pt-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-[#018856] transition-colors">
                            {item.user.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5 font-medium">
                            <span className="capitalize font-semibold">{item.action.toLowerCase()}</span>{" "}
                            <span className="text-gray-500">{getEntityLabel(item.entityType)}</span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap font-medium bg-gray-100 px-2 py-1 rounded-md flex-shrink-0">
                          <RelativeTime dateString={item.createdAt} />
                        </span>
                      </div>

                      {/* Entity indicator with improved styling */}
                      <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit border border-gray-200/50">
                        <EntityIcon className="h-3.5 w-3.5 text-[#018856]" />
                        <span className="font-semibold">{getEntityLabel(item.entityType)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more button - Premium styling */}
            {nextCursor && (
              <div className="pt-3 border-t border-gray-200 mt-2">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="w-full py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-[#018856] to-emerald-600 hover:from-[#016b43] hover:to-emerald-700 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Caricamento...
                    </span>
                  ) : (
                    "Carica altre attività"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

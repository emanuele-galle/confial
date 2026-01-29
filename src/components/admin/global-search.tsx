"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, File, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchFilters } from "./search-filters";
import type { SearchResult, EntityType } from "@/lib/search";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [took, setTook] = useState(0);

  // Filters state
  const [filters, setFilters] = useState<{
    types: EntityType[];
    status: string;
    dateFrom: string;
    dateTo: string;
  }>({
    types: [],
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  // Debounced search (300ms per SRCH-06)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query });
        if (filters.types.length > 0) params.set("types", filters.types.join(","));
        if (filters.status) params.set("status", filters.status);
        if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.set("dateTo", filters.dateTo);

        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();

        setResults(data.results || []);
        setTotal(data.total || 0);
        setTook(data.took || 0);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Keyboard navigation (SRCH-10)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url);
          onOpenChange(false);
        }
        break;
      case "Escape":
        onOpenChange(false);
        break;
    }
  }, [results, selectedIndex, router, onOpenChange]);

  // Scroll selected item into view
  useEffect(() => {
    const selected = resultsRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Icon for entity type
  const getIcon = (type: EntityType) => {
    switch (type) {
      case "news": return <FileText className="h-4 w-4" />;
      case "events": return <Calendar className="h-4 w-4" />;
      case "documents": return <File className="h-4 w-4" />;
    }
  };

  // Type label in Italian
  const getTypeLabel = (type: EntityType) => {
    switch (type) {
      case "news": return "News";
      case "events": return "Evento";
      case "documents": return "Documento";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Cerca in news, eventi, documenti..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 text-base h-14"
          />
          {loading && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
          {query && !loading && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filters */}
        <SearchFilters filters={filters} onChange={setFilters} />

        {/* Results */}
        <div
          ref={resultsRef}
          className="max-h-[400px] overflow-y-auto"
        >
          {results.length === 0 && query && !loading && (
            <div className="p-8 text-center text-gray-500">
              Nessun risultato per "{query}"
            </div>
          )}

          {results.length > 0 && (
            <>
              {/* Results count and timing */}
              <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">
                {total} risultat{total === 1 ? "o" : "i"} in {took}ms
              </div>

              {/* Result items */}
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  data-index={index}
                  onClick={() => {
                    router.push(result.url);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors",
                    index === selectedIndex && "bg-green-50"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 p-1.5 rounded",
                    result.type === "news" && "bg-blue-100 text-blue-600",
                    result.type === "events" && "bg-purple-100 text-purple-600",
                    result.type === "documents" && "bg-orange-100 text-orange-600"
                  )}>
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {result.title}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                        {getTypeLabel(result.type)}
                      </span>
                      {result.status && (
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          result.status === "PUBLISHED" && "bg-green-100 text-green-700",
                          result.status === "DRAFT" && "bg-yellow-100 text-yellow-700",
                          result.status === "ARCHIVED" && "bg-gray-100 text-gray-600"
                        )}>
                          {result.status === "PUBLISHED" ? "Pubblicato" :
                           result.status === "DRAFT" ? "Bozza" : "Archiviato"}
                        </span>
                      )}
                    </div>
                    {/* Highlighted snippet - render HTML safely since we control ts_headline output */}
                    <p
                      className="text-sm text-gray-600 mt-1 line-clamp-2 [&_mark]:bg-yellow-200 [&_mark]:px-0.5 [&_mark]:rounded"
                      dangerouslySetInnerHTML={{ __html: result.headline }}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(result.date).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="px-4 py-2 border-t bg-gray-50 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↓</kbd>
            navigare
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↵</kbd>
            aprire
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">esc</kbd>
            chiudere
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

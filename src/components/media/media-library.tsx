"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MediaGrid } from "./media-grid";
import { MediaSidebar } from "./media-sidebar";
import { MediaUpload } from "./media-upload";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Media {
  id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  folder?: string | null;
  tags: string[];
  alt?: string | null;
}

interface MediaLibraryProps {
  mode: "dialog" | "page";
  onSelect?: (media: Media) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MediaLibrary({ mode, onSelect, isOpen = true, onClose }: MediaLibraryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Filters state
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Build API URL with filters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "24");

    if (selectedFolder) params.set("folder", selectedFolder);
    if (selectedTags.length > 0) params.set("tag", selectedTags[0]); // API supports single tag for now
    if (searchQuery) params.set("search", searchQuery);

    return `/api/media/list?${params.toString()}`;
  }, [page, selectedFolder, selectedTags, searchQuery]);

  // Fetch media items
  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher);

  // Extract unique folders and tags from all items
  const folders = useMemo(() => {
    if (!data?.items) return [];
    const uniqueFolders = new Set<string>();
    data.items.forEach((item: Media) => {
      if (item.folder) uniqueFolders.add(item.folder);
    });
    return Array.from(uniqueFolders).sort();
  }, [data?.items]);

  const allTags = useMemo(() => {
    if (!data?.items) return [];
    const uniqueTags = new Set<string>();
    data.items.forEach((item: Media) => {
      item.tags.forEach((tag) => uniqueTags.add(tag));
    });
    return Array.from(uniqueTags).sort();
  }, [data?.items]);

  const handleFilterChange = (filters: {
    folder?: string;
    tags: string[];
    search: string;
  }) => {
    setSelectedFolder(filters.folder);
    setSelectedTags(filters.tags);
    setSearchQuery(filters.search);
    setPage(1); // Reset to first page on filter change
  };

  const handleMediaSelect = (media: Media) => {
    setSelectedMedia(media);

    if (mode === "dialog" && onSelect) {
      // In dialog mode, double-click or explicit select triggers onSelect
      onSelect(media);
      if (onClose) onClose();
    }
  };

  const handleUploadComplete = (newMedia: Media[]) => {
    // Refresh the media list
    mutate();
    setUploadDialogOpen(false);
  };

  const content = (
    <div className={mode === "page" ? "flex h-[calc(100vh-4rem)]" : "flex h-[600px]"}>
      {/* Sidebar */}
      <MediaSidebar
        folders={folders}
        tags={allTags}
        selectedFolder={selectedFolder}
        selectedTags={selectedTags}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
      />

      {/* Main content */}
      <div className="flex-1 overflow-hidden p-6">
        {/* Actions bar */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Libreria Media
            </h2>
            <p className="text-sm text-gray-500">
              {data?.total || 0} {data?.total === 1 ? "immagine" : "immagini"}
            </p>
          </div>

          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Carica immagini
          </Button>
        </div>

        {/* Grid */}
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
            Errore nel caricamento dei media. Riprova più tardi.
          </div>
        ) : (
          <MediaGrid
            items={data?.items || []}
            onSelect={handleMediaSelect}
            selectedId={selectedMedia?.id}
            isLoading={isLoading}
          />
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Precedente
            </Button>
            <span className="text-sm text-gray-600">
              Pagina {page} di {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              Successiva
            </Button>
          </div>
        )}
      </div>

      {/* Upload dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Carica nuove immagini</DialogTitle>
          </DialogHeader>
          <MediaUpload
            onUploadComplete={handleUploadComplete}
            folder={selectedFolder}
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  // Wrap in dialog if mode is "dialog"
  if (mode === "dialog" && onClose) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Seleziona un'immagine</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise render as page
  return content;
}

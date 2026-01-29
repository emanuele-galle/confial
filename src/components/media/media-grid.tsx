"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MediaItem } from "./media-item";

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

interface MediaGridProps {
  items: Media[];
  onSelect: (media: Media) => void;
  selectedId?: string;
  isLoading: boolean;
}

export function MediaGrid({
  items,
  onSelect,
  selectedId,
  isLoading,
}: MediaGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Determine columns based on screen size (Tailwind breakpoints)
  // lg: 4 columns, md: 3 columns, sm: 2 columns
  const columns = 4; // Default to lg, responsive handled by CSS

  // Calculate rows
  const rowCount = Math.ceil(items.length / columns);

  // Virtual scrolling
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220, // Thumbnail height (150) + padding + info (70)
    overscan: 5,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-gray-50 p-2"
          >
            <div className="aspect-[4/3] rounded-md bg-gray-200" />
            <div className="mt-2 space-y-2">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Nessun media trovato
        </h3>
        <p className="mb-4 text-gray-500">
          Carica le tue prime immagini per iniziare
        </p>
      </div>
    );
  }

  // Grid with virtual scrolling
  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
      style={{ contain: "strict" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid gap-4 px-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {rowItems.map((item) => (
                <MediaItem
                  key={item.id}
                  media={item}
                  onSelect={onSelect}
                  isSelected={item.id === selectedId}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

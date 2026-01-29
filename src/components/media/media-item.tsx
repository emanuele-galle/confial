"use client";

interface MediaItemProps {
  media: {
    id: string;
    filename: string;
    url: string;
    size: number;
    createdAt: string;
    mimeType: string;
    width?: number | null;
    height?: number | null;
  };
  onSelect: (media: any) => void;
  isSelected: boolean;
}

export function MediaItem({ media, onSelect, isSelected }: MediaItemProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={() => onSelect(media)}
      className={`
        group relative cursor-pointer rounded-lg border bg-white p-2
        transition-all hover:scale-105 hover:shadow-lg
        ${
          isSelected
            ? "ring-2 ring-blue-500 ring-offset-2"
            : "border-gray-200 hover:border-blue-300"
        }
      `}
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
        <img
          src={`/api/media/${media.id}/thumbnail?w=200&h=150`}
          alt={media.filename}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="mt-2 space-y-1">
        <p
          className="truncate text-sm font-medium text-gray-900"
          title={media.filename}
        >
          {media.filename}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatSize(media.size)}</span>
          <span>{formatDate(media.createdAt)}</span>
        </div>
        {media.width && media.height && (
          <p className="text-xs text-gray-400">
            {media.width} × {media.height}
          </p>
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1.5">
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

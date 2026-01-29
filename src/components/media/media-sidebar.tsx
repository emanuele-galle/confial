"use client";

import { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface MediaSidebarProps {
  folders: string[];
  tags: string[];
  selectedFolder?: string;
  selectedTags: string[];
  searchQuery: string;
  onFilterChange: (filters: {
    folder?: string;
    tags: string[];
    search: string;
  }) => void;
}

export function MediaSidebar({
  folders,
  tags,
  selectedFolder,
  selectedTags,
  searchQuery,
  onFilterChange,
}: MediaSidebarProps) {
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [searchValue, setSearchValue] = useState(searchQuery);

  // Debounced search
  const handleSearchChange = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      setSearchValue(value);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onFilterChange({
          folder: selectedFolder,
          tags: selectedTags,
          search: value,
        });
      }, 300);
    };
  }, [selectedFolder, selectedTags, onFilterChange]);

  const handleFolderClick = (folder?: string) => {
    onFilterChange({
      folder,
      tags: selectedTags,
      search: searchQuery,
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    onFilterChange({
      folder: selectedFolder,
      tags: newTags,
      search: searchQuery,
    });
  };

  return (
    <div className="w-64 space-y-4 border-r border-gray-200 bg-gray-50 p-4">
      {/* Search */}
      <div>
        <label className="mb-2 block text-xs font-medium text-gray-700">
          Cerca
        </label>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Nome file o alt text..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Folders */}
      <div>
        <button
          onClick={() => setFoldersExpanded(!foldersExpanded)}
          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900"
        >
          <span>Cartelle</span>
          {foldersExpanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>

        {foldersExpanded && (
          <div className="mt-2 space-y-1">
            {/* All images option */}
            <button
              onClick={() => handleFolderClick(undefined)}
              className={`
                w-full rounded px-3 py-2 text-left text-sm transition-colors
                ${
                  !selectedFolder
                    ? "bg-blue-100 font-medium text-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              Tutte le immagini
            </button>

            {/* Folder list */}
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => handleFolderClick(folder)}
                className={`
                  w-full truncate rounded px-3 py-2 text-left text-sm transition-colors
                  ${
                    selectedFolder === folder
                      ? "bg-blue-100 font-medium text-blue-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                title={folder}
              >
                📁 {folder}
              </button>
            ))}

            {folders.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-500">
                Nessuna cartella
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <button
          onClick={() => setTagsExpanded(!tagsExpanded)}
          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900"
        >
          <span>Tag</span>
          {tagsExpanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>

        {tagsExpanded && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`
                    rounded-full px-3 py-1 text-xs font-medium transition-colors
                    ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  {tag}
                </button>
              );
            })}

            {tags.length === 0 && (
              <p className="px-1 py-2 text-xs text-gray-500">
                Nessun tag disponibile
              </p>
            )}
          </div>
        )}
      </div>

      {/* Active filters summary */}
      {(selectedFolder || selectedTags.length > 0 || searchQuery) && (
        <div className="border-t border-gray-200 pt-4">
          <p className="mb-2 text-xs font-medium text-gray-700">
            Filtri attivi:
          </p>
          <div className="space-y-1 text-xs">
            {selectedFolder && (
              <div className="flex items-center justify-between text-gray-600">
                <span>Cartella: {selectedFolder}</span>
                <button
                  onClick={() => handleFolderClick(undefined)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {selectedTags.length > 0 && (
              <div className="text-gray-600">
                Tag: {selectedTags.join(", ")}
              </div>
            )}
            {searchQuery && (
              <div className="text-gray-600">
                Cerca: "{searchQuery}"
              </div>
            )}
          </div>
          <button
            onClick={() =>
              onFilterChange({ folder: undefined, tags: [], search: "" })
            }
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Rimuovi tutti i filtri
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, FileText, Calendar, File } from "lucide-react";
import type { EntityType } from "@/lib/search";

interface Filters {
  types: EntityType[];
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const toggleType = (type: EntityType) => {
    const types = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types });
  };

  const hasActiveFilters = filters.types.length > 0 || filters.status || filters.dateFrom || filters.dateTo;

  const clearFilters = () => {
    onChange({ types: [], status: "", dateFrom: "", dateTo: "" });
  };

  return (
    <div className="px-4 py-3 border-b bg-gray-50/50 space-y-3">
      {/* Entity type toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 mr-1">Tipo:</span>
        <Button
          size="sm"
          variant={filters.types.includes("news") ? "primary" : "outline"}
          onClick={() => toggleType("news")}
          className="h-7 text-xs gap-1"
        >
          <FileText className="h-3 w-3" />
          News
        </Button>
        <Button
          size="sm"
          variant={filters.types.includes("events") ? "primary" : "outline"}
          onClick={() => toggleType("events")}
          className="h-7 text-xs gap-1"
        >
          <Calendar className="h-3 w-3" />
          Eventi
        </Button>
        <Button
          size="sm"
          variant={filters.types.includes("documents") ? "primary" : "outline"}
          onClick={() => toggleType("documents")}
          className="h-7 text-xs gap-1"
        >
          <File className="h-3 w-3" />
          Documenti
        </Button>
      </div>

      {/* Status and date filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Stato:</span>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              onChange({ ...filters, status: value === "all" ? "" : value })
            }
          >
            <SelectTrigger className="h-7 w-[120px] text-xs">
              <SelectValue placeholder="Tutti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="PUBLISHED">Pubblicato</SelectItem>
              <SelectItem value="DRAFT">Bozza</SelectItem>
              <SelectItem value="ARCHIVED">Archiviato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Dal:</span>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="h-7 w-[130px] text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Al:</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="h-7 w-[130px] text-xs"
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearFilters}
            className="h-7 text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            Cancella filtri
          </Button>
        )}
      </div>

      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.types.map(type => (
            <Badge
              key={type}
              variant="secondary"
              className="text-xs gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => toggleType(type)}
            >
              {type === "news" ? "News" : type === "events" ? "Eventi" : "Documenti"}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.status && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => onChange({ ...filters, status: "" })}
            >
              {filters.status === "PUBLISHED" ? "Pubblicato" :
               filters.status === "DRAFT" ? "Bozza" : "Archiviato"}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => onChange({ ...filters, dateFrom: "", dateTo: "" })}
            >
              {filters.dateFrom || "..."} - {filters.dateTo || "..."}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

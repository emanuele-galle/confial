"use client";

import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  entityType: "news" | "events" | "documents";
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    featured?: string;
  };
}

export function CSVExportButton({ entityType, filters = {} }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Build query params
      const params = new URLSearchParams({
        entityType,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== "")
        ),
      });

      // Trigger download via window.location
      const url = `/api/admin/csv/export?${params.toString()}`;
      window.location.href = url;

      // Reset loading state after a delay (download starts in background)
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      console.error("Export error:", error);
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
      )}
      Esporta CSV
    </Button>
  );
}

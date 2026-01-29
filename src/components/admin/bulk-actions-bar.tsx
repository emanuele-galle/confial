"use client";

import { Trash2, Eye, EyeOff, Archive, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BulkAction {
  label: string;
  icon: React.ReactNode;
  onClick: (ids: string[]) => void;
  variant?: "default" | "destructive";
  requireConfirm?: boolean;
  confirmMessage?: string;
}

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  actions: BulkAction[];
  className?: string;
}

export function BulkActionsBar({
  selectedIds,
  onClearSelection,
  actions,
  className,
}: BulkActionsBarProps) {
  if (selectedIds.length === 0) return null;

  const handleAction = (action: BulkAction) => {
    if (action.requireConfirm) {
      const message =
        action.confirmMessage ||
        `Sei sicuro di voler eseguire questa azione su ${selectedIds.length} elementi?`;
      if (!confirm(message)) return;
    }
    action.onClick(selectedIds);
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-white border border-gray-200 rounded-2xl shadow-2xl",
        "px-6 py-4 flex items-center gap-4",
        "animate-in slide-in-from-bottom-4 duration-300",
        className
      )}
    >
      {/* Count */}
      <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
        <CheckCircle className="h-5 w-5 text-[#018856]" />
        <span className="font-semibold text-gray-900">
          {selectedIds.length} selezionati
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            type="button"
            variant={action.variant === "destructive" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleAction(action)}
            className={cn(
              action.variant === "destructive" &&
                "bg-red-600 hover:bg-red-700 text-white"
            )}
          >
            {action.icon}
            <span className="ml-2">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Clear button */}
      <button
        type="button"
        onClick={onClearSelection}
        className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Deseleziona tutto"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Preset actions for common use cases
export const bulkActions = {
  delete: (onDelete: (ids: string[]) => void): BulkAction => ({
    label: "Elimina",
    icon: <Trash2 className="h-4 w-4" />,
    onClick: onDelete,
    variant: "destructive",
    requireConfirm: true,
    confirmMessage: "Sei sicuro di voler eliminare gli elementi selezionati?",
  }),
  publish: (onPublish: (ids: string[]) => void): BulkAction => ({
    label: "Pubblica",
    icon: <Eye className="h-4 w-4" />,
    onClick: onPublish,
    requireConfirm: true,
    confirmMessage: "Pubblicare gli elementi selezionati?",
  }),
  unpublish: (onUnpublish: (ids: string[]) => void): BulkAction => ({
    label: "Rimuovi pubblicazione",
    icon: <EyeOff className="h-4 w-4" />,
    onClick: onUnpublish,
    requireConfirm: true,
    confirmMessage: "Rimuovere la pubblicazione degli elementi selezionati?",
  }),
  archive: (onArchive: (ids: string[]) => void): BulkAction => ({
    label: "Archivia",
    icon: <Archive className="h-4 w-4" />,
    onClick: onArchive,
    requireConfirm: true,
    confirmMessage: "Archiviare gli elementi selezionati?",
  }),
};

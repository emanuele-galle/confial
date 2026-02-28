"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ContentTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  entityType: string;
  content: Record<string, unknown>;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<"tutti" | "news" | "events">("tutti");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Build API URL based on active tab
  const apiUrl =
    activeTab === "tutti"
      ? "/api/admin/templates"
      : `/api/admin/templates?entityType=${activeTab}`;

  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher);

  const templates: ContentTemplate[] = data?.templates || [];

  const handleDeleteClick = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      const response = await fetch(
        `/api/admin/templates/${templateToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Template eliminato con successo!");
        mutate(); // Refresh the list
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
      } else {
        toast.error("Errore nell'eliminazione del template");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEntityTypeLabel = (entityType: string) => {
    return entityType === "news" ? "News" : "Eventi";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Template Contenuti</h1>
          <p className="text-gray-600 mt-1">
            Gestisci i template riutilizzabili per news ed eventi
          </p>
        </div>
        <Button size="lg" disabled>
          <PlusIcon className="w-5 h-5 mr-2" />
          Nuovo Template
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <button
            onClick={() => setActiveTab("tutti")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "tutti"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tutti ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "news"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "events"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Eventi
          </button>
        </div>

        {/* Templates Table */}
        <div className="mt-6">
          {isLoading && (
            <div className="text-center py-12 text-gray-500">
              Caricamento template...
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-500">
              Errore nel caricamento dei template
            </div>
          )}

          {!isLoading && !error && templates.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Nessun template disponibile</p>
              <p className="text-sm text-gray-400">
                Crea un nuovo contenuto e salvalo come template per riutilizzarlo
              </p>
            </div>
          )}

          {!isLoading && !error && templates.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Nome</th>
                    <th className="pb-3 font-medium">Categoria</th>
                    <th className="pb-3 font-medium">Tipo</th>
                    <th className="pb-3 font-medium">Creato da</th>
                    <th className="pb-3 font-medium">Data creazione</th>
                    <th className="pb-3 font-medium text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr
                      key={template.id}
                      className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {template.name}
                          </p>
                          {template.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {template.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline">{template.category}</Badge>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={
                            template.entityType === "news"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {getEntityTypeLabel(template.entityType)}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {template.creator?.name || "Sistema"}
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {formatDate(template.createdAt)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Modifica template"
                            disabled
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(template.id)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                            title="Elimina template"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Sei sicuro di voler eliminare questo template? Questa azione non
              può essere annullata.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Elimina
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Annulla
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

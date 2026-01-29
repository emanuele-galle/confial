"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TemplateContent {
  title?: string;
  excerpt?: string;
  body: string;
  category?: string;
  location?: string;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  entityType: string;
  content: TemplateContent;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface TemplatePickerProps {
  entityType: "news" | "events";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: TemplateContent) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TemplatePicker({
  entityType,
  open,
  onOpenChange,
  onSelect,
}: TemplatePickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("tutti");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch templates
  const apiUrl = `/api/admin/templates?entityType=${entityType}`;
  const { data, error, isLoading } = useSWR(open ? apiUrl : null, fetcher);

  const templates: ContentTemplate[] = data?.templates || [];

  // Extract unique categories with counts
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();

    templates.forEach((template) => {
      const count = categoryMap.get(template.category) || 0;
      categoryMap.set(template.category, count + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [templates]);

  // Filter templates by category and search
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Category filter
    if (selectedCategory !== "tutti") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [templates, selectedCategory, searchQuery]);

  const handleTemplateClick = (template: ContentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.content);
      onOpenChange(false);
      setSelectedTemplate(null);
      setSelectedCategory("tutti");
      setSearchQuery("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Seleziona un template</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Left Sidebar - Categories */}
          <div className="w-56 flex-shrink-0 space-y-2 overflow-y-auto">
            <h3 className="font-medium text-sm text-gray-700 mb-3">
              Categorie
            </h3>

            <button
              onClick={() => setSelectedCategory("tutti")}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === "tutti"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Tutti</span>
                <span className="text-xs opacity-75">{templates.length}</span>
              </div>
            </button>

            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedCategory === category.name
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{category.name}</span>
                  <span className="text-xs opacity-75">{category.count}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Content - Templates Grid */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search bar */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cerca template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Templates grid */}
            <div className="flex-1 overflow-y-auto">
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

              {!isLoading && !error && filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-2">Nessun template trovato</p>
                  {selectedCategory !== "tutti" && (
                    <button
                      onClick={() => setSelectedCategory("tutti")}
                      className="text-primary hover:underline text-sm"
                    >
                      Mostra tutti i template
                    </button>
                  )}
                </div>
              )}

              {!isLoading && !error && filteredTemplates.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateClick(template)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "hover:border-primary/50 hover:shadow-sm"
                      }`}
                    >
                      <h3 className="font-medium mb-1">{template.name}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {template.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Creato: {formatDate(template.createdAt)}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview panel */}
            {selectedTemplate && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Anteprima</h4>
                  <Button onClick={handleUseTemplate} size="sm">
                    Usa questo template
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  {selectedTemplate.content.title && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Titolo:</p>
                      <p className="font-medium">
                        {selectedTemplate.content.title}
                      </p>
                    </div>
                  )}
                  {selectedTemplate.content.excerpt && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Estratto:</p>
                      <p className="text-sm text-gray-700">
                        {selectedTemplate.content.excerpt}
                      </p>
                    </div>
                  )}
                  {selectedTemplate.content.body && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contenuto:</p>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: selectedTemplate.content.body.substring(
                            0,
                            300
                          ),
                        }}
                      />
                      {selectedTemplate.content.body.length > 300 && (
                        <p className="text-xs text-gray-400 mt-2">
                          ... (anteprima troncata)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

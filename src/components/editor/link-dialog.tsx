"use client";

import { useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LinkDialogProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkDialog({ editor, open, onOpenChange }: LinkDialogProps) {
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [rel, setRel] = useState<string>("noopener noreferrer");

  useEffect(() => {
    if (open) {
      // Pre-populate if editing existing link
      const linkAttrs = editor.getAttributes("link");
      if (linkAttrs.href) {
        setUrl(linkAttrs.href);
        setOpenInNewTab(linkAttrs.target === "_blank");
        setRel(linkAttrs.rel || "noopener noreferrer");
      } else {
        // Reset to defaults for new link
        setUrl("");
        setOpenInNewTab(true);
        setRel("noopener noreferrer");
      }
    }
  }, [open, editor]);

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      // Allow relative URLs and absolute URLs
      if (url.startsWith("/") || url.startsWith("#")) return true;
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    if (!validateUrl(url)) {
      alert("Inserisci un URL valido");
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url,
        target: openInNewTab ? "_blank" : undefined,
        rel: openInNewTab ? rel : undefined,
      })
      .run();

    onOpenChange(false);
  };

  const handleRemove = () => {
    editor.chain().focus().unsetLink().run();
    onOpenChange(false);
  };

  const truncateUrl = (url: string, maxLength: number = 50): string => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const isExistingLink = editor.isActive("link");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isExistingLink ? "Modifica link" : "Inserisci link"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* URL Input */}
          <div className="grid gap-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="text"
              placeholder="https://example.com o /percorso/relativo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-xl"
              autoFocus
            />
            {url && (
              <p className="text-xs text-gray-500">
                Anteprima: {truncateUrl(url)}
              </p>
            )}
          </div>

          {/* Open in new tab */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="newTab"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="w-4 h-4 text-[#018856] border-gray-300 rounded focus:ring-[#018856]"
            />
            <Label htmlFor="newTab" className="cursor-pointer">
              Apri in nuova scheda
            </Label>
          </div>

          {/* Rel attribute */}
          {openInNewTab && (
            <div className="grid gap-2">
              <Label htmlFor="rel">Relazione</Label>
              <Select value={rel} onValueChange={setRel}>
                <SelectTrigger id="rel" className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noopener noreferrer">
                    noopener noreferrer (consigliato)
                  </SelectItem>
                  <SelectItem value="nofollow">nofollow</SelectItem>
                  <SelectItem value="nofollow noopener noreferrer">
                    nofollow noopener noreferrer
                  </SelectItem>
                  <SelectItem value="sponsored">sponsored</SelectItem>
                  <SelectItem value="">Nessuno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isExistingLink && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Rimuovi link
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-[#018856] text-white hover:bg-[#016b43] rounded-lg transition-colors"
          >
            Salva
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

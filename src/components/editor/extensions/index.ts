import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Image } from "@tiptap/extension-image";
import type { Extensions } from "@tiptap/react";

interface EditorExtensionsConfig {
  placeholder?: string;
}

export function getEditorExtensions(
  config: EditorExtensionsConfig = {}
): Extensions {
  const { placeholder = "Inizia a scrivere..." } = config;

  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    Youtube.configure({
      width: 640,
      height: 360,
      allowFullscreen: true,
      HTMLAttributes: {
        class: "youtube-embed",
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "border-collapse table-auto w-full",
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: "border-b border-gray-300",
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: "border border-gray-300 px-3 py-2 min-w-[100px]",
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: "border border-gray-300 px-3 py-2 bg-gray-100 font-semibold",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-[#018856] underline cursor-pointer",
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
    Underline,
    Image.configure({
      HTMLAttributes: {
        class: "max-w-full h-auto rounded-lg",
      },
    }),
  ];
}

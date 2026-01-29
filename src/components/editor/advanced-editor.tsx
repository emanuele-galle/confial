"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Code,
  Undo,
  Redo,
  Table as TableIcon,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getEditorExtensions } from "./extensions";
import { EditorBubbleMenu } from "./bubble-menu";
import { LinkDialog } from "./link-dialog";

export interface AdvancedEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  onImageInsert?: () => void; // Stub for media picker - Plan 02-02
}

export function AdvancedEditor({
  content,
  onChange,
  placeholder = "Inizia a scrivere...",
  className,
  onImageInsert,
}: AdvancedEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: getEditorExtensions({ placeholder }),
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3",
          "prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
          "prose-p:text-gray-700 prose-p:leading-relaxed",
          "prose-a:text-[#018856] prose-a:underline hover:prose-a:text-[#016b43]",
          "prose-strong:text-gray-900 prose-strong:font-semibold",
          "prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
          "prose-blockquote:border-l-4 prose-blockquote:border-[#018856] prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-table:border-collapse prose-th:bg-gray-100 prose-th:font-semibold",
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
      className={cn(
        "p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
        isActive && "bg-[#018856] text-white hover:bg-[#016b43]"
      )}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  const HeadingDropdown = () => (
    <select
      onChange={(e) => {
        const level = parseInt(e.target.value) as 1 | 2 | 3;
        if (level) {
          editor.chain().focus().toggleHeading({ level }).run();
        } else {
          editor.chain().focus().setParagraph().run();
        }
      }}
      value={
        editor.isActive("heading", { level: 1 })
          ? "1"
          : editor.isActive("heading", { level: 2 })
          ? "2"
          : editor.isActive("heading", { level: 3 })
          ? "3"
          : "0"
      }
      className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#018856]"
      title="Stile titolo"
    >
      <option value="0">Paragrafo</option>
      <option value="1">Titolo 1</option>
      <option value="2">Titolo 2</option>
      <option value="3">Titolo 3</option>
    </select>
  );

  const handleYouTubeInsert = () => {
    const url = prompt("Inserisci l'URL del video YouTube:");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const handleTableInsert = () => {
    editor.commands.insertTable({ rows: 3, cols: 3 });
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Grassetto (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Corsivo (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Sottolineato (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Barrato"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <HeadingDropdown />

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Allinea a sinistra"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Allinea al centro"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Allinea a destra"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Giustifica"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Lista puntata"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Lista numerata"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Media */}
        <ToolbarButton
          onClick={() => onImageInsert?.()}
          disabled={!onImageInsert}
          title="Inserisci immagine"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton onClick={handleYouTubeInsert} title="Inserisci video YouTube">
          <Youtube className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton onClick={handleTableInsert} title="Inserisci tabella 3x3">
          <TableIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Utilities */}
        <ToolbarButton
          onClick={() => setLinkDialogOpen(true)}
          isActive={editor.isActive("link")}
          title="Inserisci link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Citazione"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Codice inline"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Annulla (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Ripeti (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Bubble Menu */}
      <EditorBubbleMenu editor={editor} onLinkClick={() => setLinkDialogOpen(true)} />

      {/* Link Dialog */}
      <LinkDialog editor={editor} open={linkDialogOpen} onOpenChange={setLinkDialogOpen} />
    </div>
  );
}

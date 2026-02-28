"use client";
/* eslint-disable react-hooks/static-components -- editor toolbar components */

import { useEffect, useState, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, Link as LinkIcon, Highlighter } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorBubbleMenuProps {
  editor: Editor;
  onLinkClick: () => void;
}

export function EditorBubbleMenu({ editor, onLinkClick }: EditorBubbleMenuProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMenu = () => {
      const { from, to } = editor.state.selection;
      const isTextSelection = from !== to;

      if (!isTextSelection) {
        setShow(false);
        return;
      }

      // Get selection coordinates
      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      // Position menu centered above selection
      const left = (start.left + end.left) / 2;
      const top = start.top - 10;

      setPosition({ top, left });
      setShow(true);
    };

    editor.on("selectionUpdate", updateMenu);
    editor.on("update", updateMenu);

    return () => {
      editor.off("selectionUpdate", updateMenu);
      editor.off("update", updateMenu);
    };
  }, [editor]);

  if (!show) return null;

  const BubbleButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      type="button"
      title={title}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors",
        isActive && "bg-[#018856] text-white hover:bg-[#016b43]"
      )}
    >
      {children}
    </button>
  );

  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg border border-gray-200 rounded-lg p-1 flex gap-1 z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%) translateY(-100%)",
      }}
    >
      <BubbleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Grassetto (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Corsivo (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Sottolineato (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </BubbleButton>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <BubbleButton
        onClick={onLinkClick}
        isActive={editor.isActive("link")}
        title="Inserisci link"
      >
        <LinkIcon className="h-4 w-4" />
      </BubbleButton>

      <BubbleButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive("highlight")}
        title="Evidenzia testo"
      >
        <Highlighter className="h-4 w-4" />
      </BubbleButton>
    </div>
  );
}

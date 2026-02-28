"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SlashCommand } from "./extensions/slash-commands";

interface SlashCommandMenuProps {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
  editor: Record<string, unknown>;
  range: Record<string, unknown>;
  clientRect: () => DOMRect | null;
}

export function SlashCommandMenu({
  items,
  command,
  clientRect,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position menu
  useEffect(() => {
    const rect = clientRect();
    if (!rect || !menuRef.current) return;

    const menu = menuRef.current;
    const menuHeight = menu.offsetHeight;
    const menuWidth = menu.offsetWidth;

    // Position below cursor
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX;

    // Check if menu would overflow viewport bottom
    if (top + menuHeight > window.innerHeight + window.scrollY) {
      // Position above cursor instead
      top = rect.top + window.scrollY - menuHeight - 8;
    }

    // Check if menu would overflow viewport right
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 16;
    }

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  }, [clientRect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
        return true;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        return true;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (items[selectedIndex]) {
          command(items[selectedIndex]);
        }
        return true;
      }

      return false;
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, command]);

  // Scroll selected item into view
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const selectedElement = menu.children[selectedIndex] as HTMLElement;
    if (!selectedElement) return;

    selectedElement.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedIndex]);

  if (items.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white shadow-xl border border-gray-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto w-[280px]"
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            type="button"
            onClick={() => command(item)}
            className={cn(
              "flex items-center gap-3 p-3 w-full text-left hover:bg-gray-100 transition-colors cursor-pointer border-none",
              index === selectedIndex && "bg-gray-100"
            )}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {item.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

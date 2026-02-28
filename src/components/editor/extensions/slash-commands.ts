/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports -- tiptap extension types */
import { Extension, type Editor } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Youtube,
  Table,
  type LucideIcon,
} from "lucide-react";

export interface SlashCommand {
  title: string;
  description: string;
  icon: LucideIcon;
  command: ((editor: any) => void) | "media-picker" | "youtube";
}

const slashCommands: SlashCommand[] = [
  {
    title: "Titolo 1",
    description: "Intestazione principale",
    icon: Heading1,
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Titolo 2",
    description: "Intestazione secondaria",
    icon: Heading2,
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Titolo 3",
    description: "Intestazione terziaria",
    icon: Heading3,
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Lista puntata",
    description: "Crea lista con punti",
    icon: List,
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Lista numerata",
    description: "Crea lista numerata",
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Citazione",
    description: "Blocco citazione",
    icon: Quote,
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Codice",
    description: "Blocco di codice",
    icon: Code,
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Immagine",
    description: "Inserisci da libreria media",
    icon: Image,
    command: "media-picker",
  },
  {
    title: "Video YouTube",
    description: "Incorpora video",
    icon: Youtube,
    command: "youtube",
  },
  {
    title: "Tabella",
    description: "Inserisci tabella 3x3",
    icon: Table,
    command: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
  },
];

interface SlashCommandsOptions {
  onMediaPicker?: () => void;
  onYoutube?: () => void;
}

export const SlashCommands = (options: SlashCommandsOptions = {}) =>
  Extension.create({
    name: "slashCommands",

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          pluginKey: new PluginKey("slashCommands"),
          char: "/",
          startOfLine: false,
          command: ({ editor, range, props }: { editor: Editor; range: any; props: any }) => {
            const command = props.command as SlashCommand["command"];

            // Delete the slash and query text
            editor.chain().focus().deleteRange(range).run();

            // Execute command
            if (typeof command === "function") {
              command(editor);
            } else if (command === "media-picker") {
              options.onMediaPicker?.();
            } else if (command === "youtube") {
              options.onYoutube?.();
            }
          },
          items: ({ query }: { query: string }) => {
            return slashCommands.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                if (!props.clientRect) {
                  return;
                }

                // Import and render React component
                import("../slash-commands").then(({ SlashCommandMenu }) => {
                  const { createRoot } = require("react-dom/client");

                  const element = document.createElement("div");
                  document.body.appendChild(element);

                  popup = element;

                  const root = createRoot(element);
                  component = root;

                  root.render(
                    SlashCommandMenu({
                      items: props.items,
                      command: props.command,
                      editor: props.editor,
                      range: props.range,
                      clientRect: props.clientRect,
                    })
                  );
                });
              },

              onUpdate: (props: any) => {
                if (!component || !props.clientRect) {
                  return;
                }

                import("../slash-commands").then(({ SlashCommandMenu }) => {
                  component.render(
                    SlashCommandMenu({
                      items: props.items,
                      command: props.command,
                      editor: props.editor,
                      range: props.range,
                      clientRect: props.clientRect,
                    })
                  );
                });
              },

              onKeyDown: (props: any) => {
                if (props.event.key === "Escape") {
                  popup?.remove();
                  component = null;
                  popup = null;
                  return true;
                }
                return false;
              },

              onExit: () => {
                if (popup) {
                  popup.remove();
                }
                component = null;
                popup = null;
              },
            };
          },
        }),
      ];
    },
  });

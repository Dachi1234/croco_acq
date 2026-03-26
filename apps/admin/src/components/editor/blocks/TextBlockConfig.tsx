import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  MinusIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Video,
  TableIcon,
} from "lucide-react";
import type { TextBlock } from "@acquisition/shared";
import type { Editor } from "@tiptap/react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Extensions                                                         */
/* ------------------------------------------------------------------ */

const extensions = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: false }),
  Image,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Placeholder.configure({ placeholder: "Start writing…" }),
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Youtube,
];

/* ------------------------------------------------------------------ */
/*  Toolbar button                                                     */
/* ------------------------------------------------------------------ */

function ToolbarButton({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`
        flex h-8 w-8 items-center justify-center rounded-md transition-colors
        ${
          isActive
            ? "bg-[#189541] text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-white/15" />;
}

/* ------------------------------------------------------------------ */
/*  Toolbar                                                            */
/* ------------------------------------------------------------------ */

function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-[#001a24] px-2 py-1.5">
      {/* History */}
      <ToolbarButton
        icon={Undo2}
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        icon={Redo2}
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      />

      <ToolbarDivider />

      {/* Inline formatting */}
      <ToolbarButton
        icon={Bold}
        label="Bold"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={UnderlineIcon}
        label="Underline"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        icon={Strikethrough}
        label="Strikethrough"
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        icon={Code}
        label="Inline code"
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <ToolbarDivider />

      {/* Block types */}
      <ToolbarButton
        icon={Heading2}
        label="Heading 2"
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={Heading3}
        label="Heading 3"
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <ToolbarButton
        icon={List}
        label="Bullet list"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="Ordered list"
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={Quote}
        label="Blockquote"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        icon={AlignLeft}
        label="Align left"
        isActive={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />
      <ToolbarButton
        icon={AlignCenter}
        label="Align center"
        isActive={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />
      <ToolbarButton
        icon={AlignRight}
        label="Align right"
        isActive={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      />

      <ToolbarDivider />

      {/* Insert */}
      <ToolbarButton
        icon={LinkIcon}
        label="Link"
        isActive={editor.isActive("link")}
        onClick={() => {
          const previous = editor.getAttributes("link").href as
            | string
            | undefined;
          const url = window.prompt("URL", previous ?? "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      />
      <ToolbarButton
        icon={ImageIcon}
        label="Image"
        onClick={() => {
          const src = window.prompt("Image URL");
          if (src) editor.chain().focus().setImage({ src }).run();
        }}
      />
      <ToolbarButton
        icon={Video}
        label="YouTube video"
        onClick={() => {
          const src = window.prompt("YouTube URL");
          if (src) editor.chain().focus().setYoutubeVideo({ src }).run();
        }}
      />
      <ToolbarButton
        icon={TableIcon}
        label="Insert table"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      />
      <ToolbarButton
        icon={MinusIcon}
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type TextBlockConfigProps = {
  block: TextBlock;
  onChange: (block: TextBlock) => void;
};

export function TextBlockConfig({ block, onChange }: TextBlockConfigProps) {
  const onChangeRef = useRef(onChange);
  const blockRef = useRef(block);
  onChangeRef.current = onChange;
  blockRef.current = block;

  const editor = useEditor({
    extensions,
    content: block.content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none outline-none min-h-[350px] px-4 py-3 text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current({
        ...blockRef.current,
        content: ed.getHTML(),
      });
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== block.content) {
      editor.commands.setContent(block.content, { emitUpdate: false });
    }
  }, [block.content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="bg-[#0a2a36]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

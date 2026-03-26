import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import type { TextBlock } from "@acquisition/shared";

const toolbarBtn =
  "bg-[#0a2a36] text-white px-2 py-1 rounded text-sm hover:bg-[#189541]";
const toolbarBtnActive = "bg-[#189541]";

const extensions = [
  StarterKit,
  Link.configure({ openOnClick: false }),
  Image,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Youtube,
];

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
        class: "outline-none min-h-[200px]",
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
    <div className="rounded-lg border border-[#072c38] overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-[#072c38] bg-[#072c38]/50 p-2">
        <button
          type="button"
          className={`${toolbarBtn} ${editor.isActive("bold") ? toolbarBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`${toolbarBtn} ${editor.isActive("italic") ? toolbarBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={`${toolbarBtn} ${editor.isActive("heading", { level: 2 }) ? toolbarBtnActive : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          type="button"
          className={`${toolbarBtn} ${editor.isActive("heading", { level: 3 }) ? toolbarBtnActive : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button
          type="button"
          className={`${toolbarBtn} ${editor.isActive("bulletList") ? toolbarBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>
        <button
          type="button"
          className={`${toolbarBtn} ${editor.isActive("orderedList") ? toolbarBtnActive : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Ordered List
        </button>
        <button
          type="button"
          className={`${toolbarBtn} ${editor.isActive("link") ? toolbarBtnActive : ""}`}
          onClick={() => {
            const previous = editor.getAttributes("link").href as
              | string
              | undefined;
            const next = window.prompt("URL", previous ?? "https://");
            if (next === null) return;
            if (next === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: next })
              .run();
          }}
        >
          Link
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => {
            const src = window.prompt("Image URL");
            if (src) editor.chain().focus().setImage({ src }).run();
          }}
        >
          Image
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal Rule
        </button>
      </div>
      <div className="bg-[#0a2a36] p-2">
        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none min-h-[200px]"
        />
      </div>
    </div>
  );
}

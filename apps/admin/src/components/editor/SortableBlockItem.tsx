import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ImageIcon, Type, Columns2, Megaphone } from "lucide-react";
import type { Block } from "@acquisition/shared";
import type { LucideIcon } from "lucide-react";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function blockTypeMeta(type: Block["type"]): { label: string; icon: LucideIcon } {
  switch (type) {
    case "banner":
      return { label: "Banner", icon: ImageIcon };
    case "text":
      return { label: "Text", icon: Type };
    case "two_banner":
      return { label: "Two Banner", icon: Columns2 };
    case "promo_cta":
      return { label: "Promo CTA", icon: Megaphone };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

function blockPreview(block: Block): string {
  switch (block.type) {
    case "banner":
      return block.image
        ? block.image.length > 40
          ? `${block.image.slice(0, 40)}...`
          : block.image
        : "No image";
    case "text": {
      const plain = stripHtml(block.content);
      return plain.length > 80 ? `${plain.slice(0, 80)}...` : plain || "(empty)";
    }
    case "two_banner":
      return `Left + Right`;
    case "promo_cta":
      return block.title || "(no title)";
    default: {
      const _exhaustive: never = block;
      return "";
    }
  }
}

type SortableBlockItemProps = {
  block: Block;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export default function SortableBlockItem({
  block,
  index,
  isSelected,
  onSelect,
  onDelete,
}: SortableBlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(index),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { label, icon: TypeIcon } = blockTypeMeta(block.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl border p-3 transition-colors ${
        isSelected ? "border-[#189541]" : "border-[#072c38]"
      } bg-[#001e28] ${isDragging ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        className="shrink-0 cursor-grab touch-none text-gray-600 transition-colors hover:text-gray-400 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2 text-left focus:outline-none"
      >
        <TypeIcon size={16} className="shrink-0 text-[#189541]" />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium uppercase tracking-wide text-[#189541]">
            {label}
          </span>
          <span className="mt-0.5 block truncate text-sm text-white/80">
            {blockPreview(block)}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 text-gray-600 transition-colors hover:text-red-400"
        aria-label="Delete block"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

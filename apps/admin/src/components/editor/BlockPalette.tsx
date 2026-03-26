import { ImageIcon, Type, Columns2, Megaphone } from "lucide-react";
import type { Block } from "@acquisition/shared";
import type { LucideIcon } from "lucide-react";

const ENTRIES: { type: Block["type"]; label: string; description: string; icon: LucideIcon }[] = [
  { type: "banner", label: "Banner", description: "Full-width image banner", icon: ImageIcon },
  { type: "text", label: "Text", description: "Rich text content", icon: Type },
  { type: "two_banner", label: "Two Banner", description: "Side-by-side image banners", icon: Columns2 },
  { type: "promo_cta", label: "Promo CTA", description: "Promotional call to action", icon: Megaphone },
];

type BlockPaletteProps = {
  onAddBlock: (type: Block["type"]) => void;
};

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <aside className="flex w-full max-w-xs flex-col gap-2 p-4">
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
        ბლოკები
      </h2>
      <ul className="flex flex-col gap-2">
        {ENTRIES.map(({ type, label, description, icon: Icon }) => (
          <li key={type}>
            <button
              type="button"
              onClick={() => onAddBlock(type)}
              className="flex w-full items-center gap-3 rounded-xl border border-[#072c38] bg-[#001e28] p-3 text-left transition-colors hover:border-[#189541] focus:border-[#189541] focus:outline-none"
            >
              <Icon size={20} className="shrink-0 text-[#189541]" />
              <div className="min-w-0">
                <span className="block text-sm font-medium text-white">{label}</span>
                <span className="block text-xs text-gray-500">{description}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

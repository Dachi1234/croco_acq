import { ImageIcon, Type, Columns2, Megaphone, Settings } from "lucide-react";
import type { ReactNode } from "react";
import type {
  BannerBlock,
  Block,
  PromoCTABlock,
  TextBlock,
  TwoBannerBlock,
} from "@acquisition/shared";
import type { LucideIcon } from "lucide-react";
import { ImageUploader } from "@/components/common/ImageUploader";
import { TextBlockConfig } from "./blocks/TextBlockConfig";

const inputClassName =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm text-white/80">{children}</label>;
}

function SectionHeader({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon size={16} className="text-[#189541]" />
      <h3 className="text-sm font-semibold text-white/90">{label}</h3>
    </div>
  );
}

export function BannerBlockConfig({
  block,
  onChange,
}: {
  block: BannerBlock;
  onChange: (b: BannerBlock) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader icon={ImageIcon} label="Banner Settings" />
      <ImageUploader
        label="Image"
        value={block.image}
        onChange={(url) => onChange({ ...block, image: url })}
      />
      <div>
        <FieldLabel>Alt text</FieldLabel>
        <input
          type="text"
          value={block.alt ?? ""}
          onChange={(e) => onChange({ ...block, alt: e.target.value || undefined })}
          className={inputClassName}
        />
      </div>
      <div>
        <FieldLabel>Link (optional)</FieldLabel>
        <input
          type="text"
          value={block.link ?? ""}
          onChange={(e) => onChange({ ...block, link: e.target.value || undefined })}
          className={inputClassName}
        />
      </div>
    </div>
  );
}


function SideFields({
  label,
  side,
  onChange,
}: {
  label: string;
  side: TwoBannerBlock["left"];
  onChange: (side: TwoBannerBlock["left"]) => void;
}) {
  return (
    <fieldset className="rounded-lg border border-[#072c38] p-3">
      <legend className="px-1 text-xs font-medium text-[#189541]">{label}</legend>
      <div className="mt-2 flex flex-col gap-3">
        <ImageUploader
          label="Image"
          value={side.image}
          onChange={(url) => onChange({ ...side, image: url })}
        />
        <div>
          <FieldLabel>Alt text</FieldLabel>
          <input
            type="text"
            value={side.alt ?? ""}
            onChange={(e) => onChange({ ...side, alt: e.target.value || undefined })}
            className={inputClassName}
          />
        </div>
        <div>
          <FieldLabel>Link (optional)</FieldLabel>
          <input
            type="text"
            value={side.link ?? ""}
            onChange={(e) => onChange({ ...side, link: e.target.value || undefined })}
            className={inputClassName}
          />
        </div>
      </div>
    </fieldset>
  );
}

export function TwoBannerBlockConfig({
  block,
  onChange,
}: {
  block: TwoBannerBlock;
  onChange: (b: TwoBannerBlock) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader icon={Columns2} label="Two Banner Settings" />
      <SideFields
        label="Left"
        side={block.left}
        onChange={(left) => onChange({ ...block, left })}
      />
      <SideFields
        label="Right"
        side={block.right}
        onChange={(right) => onChange({ ...block, right })}
      />
    </div>
  );
}

export function PromoCTABlockConfig({
  block,
  onChange,
}: {
  block: PromoCTABlock;
  onChange: (b: PromoCTABlock) => void;
}) {
  const variant = block.variant ?? "default";
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader icon={Megaphone} label="Promo CTA Settings" />
      <ImageUploader
        label="Icon (optional)"
        value={block.icon ?? ""}
        onChange={(url) => onChange({ ...block, icon: url || undefined })}
      />
      <div>
        <FieldLabel>Title</FieldLabel>
        <input
          type="text"
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className={inputClassName}
        />
      </div>
      <div>
        <FieldLabel>Subtitle (optional)</FieldLabel>
        <input
          type="text"
          value={block.subtitle ?? ""}
          onChange={(e) => onChange({ ...block, subtitle: e.target.value || undefined })}
          className={inputClassName}
        />
      </div>
      <div>
        <FieldLabel>Button text</FieldLabel>
        <input
          type="text"
          value={block.button_text}
          onChange={(e) => onChange({ ...block, button_text: e.target.value })}
          className={inputClassName}
        />
      </div>
      <div>
        <FieldLabel>Button link</FieldLabel>
        <input
          type="text"
          value={block.button_link}
          onChange={(e) => onChange({ ...block, button_link: e.target.value })}
          className={inputClassName}
        />
      </div>
      <div>
        <FieldLabel>Variant</FieldLabel>
        <select
          value={variant}
          onChange={(e) =>
            onChange({
              ...block,
              variant: e.target.value as PromoCTABlock["variant"],
            })
          }
          className={inputClassName}
        >
          <option value="default">Default</option>
          <option value="highlight">Highlight</option>
          <option value="compact">Compact</option>
        </select>
      </div>
    </div>
  );
}

type BlockConfigPanelProps = {
  block: Block | null;
  onChange: (updatedBlock: Block) => void;
};

export default function BlockConfigPanel({ block, onChange }: BlockConfigPanelProps) {
  if (!block) {
    return (
      <aside className="flex w-full max-w-md flex-col rounded-lg bg-[#00131a] p-4 text-white">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-white/90">Block settings</h2>
        </div>
        <p className="mt-2 text-sm text-white/50">Select a block to edit</p>
      </aside>
    );
  }

  return (
    <aside className="flex w-full max-w-md flex-col rounded-lg bg-[#00131a] p-4 text-white">
      {block.type === "banner" && (
        <BannerBlockConfig block={block} onChange={onChange} />
      )}
      {block.type === "text" && <TextBlockConfig block={block} onChange={onChange} />}
      {block.type === "two_banner" && (
        <TwoBannerBlockConfig block={block} onChange={onChange} />
      )}
      {block.type === "promo_cta" && (
        <PromoCTABlockConfig block={block} onChange={onChange} />
      )}
    </aside>
  );
}

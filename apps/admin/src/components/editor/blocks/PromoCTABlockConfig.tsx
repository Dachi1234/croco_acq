import type { PromoCTABlock } from "@acquisition/shared";

const inputClass =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

const variants = ["default", "highlight", "compact"] as const;

type PromoCTABlockConfigProps = {
  block: PromoCTABlock;
  onChange: (block: PromoCTABlock) => void;
};

export function PromoCTABlockConfig({
  block,
  onChange,
}: PromoCTABlockConfigProps) {
  const variant = block.variant ?? "default";

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-white/80">Title</label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80">
          Subtitle (optional)
        </label>
        <input
          type="text"
          value={block.subtitle ?? ""}
          onChange={(e) =>
            onChange({ ...block, subtitle: e.target.value || undefined })
          }
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80">Button Text</label>
        <input
          type="text"
          value={block.button_text}
          onChange={(e) => onChange({ ...block, button_text: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80">Button Link</label>
        <input
          type="text"
          value={block.button_link}
          onChange={(e) => onChange({ ...block, button_link: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80">
          Icon URL (optional)
        </label>
        <input
          type="text"
          value={block.icon ?? ""}
          onChange={(e) =>
            onChange({ ...block, icon: e.target.value || undefined })
          }
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80">Variant</label>
        <select
          value={variant}
          onChange={(e) =>
            onChange({
              ...block,
              variant: e.target.value as PromoCTABlock["variant"],
            })
          }
          className={inputClass}
        >
          {variants.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

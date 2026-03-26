import type { BannerBlock } from "@acquisition/shared";

const inputClass =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

type BannerBlockConfigProps = {
  block: BannerBlock;
  onChange: (block: BannerBlock) => void;
};

export function BannerBlockConfig({ block, onChange }: BannerBlockConfigProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-white/80">Image URL</label>
        <input
          type="text"
          value={block.image}
          onChange={(e) => onChange({ ...block, image: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <span className="mb-1 block text-sm text-white/80">Upload</span>
        <div className="rounded-lg border border-dashed border-[#072c38] bg-[#0a2a36]/50 px-3 py-2 text-sm text-white/60">
          Upload Image
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80">Alt text</label>
        <input
          type="text"
          value={block.alt ?? ""}
          onChange={(e) =>
            onChange({ ...block, alt: e.target.value || undefined })
          }
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-white/80">
          Link URL (optional)
        </label>
        <input
          type="text"
          value={block.link ?? ""}
          onChange={(e) =>
            onChange({ ...block, link: e.target.value || undefined })
          }
          className={inputClass}
          placeholder="https://"
        />
      </div>
    </div>
  );
}

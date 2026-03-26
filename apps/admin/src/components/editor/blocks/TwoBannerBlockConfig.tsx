import type { TwoBannerBlock } from "@acquisition/shared";

const inputClass =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

type TwoBannerBlockConfigProps = {
  block: TwoBannerBlock;
  onChange: (block: TwoBannerBlock) => void;
};

export function TwoBannerBlockConfig({
  block,
  onChange,
}: TwoBannerBlockConfigProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Left Banner</h3>
        <div>
          <label className="mb-1 block text-sm text-white/80">Image URL</label>
          <input
            type="text"
            value={block.left.image}
            onChange={(e) =>
              onChange({
                ...block,
                left: { ...block.left, image: e.target.value },
              })
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Alt text</label>
          <input
            type="text"
            value={block.left.alt ?? ""}
            onChange={(e) =>
              onChange({
                ...block,
                left: {
                  ...block.left,
                  alt: e.target.value || undefined,
                },
              })
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
            value={block.left.link ?? ""}
            onChange={(e) =>
              onChange({
                ...block,
                left: {
                  ...block.left,
                  link: e.target.value || undefined,
                },
              })
            }
            className={inputClass}
            placeholder="https://"
          />
        </div>
      </section>
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Right Banner</h3>
        <div>
          <label className="mb-1 block text-sm text-white/80">Image URL</label>
          <input
            type="text"
            value={block.right.image}
            onChange={(e) =>
              onChange({
                ...block,
                right: { ...block.right, image: e.target.value },
              })
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Alt text</label>
          <input
            type="text"
            value={block.right.alt ?? ""}
            onChange={(e) =>
              onChange({
                ...block,
                right: {
                  ...block.right,
                  alt: e.target.value || undefined,
                },
              })
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
            value={block.right.link ?? ""}
            onChange={(e) =>
              onChange({
                ...block,
                right: {
                  ...block.right,
                  link: e.target.value || undefined,
                },
              })
            }
            className={inputClass}
            placeholder="https://"
          />
        </div>
      </section>
    </div>
  );
}

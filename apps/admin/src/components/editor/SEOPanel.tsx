import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

const inputClassName =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

type SEOPanelProps = {
  meta_title: string;
  meta_description: string;
  og_image: string;
  canonical_url: string;
  onChange: (field: string, value: string) => void;
};

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm text-white/80">{children}</label>;
}

export default function SEOPanel({
  meta_title,
  meta_description,
  og_image,
  canonical_url,
  onChange,
}: SEOPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg bg-[#00131a] text-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#072c38] px-4 py-3 text-left text-sm font-semibold text-white/90 transition-colors hover:border-[#189541]"
      >
        <span className="flex items-center gap-2">
          <Search size={16} className="text-[#189541]" />
          SEO
        </span>
        {open ? (
          <ChevronUp size={16} className="text-white/45" />
        ) : (
          <ChevronDown size={16} className="text-white/45" />
        )}
      </button>
      {open && (
        <div className="flex flex-col gap-4 px-4 pb-4 pt-4">
          <div>
            <FieldLabel>Meta Title</FieldLabel>
            <input
              type="text"
              value={meta_title}
              onChange={(e) => onChange("meta_title", e.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <FieldLabel>Meta Description</FieldLabel>
            <textarea
              value={meta_description}
              onChange={(e) => onChange("meta_description", e.target.value)}
              rows={4}
              className={`${inputClassName} resize-y`}
            />
          </div>
          <div>
            <FieldLabel>OG Image</FieldLabel>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={og_image}
                onChange={(e) => onChange("og_image", e.target.value)}
                className={inputClassName}
                placeholder="Image URL"
              />
              <button
                type="button"
                disabled
                className="w-full rounded-lg border border-dashed border-[#072c38] px-3 py-2 text-xs text-white/35"
                title="Upload coming soon"
              >
                Upload (coming soon)
              </button>
            </div>
          </div>
          <div>
            <FieldLabel>Canonical URL</FieldLabel>
            <input
              type="text"
              value={canonical_url}
              onChange={(e) => onChange("canonical_url", e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>
      )}
    </div>
  );
}

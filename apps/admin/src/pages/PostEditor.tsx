import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import BlockPalette from "@/components/editor/BlockPalette";
import BlockCanvas from "@/components/editor/BlockCanvas";
import BlockConfigPanel from "@/components/editor/BlockConfigPanel";
import SEOPanel from "@/components/editor/SEOPanel";
import type { Block } from "@acquisition/shared";
import { LOCALES } from "@acquisition/shared";
import { ImageUploader } from "@/components/common/ImageUploader";

interface PostEditorProps {
  type: "article" | "promotion";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const DEFAULT_BLOCKS: Record<Block["type"], Block> = {
  banner: { type: "banner", image: "", alt: "", link: "" },
  text: { type: "text", content: "<p></p>" },
  two_banner: {
    type: "two_banner",
    left: { image: "", alt: "", link: "" },
    right: { image: "", alt: "", link: "" },
  },
  promo_cta: {
    type: "promo_cta",
    title: "",
    subtitle: "",
    button_text: "",
    button_link: "",
    icon: "",
    variant: "default",
  },
};

export default function PostEditor({ type }: PostEditorProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const isNew = !id;
  const label = type === "article" ? "Article" : "Promotion";
  const basePath = type === "article" ? "/articles" : "/promotions";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const slugTouched = useRef(false);
  const [locale, setLocale] = useState<string>("ka");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    if (!slugTouched.current) {
      setSlug(slugify(newTitle));
    }
  }

  function handleSlugChange(newSlug: string) {
    slugTouched.current = true;
    setSlug(newSlug);
  }

  useEffect(() => {
    if (!id) return;
    api
      .get<any>(`/api/${type}s/${id}`)
      .then((data) => {
        setTitle(data.title);
        setSlug(data.slug);
        slugTouched.current = true;
        setLocale(data.locale || "ka");
        setBlocks(data.blocks || []);
        setCoverImage(data.cover_image || "");
        setExcerpt(data.excerpt || "");
        setMetaTitle(data.meta_title || "");
        setMetaDescription(data.meta_description || "");
        setOgImage(data.og_image || "");
        setCanonicalUrl(data.canonical_url || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddBlock = useCallback((blockType: Block["type"]) => {
    const newBlock = { ...DEFAULT_BLOCKS[blockType] };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockIndex(blocks.length);
  }, [blocks.length]);

  const handleBlockChange = useCallback((updatedBlock: Block) => {
    if (selectedBlockIndex === null) return;
    setBlocks((prev) => prev.map((b, i) => (i === selectedBlockIndex ? updatedBlock : b)));
  }, [selectedBlockIndex]);

  const handleDeleteBlock = useCallback((index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    if (selectedBlockIndex === index) setSelectedBlockIndex(null);
    else if (selectedBlockIndex !== null && selectedBlockIndex > index) {
      setSelectedBlockIndex(selectedBlockIndex - 1);
    }
  }, [selectedBlockIndex]);

  async function handleSave(status: "draft" | "published") {
    const finalSlug = slug || slugify(title);
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!finalSlug) {
      alert("Slug is required — type a title to auto-generate one");
      return;
    }
    setSlug(finalSlug);
    setSaving(true);
    try {
      const body = {
        title,
        slug: finalSlug,
        locale,
        blocks,
        cover_image: coverImage || undefined,
        excerpt: excerpt || undefined,
        meta_title: metaTitle || undefined,
        meta_description: metaDescription || undefined,
        og_image: ogImage || undefined,
        canonical_url: canonicalUrl || undefined,
        status,
      };
      if (isNew) {
        await api.post(`/api/${type}s`, body);
      } else {
        await api.patch(`/api/${type}s/${id}`, body);
      }
      navigate(basePath);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to save: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  const selectedBlock = selectedBlockIndex !== null ? blocks[selectedBlockIndex] : null;

  return (
    <div className="flex flex-col h-full -m-8">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#072c38] bg-[#00131a]">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="bg-[#0a2a36] border border-[#072c38] text-sm text-white rounded-lg px-3 py-1.5 focus:border-[#189541] focus:outline-none"
        >
          {LOCALES.map((l) => (
            <option key={l} value={l}>{l.toUpperCase()}</option>
          ))}
        </select>
        <span className="flex-1" />
        <button
          onClick={() => handleSave("draft")}
          disabled={saving}
          className="bg-[#072c38] hover:bg-[#0d3d4a] disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors cursor-pointer"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave("published")}
          disabled={saving}
          className="bg-[#189541] hover:bg-[#26c159] disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors cursor-pointer"
        >
          Publish
        </button>
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Block Palette */}
        <div className="w-56 border-r border-[#072c38] overflow-y-auto">
          <BlockPalette onAddBlock={handleAddBlock} />
        </div>

        {/* Center: Block Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-[#0a2a36] border border-[#072c38] text-white text-lg font-bold rounded-lg px-3 py-2.5 focus:border-[#189541] focus:outline-none"
                placeholder={`${label} title...`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Slug (auto-generated)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full bg-[#0a2a36] border border-[#072c38] text-sm text-white rounded-lg px-3 py-2 focus:border-[#189541] focus:outline-none"
                placeholder="auto-generated-from-title"
              />
            </div>
            <ImageUploader
              label="Cover Image"
              value={coverImage}
              onChange={setCoverImage}
            />
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 text-sm focus:border-[#189541] focus:outline-none resize-none"
                placeholder="Short description..."
              />
            </div>
          </div>

          <BlockCanvas
            blocks={blocks}
            selectedBlockIndex={selectedBlockIndex}
            onSelectBlock={setSelectedBlockIndex}
            onReorderBlocks={setBlocks}
            onDeleteBlock={handleDeleteBlock}
          />
        </div>

        {/* Right: Config Panel + SEO */}
        <div className="w-80 border-l border-[#072c38] overflow-y-auto">
          <BlockConfigPanel block={selectedBlock} onChange={handleBlockChange} />
          <div className="border-t border-[#072c38]">
            <SEOPanel
              meta_title={metaTitle}
              meta_description={metaDescription}
              og_image={ogImage}
              canonical_url={canonicalUrl}
              onChange={(field, value) => {
                switch (field) {
                  case "meta_title": setMetaTitle(value); break;
                  case "meta_description": setMetaDescription(value); break;
                  case "og_image": setOgImage(value); break;
                  case "canonical_url": setCanonicalUrl(value); break;
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

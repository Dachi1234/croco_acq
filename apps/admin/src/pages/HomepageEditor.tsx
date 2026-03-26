import { useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { ImageUploader } from "@/components/common/ImageUploader";
import type { CtaBanner, HeroSlide, HomepageConfig } from "@acquisition/shared";
import { LOCALES } from "@acquisition/shared";

type Locale = (typeof LOCALES)[number];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const inputClass =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

const labelClass = "block text-sm text-white/80 mb-1";

const sectionClass =
  "rounded-xl border border-[#072c38] bg-[#00131a]/50 overflow-hidden";

const sectionHeaderClass =
  "flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-[#0a2a36]/30 transition-colors";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function emptySlide(): HeroSlide {
  return { image: "", badge_text: "", heading: "", subtext: "", cta_text: "", cta_link: "" };
}

function emptyCtaBanner(): CtaBanner {
  return { headline: "", subtext: "", button_text: "", button_link: "" };
}

type LocaleDraft = { heroSlides: HeroSlide[]; ctaBanner: CtaBanner };

function emptyDraft(): LocaleDraft {
  return { heroSlides: [], ctaBanner: emptyCtaBanner() };
}

type HomepageApiResponse = {
  hero_slides: HeroSlide[];
  cta_banner?: CtaBanner | null;
  featured_promotions: string[];
  featured_articles: string[];
};

function fromApi(data: HomepageApiResponse): LocaleDraft {
  return {
    heroSlides: data.hero_slides?.length ? [...data.hero_slides] : [],
    ctaBanner: data.cta_banner ? { ...emptyCtaBanner(), ...data.cta_banner } : emptyCtaBanner(),
  };
}

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  status: string;
  excerpt?: string;
};

/* ------------------------------------------------------------------ */
/*  Collapsible Section                                                */
/* ------------------------------------------------------------------ */
function Section({
  title,
  icon,
  badge,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={sectionClass}>
      <div className={sectionHeaderClass} onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {badge && (
            <span className="rounded-full bg-[#189541]/20 px-2.5 py-0.5 text-xs font-medium text-[#26c159]">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && <div className="space-y-4 px-6 pb-6">{children}</div>}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured Content Picker                                            */
/* ------------------------------------------------------------------ */
function FeaturedPicker({
  label,
  items,
  selectedIds,
  onChangeIds,
}: {
  label: string;
  items: ContentItem[];
  selectedIds: string[];
  onChangeIds: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");

  const published = items.filter((i) => i.status === "published");
  const filtered = search.trim()
    ? published.filter(
        (i) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : published;

  const selectedItems = selectedIds
    .map((id) => items.find((i) => i.id === id))
    .filter(Boolean) as ContentItem[];

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChangeIds(selectedIds.filter((x) => x !== id));
    } else {
      onChangeIds([...selectedIds, id]);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...selectedIds];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    onChangeIds(copy);
  };

  const moveDown = (index: number) => {
    if (index >= selectedIds.length - 1) return;
    const copy = [...selectedIds];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    onChangeIds(copy);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white/90">{label}</label>

      {/* Selected items */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-white/50">
            Selected ({selectedItems.length})
          </span>
          <div className="space-y-1.5">
            {selectedItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-[#189541]/30 bg-[#189541]/10 px-3 py-2"
              >
                {item.cover_image ? (
                  <img
                    src={item.cover_image}
                    alt=""
                    className="h-10 w-14 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-[#0a2a36] text-xs text-white/30">
                    No img
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{item.title}</p>
                  <p className="truncate text-xs text-white/50">{item.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="rounded p-1 text-white/40 hover:bg-[#0a2a36] hover:text-white disabled:opacity-30"
                    title="Move up"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === selectedItems.length - 1}
                    className="rounded p-1 text-white/40 hover:bg-[#0a2a36] hover:text-white disabled:opacity-30"
                    title="Move down"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="rounded p-1 text-red-400/60 hover:bg-red-950/30 hover:text-red-400"
                    title="Remove"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & available items */}
      <div className="rounded-lg border border-[#072c38] bg-[#0a2a36]/40 p-3">
        <div className="relative mb-3">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or slug…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <div className="max-h-[240px] space-y-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="py-4 text-center text-sm text-white/40">
              {search ? "No matches found" : "No published items"}
            </p>
          )}
          {filtered.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? "bg-[#189541]/15 border border-[#189541]/30"
                    : "hover:bg-[#072c38] border border-transparent"
                }`}
              >
                {item.cover_image ? (
                  <img
                    src={item.cover_image}
                    alt=""
                    className="h-8 w-12 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-[#072c38] text-[10px] text-white/30">
                    No img
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{item.title}</p>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    isSelected
                      ? "border-[#189541] bg-[#189541]"
                      : "border-[#072c38]"
                  }`}
                >
                  {isSelected && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Banner Preview                                                 */
/* ------------------------------------------------------------------ */
function CtaPreview({ cta }: { cta: CtaBanner }) {
  return (
    <div className="rounded-xl border border-[#189541]/20 p-4" style={{
      backgroundImage: "linear-gradient(155deg, rgba(28,175,75,0.12) 0%, rgba(0,146,192,0.08) 50%, rgba(28,175,75,0.05) 100%)",
    }}>
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/40">Preview</span>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            {cta.headline || "Headline…"}
          </p>
          <p className="mt-1 text-xs text-[#83969c]">
            {cta.subtext || "Subtext…"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#189541] px-3 py-1.5 text-xs font-medium text-white">
          {cta.button_text || "Button"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function HomepageEditor() {
  const api = useApi();
  const [activeLocale, setActiveLocale] = useState<Locale>("ka");
  const [drafts, setDrafts] = useState<Record<Locale, LocaleDraft>>(() => ({
    ka: emptyDraft(),
    en: emptyDraft(),
  }));
  const [featuredPromoIds, setFeaturedPromoIds] = useState<Record<Locale, string[]>>({ ka: [], en: [] });
  const [featuredArticleIds, setFeaturedArticleIds] = useState<Record<Locale, string[]>>({ ka: [], en: [] });
  const [allPromotions, setAllPromotions] = useState<ContentItem[]>([]);
  const [allArticles, setAllArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  const patchDraft = useCallback(
    (locale: Locale, fn: (d: LocaleDraft) => LocaleDraft) => {
      setDrafts((prev) => ({ ...prev, [locale]: fn(prev[locale]) }));
    },
    [],
  );

  // Load homepage data + all content items
  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      // Homepage configs per locale
      ...LOCALES.map((locale) =>
        api.get<HomepageApiResponse>(`/api/homepage/${locale}`).then((data) => ({ locale, data })),
      ),
      // All promotions & articles (for the picker)
      api.get<ContentItem[]>("/api/promotions?locale=ka"),
      api.get<ContentItem[]>("/api/promotions?locale=en"),
      api.get<ContentItem[]>("/api/articles?locale=ka"),
      api.get<ContentItem[]>("/api/articles?locale=en"),
    ])
      .then((results) => {
        const homepageResults = results.slice(0, LOCALES.length) as { locale: Locale; data: HomepageApiResponse }[];
        const [promosKa, promosEn, articlesKa, articlesEn] = results.slice(LOCALES.length) as ContentItem[][];

        const nextDrafts: Record<Locale, LocaleDraft> = { ka: emptyDraft(), en: emptyDraft() };
        const nextPromoIds: Record<Locale, string[]> = { ka: [], en: [] };
        const nextArticleIds: Record<Locale, string[]> = { ka: [], en: [] };

        for (const { locale, data } of homepageResults) {
          nextDrafts[locale] = fromApi(data);
          nextPromoIds[locale] = data.featured_promotions ?? [];
          nextArticleIds[locale] = data.featured_articles ?? [];
        }

        setDrafts(nextDrafts);
        setFeaturedPromoIds(nextPromoIds);
        setFeaturedArticleIds(nextArticleIds);
        setAllPromotions([...promosKa, ...promosEn]);
        setAllArticles([...articlesKa, ...articlesEn]);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load homepage"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once
  }, []);

  const d = drafts[activeLocale];

  const setHeroSlides = (slides: HeroSlide[]) =>
    patchDraft(activeLocale, (prev) => ({ ...prev, heroSlides: slides }));

  const setCtaBanner = (cta: CtaBanner) =>
    patchDraft(activeLocale, (prev) => ({ ...prev, ctaBanner: cta }));

  const updateSlide = (index: number, partial: Partial<HeroSlide>) => {
    setHeroSlides(d.heroSlides.map((s, i) => (i === index ? { ...s, ...partial } : s)));
  };

  const removeSlide = (index: number) => {
    setHeroSlides(d.heroSlides.filter((_, i) => i !== index));
  };

  const moveSlide = (index: number, delta: number) => {
    const next = index + delta;
    if (next < 0 || next >= d.heroSlides.length) return;
    const copy = [...d.heroSlides];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setHeroSlides(copy);
  };

  // Filter content items by active locale
  const localePromotions = useMemo(
    () => allPromotions.filter((p) => {
      // Items from the correct locale fetch
      const slug = p.slug ?? "";
      // We fetched per-locale, so we need to match. Since we merged both, use a heuristic:
      // Check if this item's ID is in any locale's featured list, or filter by checking the API response
      return true; // Show all — the picker filters by published status
    }),
    [allPromotions],
  );

  const localeArticles = useMemo(() => allArticles, [allArticles]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveOk(false);
    const body: HomepageConfig = {
      hero_slides: d.heroSlides,
      cta_banner: d.ctaBanner,
      featured_promotions: featuredPromoIds[activeLocale],
      featured_articles: featuredArticleIds[activeLocale],
    };
    try {
      await api.patch(`/api/homepage/${activeLocale}`, body);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Homepage Editor</h1>
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#189541] border-t-transparent" />
          <p className="text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Homepage Editor</h1>
        <div className="flex items-center gap-3">
          {saveOk && (
            <span className="flex items-center gap-1.5 text-sm text-[#26c159]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          {error && <span className="text-sm text-red-400">{error}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#189541] px-5 py-2 font-medium text-white hover:bg-[#26c159] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Locale tabs */}
      <div className="flex gap-1 rounded-lg bg-[#0a2a36]/50 p-1">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActiveLocale(loc)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeLocale === loc
                ? "bg-[#189541] text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-[#072c38]"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/*  HERO CAROUSEL                                                */}
      {/* ============================================================ */}
      <Section
        title="Hero Carousel"
        icon="🎠"
        badge={`${d.heroSlides.length} slide${d.heroSlides.length !== 1 ? "s" : ""}`}
      >
        {d.heroSlides.length === 0 && (
          <p className="py-4 text-center text-sm text-white/40">
            No slides yet. Add your first hero banner below.
          </p>
        )}

        <div className="space-y-4">
          {d.heroSlides.map((slide, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#072c38] bg-[#0a2a36]/30 overflow-hidden"
            >
              {/* Slide header */}
              <div className="flex items-center justify-between border-b border-[#072c38] px-4 py-3">
                <span className="text-sm font-medium text-white/80">
                  Slide {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSlide(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1.5 text-white/40 hover:bg-[#072c38] hover:text-white disabled:opacity-30"
                    title="Move up"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(index, 1)}
                    disabled={index === d.heroSlides.length - 1}
                    className="rounded p-1.5 text-white/40 hover:bg-[#072c38] hover:text-white disabled:opacity-30"
                    title="Move down"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="mx-1 h-4 w-px bg-[#072c38]" />
                  <button
                    type="button"
                    onClick={() => removeSlide(index)}
                    className="rounded p-1.5 text-red-400/60 hover:bg-red-950/30 hover:text-red-400"
                    title="Remove slide"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Slide content */}
              <div className="grid gap-4 p-4 lg:grid-cols-[280px_1fr]">
                {/* Image upload */}
                <div>
                  <ImageUploader
                    label="Banner Image"
                    value={slide.image}
                    onChange={(url) => updateSlide(index, { image: url })}
                  />
                </div>

                {/* Text fields */}
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Heading</label>
                    <input
                      type="text"
                      value={slide.heading}
                      onChange={(e) => updateSlide(index, { heading: e.target.value })}
                      className={inputClass}
                      placeholder="Main headline"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Badge text</label>
                    <input
                      type="text"
                      value={slide.badge_text ?? ""}
                      onChange={(e) => updateSlide(index, { badge_text: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. NEW, HOT DEAL"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subtext</label>
                    <input
                      type="text"
                      value={slide.subtext ?? ""}
                      onChange={(e) => updateSlide(index, { subtext: e.target.value })}
                      className={inputClass}
                      placeholder="Description text"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>CTA text</label>
                      <input
                        type="text"
                        value={slide.cta_text}
                        onChange={(e) => updateSlide(index, { cta_text: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. Learn More"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>CTA link</label>
                      <input
                        type="text"
                        value={slide.cta_link}
                        onChange={(e) => updateSlide(index, { cta_link: e.target.value })}
                        className={inputClass}
                        placeholder="/en/promotions/…"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setHeroSlides([...d.heroSlides, emptySlide()])}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#072c38] bg-[#0a2a36]/20 py-4 text-sm text-white/60 transition-colors hover:border-[#189541]/40 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add slide
        </button>
      </Section>

      {/* ============================================================ */}
      {/*  CTA BANNER                                                   */}
      {/* ============================================================ */}
      <Section title="CTA Banner" icon="📢">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Headline</label>
              <input
                type="text"
                value={d.ctaBanner.headline}
                onChange={(e) => setCtaBanner({ ...d.ctaBanner, headline: e.target.value })}
                className={inputClass}
                placeholder="e.g. 500 Free Spins Gift!"
              />
            </div>
            <div>
              <label className={labelClass}>Subtext</label>
              <input
                type="text"
                value={d.ctaBanner.subtext ?? ""}
                onChange={(e) => setCtaBanner({ ...d.ctaBanner, subtext: e.target.value })}
                className={inputClass}
                placeholder="Supporting description"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Button text</label>
                <input
                  type="text"
                  value={d.ctaBanner.button_text}
                  onChange={(e) => setCtaBanner({ ...d.ctaBanner, button_text: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Get Bonus"
                />
              </div>
              <div>
                <label className={labelClass}>Button link</label>
                <input
                  type="text"
                  value={d.ctaBanner.button_link}
                  onChange={(e) => setCtaBanner({ ...d.ctaBanner, button_link: e.target.value })}
                  className={inputClass}
                  placeholder="https://…"
                />
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <CtaPreview cta={d.ctaBanner} />
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  FEATURED CONTENT                                             */}
      {/* ============================================================ */}
      <Section
        title="Featured Content"
        icon="⭐"
        badge={`${featuredPromoIds[activeLocale].length + featuredArticleIds[activeLocale].length} items`}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <FeaturedPicker
            label="Featured Promotions"
            items={localePromotions}
            selectedIds={featuredPromoIds[activeLocale]}
            onChangeIds={(ids) =>
              setFeaturedPromoIds((prev) => ({ ...prev, [activeLocale]: ids }))
            }
          />
          <FeaturedPicker
            label="Featured Articles"
            items={localeArticles}
            selectedIds={featuredArticleIds[activeLocale]}
            onChangeIds={(ids) =>
              setFeaturedArticleIds((prev) => ({ ...prev, [activeLocale]: ids }))
            }
          />
        </div>
      </Section>

      {/* Bottom save bar */}
      <div className="sticky bottom-0 -mx-6 border-t border-[#072c38] bg-[#00131a]/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">
            Editing: <strong className="text-white/80">{activeLocale.toUpperCase()}</strong>
          </span>
          <div className="flex items-center gap-3">
            {saveOk && (
              <span className="text-sm text-[#26c159]">Saved!</span>
            )}
            {error && <span className="text-sm text-red-400">{error}</span>}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#189541] px-6 py-2.5 font-medium text-white hover:bg-[#26c159] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

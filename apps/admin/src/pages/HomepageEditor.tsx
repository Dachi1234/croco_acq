import { useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import type { CtaBanner, HeroSlide, HomepageConfig } from "@acquisition/shared";
import { LOCALES } from "@acquisition/shared";

type Locale = (typeof LOCALES)[number];

const inputClass =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

const labelClass = "block text-sm text-white/80 mb-1";

const sectionClass = "rounded-xl border border-[#072c38] bg-[#00131a]/50 p-6 space-y-4";

function emptySlide(): HeroSlide {
  return {
    image: "",
    badge_text: "",
    heading: "",
    subtext: "",
    cta_text: "",
    cta_link: "",
  };
}

function emptyCtaBanner(): CtaBanner {
  return {
    headline: "",
    subtext: "",
    button_text: "",
    button_link: "",
  };
}

type LocaleDraft = {
  heroSlides: HeroSlide[];
  ctaBanner: CtaBanner;
};

function emptyDraft(): LocaleDraft {
  return {
    heroSlides: [],
    ctaBanner: emptyCtaBanner(),
  };
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function commaSeparatedToArray(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function filterUuids(ids: string[]): string[] {
  return ids.filter((id) => UUID_RE.test(id));
}

export default function HomepageEditor() {
  const api = useApi();
  const [activeLocale, setActiveLocale] = useState<Locale>("ka");
  const [drafts, setDrafts] = useState<Record<Locale, LocaleDraft>>(() => ({
    ka: emptyDraft(),
    en: emptyDraft(),
  }));
  const [promoText, setPromoText] = useState<Record<Locale, string>>({ ka: "", en: "" });
  const [articleText, setArticleText] = useState<Record<Locale, string>>({ ka: "", en: "" });
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

  const featuredPromotions = useMemo(
    () =>
      ({
        ka: commaSeparatedToArray(promoText.ka),
        en: commaSeparatedToArray(promoText.en),
      }) satisfies Record<Locale, string[]>,
    [promoText],
  );

  const featuredArticles = useMemo(
    () =>
      ({
        ka: commaSeparatedToArray(articleText.ka),
        en: commaSeparatedToArray(articleText.en),
      }) satisfies Record<Locale, string[]>,
    [articleText],
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all(
      LOCALES.map((locale) =>
        api.get<HomepageApiResponse>(`/api/homepage/${locale}`).then((data) => ({ locale, data })),
      ),
    )
      .then((results) => {
        const nextDrafts: Record<Locale, LocaleDraft> = { ka: emptyDraft(), en: emptyDraft() };
        const nextPromo: Record<Locale, string> = { ka: "", en: "" };
        const nextArticle: Record<Locale, string> = { ka: "", en: "" };
        for (const { locale, data } of results) {
          nextDrafts[locale] = fromApi(data);
          nextPromo[locale] = (data.featured_promotions ?? []).join(", ");
          nextArticle[locale] = (data.featured_articles ?? []).join(", ");
        }
        setDrafts(nextDrafts);
        setPromoText(nextPromo);
        setArticleText(nextArticle);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load homepage"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const d = drafts[activeLocale];

  const setHeroSlides = (slides: HeroSlide[]) => patchDraft(activeLocale, (prev) => ({ ...prev, heroSlides: slides }));

  const setCtaBanner = (cta: CtaBanner) => patchDraft(activeLocale, (prev) => ({ ...prev, ctaBanner: cta }));

  const updateSlide = (index: number, partial: Partial<HeroSlide>) => {
    setHeroSlides(
      d.heroSlides.map((s, i) => (i === index ? { ...s, ...partial } : s)),
    );
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

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveOk(false);
    const promos = filterUuids(featuredPromotions[activeLocale]);
    const articles = filterUuids(featuredArticles[activeLocale]);
    const body: HomepageConfig = {
      hero_slides: d.heroSlides,
      cta_banner: d.ctaBanner,
      featured_promotions: promos,
      featured_articles: articles,
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
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Homepage Editor</h1>

      <div className="flex flex-wrap gap-2 border-b border-[#072c38] pb-3">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActiveLocale(loc)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeLocale === loc
                ? "bg-[#189541] text-white"
                : "bg-[#0a2a36] text-white/80 border border-[#072c38] hover:border-[#189541]/50"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {saveOk ? <p className="text-sm text-[#26c159]">Saved.</p> : null}

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-white">Hero carousel</h2>
        <div className="space-y-6">
          {d.heroSlides.length === 0 ? (
            <p className="text-sm text-gray-500">No slides yet. Add one below.</p>
          ) : null}
          {d.heroSlides.map((slide, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-[#072c38] bg-[#0a2a36]/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-white/90">Slide {index + 1}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveSlide(index, -1)}
                    disabled={index === 0}
                    className="rounded border border-[#072c38] px-2 py-1 text-xs text-white hover:border-[#189541] disabled:opacity-40"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(index, 1)}
                    disabled={index === d.heroSlides.length - 1}
                    className="rounded border border-[#072c38] px-2 py-1 text-xs text-white hover:border-[#189541] disabled:opacity-40"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(index)}
                    className="rounded border border-red-900/60 px-2 py-1 text-xs text-red-300 hover:bg-red-950/40"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Background image URL</label>
                <input
                  type="text"
                  value={slide.image}
                  onChange={(e) => updateSlide(index, { image: e.target.value })}
                  className={inputClass}
                  placeholder="https://…"
                />
              </div>
              <div>
                <label className={labelClass}>Badge text</label>
                <input
                  type="text"
                  value={slide.badge_text ?? ""}
                  onChange={(e) => updateSlide(index, { badge_text: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Heading</label>
                <input
                  type="text"
                  value={slide.heading}
                  onChange={(e) => updateSlide(index, { heading: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Subtext</label>
                <input
                  type="text"
                  value={slide.subtext ?? ""}
                  onChange={(e) => updateSlide(index, { subtext: e.target.value })}
                  className={inputClass}
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
                  />
                </div>
                <div>
                  <label className={labelClass}>CTA link</label>
                  <input
                    type="text"
                    value={slide.cta_link}
                    onChange={(e) => updateSlide(index, { cta_link: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setHeroSlides([...d.heroSlides, emptySlide()])}
          className="w-full rounded-lg border border-dashed border-[#072c38] bg-[#0a2a36]/30 py-3 text-sm text-white/90 hover:border-[#189541]/60 hover:bg-[#0a2a36]/50"
        >
          Add slide
        </button>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-white">CTA banner</h2>
        <div>
          <label className={labelClass}>Headline</label>
          <input
            type="text"
            value={d.ctaBanner.headline}
            onChange={(e) => setCtaBanner({ ...d.ctaBanner, headline: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Subtext</label>
          <input
            type="text"
            value={d.ctaBanner.subtext ?? ""}
            onChange={(e) => setCtaBanner({ ...d.ctaBanner, subtext: e.target.value })}
            className={inputClass}
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
            />
          </div>
          <div>
            <label className={labelClass}>Button link</label>
            <input
              type="text"
              value={d.ctaBanner.button_link}
              onChange={(e) => setCtaBanner({ ...d.ctaBanner, button_link: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-white">Featured content</h2>
        <div>
          <label className={labelClass}>Featured promotions (comma-separated promotion IDs)</label>
          <textarea
            value={promoText[activeLocale]}
            onChange={(e) => setPromoText((p) => ({ ...p, [activeLocale]: e.target.value }))}
            rows={3}
            className={`${inputClass} resize-y min-h-[5rem] font-mono text-sm`}
            placeholder="uuid, uuid, …"
          />
        </div>
        <div>
          <label className={labelClass}>Featured articles (comma-separated article IDs)</label>
          <textarea
            value={articleText[activeLocale]}
            onChange={(e) => setArticleText((p) => ({ ...p, [activeLocale]: e.target.value }))}
            rows={3}
            className={`${inputClass} resize-y min-h-[5rem] font-mono text-sm`}
            placeholder="uuid, uuid, …"
          />
        </div>
      </section>

      <div className="flex items-center gap-4 border-t border-[#072c38] pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#189541] px-6 py-2.5 font-medium text-white hover:bg-[#26c159] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <span className="text-sm text-gray-500">Saves locale: {activeLocale}</span>
      </div>
    </div>
  );
}

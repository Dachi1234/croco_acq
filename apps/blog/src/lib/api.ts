// API_INTERNAL_URL is a runtime server-only env var (not inlined by Next.js).
// NEXT_PUBLIC_API_URL is baked at build time — used as fallback for compatibility.
const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchApi<T>(path: string, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`API error ${res.status} for ${path}`);
      if (fallback !== undefined) return fallback;
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error(`Failed to fetch ${path}:`, err);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export async function fetchArticles(locale: string) {
  return fetchApi<any[]>(`/api/articles?locale=${locale}`, []);
}

export async function fetchArticle(slug: string, locale: string) {
  return fetchApi<any | null>(`/api/articles/${slug}?locale=${locale}`, null);
}

export async function fetchPromotions(locale: string) {
  return fetchApi<any[]>(`/api/promotions?locale=${locale}`, []);
}

export async function fetchPromotion(slug: string, locale: string) {
  return fetchApi<any | null>(`/api/promotions/${slug}?locale=${locale}`, null);
}

export async function fetchHomepage(locale: string) {
  return fetchApi<any>(`/api/homepage/${locale}`, {
    hero_slides: [],
    cta_banner: null,
    featured_promotions: [],
    featured_articles: [],
  });
}

export async function fetchSettings() {
  return fetchApi<any>(`/api/settings`, {});
}

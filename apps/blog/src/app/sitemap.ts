import type { MetadataRoute } from "next";
import { LOCALES } from "@acquisition/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crocobet.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  for (const locale of LOCALES) {
    entries.push(
      { url: `${SITE_URL}/${locale}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
      { url: `${SITE_URL}/${locale}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
      { url: `${SITE_URL}/${locale}/promotions`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
      { url: `${SITE_URL}/${locale}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
      { url: `${SITE_URL}/${locale}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    );
  }

  // Dynamic articles
  try {
    for (const locale of LOCALES) {
      const res = await fetch(`${API_URL}/api/articles?locale=${locale}`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const articles: any[] = await res.json();
        for (const article of articles) {
          entries.push({
            url: `${SITE_URL}/${locale}/blog/${article.slug}`,
            lastModified: article.published_at ? new Date(article.published_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  } catch (err) {
    console.error("Sitemap: failed to fetch articles", err);
  }

  // Dynamic promotions
  try {
    for (const locale of LOCALES) {
      const res = await fetch(`${API_URL}/api/promotions?locale=${locale}`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const promotions: any[] = await res.json();
        for (const promo of promotions) {
          entries.push({
            url: `${SITE_URL}/${locale}/promotions/${promo.slug}`,
            lastModified: promo.published_at ? new Date(promo.published_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  } catch (err) {
    console.error("Sitemap: failed to fetch promotions", err);
  }

  return entries;
}

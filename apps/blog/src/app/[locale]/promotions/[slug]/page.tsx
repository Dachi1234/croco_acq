import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { t, LOCALES } from "@/lib/i18n";
import { fetchPromotion, fetchPromotions } from "@/lib/api";
import { BlockRenderer, GTMBlockTracker } from "@/components/blocks";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crocobet.com";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const paramsList: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    const promotions = await fetchPromotions(locale);
    for (const promo of promotions) {
      paramsList.push({ locale, slug: promo.slug });
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const promotion = await fetchPromotion(slug, locale);
  if (!promotion) return { title: "Not Found" };

  const title = promotion.meta_title || promotion.title;
  const description = promotion.meta_description || promotion.excerpt || "";
  const image = promotion.og_image || promotion.cover_image;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/promotions/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: locale === "ka" ? "ka_GE" : "en_US",
      alternateLocale: locale === "ka" ? "en_US" : "ka_GE",
      images: image ? [{ url: image, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function PromotionDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const validLocale = locale as Locale;

  const promotion = await fetchPromotion(slug, validLocale);
  if (!promotion) notFound();

  const allPromotions = await fetchPromotions(validLocale);
  const related = allPromotions
    .filter((p: any) => p.slug !== slug)
    .slice(0, 6);

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: t(validLocale, "home"), url: `${SITE_URL}/${validLocale}` },
    { name: t(validLocale, "promotions"), url: `${SITE_URL}/${validLocale}/promotions` },
    { name: promotion.title, url: `${SITE_URL}/${validLocale}/promotions/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-[1056px] px-4 py-[48px]">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-[24px] flex items-center gap-[8px] text-[12px] text-[#83969c]">
          <Link href={`/${validLocale}/promotions`} className="transition-colors hover:text-white">
            {t(validLocale, "promotions")}
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate text-white">{promotion.title}</span>
        </nav>

        <article>
          {/* Title */}
          <h1 className="mb-[24px] text-[28px] font-medium leading-tight text-white sm:text-[32px] lg:text-[36px]">
            {promotion.title}
          </h1>

          {/* Cover image */}
          {promotion.cover_image && (
            <div className="relative mb-[32px] aspect-video w-full overflow-hidden rounded-[16px]">
              <Image
                src={promotion.cover_image}
                alt={promotion.title}
                fill
                priority
                className="object-contain"
              />
            </div>
          )}

          {/* Content blocks */}
          {promotion.blocks && promotion.blocks.length > 0 && (
            <div className="mb-[32px]">
              <GTMBlockTracker>
                <BlockRenderer blocks={promotion.blocks} locale={validLocale} />
              </GTMBlockTracker>
            </div>
          )}
        </article>

        {/* Related promotions */}
        {related.length > 0 && (
          <section className="border-t border-[#072c38] pt-[32px]">
            <div className="mb-[16px] flex items-center justify-between">
              <h2 className="text-[16px] font-medium leading-[21px] text-white">
                {t(validLocale, "other_promotions")}
              </h2>
              <Link
                href={`/${validLocale}/promotions`}
                className="flex items-center gap-[4px] text-[14px] leading-[15px] text-[#0092c0]"
              >
                {t(validLocale, "view_all")}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3.333 8h9.334M9.333 4.667 12.667 8l-3.334 3.333" stroke="#0092c0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p: any) => (
                <Link
                  key={p.slug}
                  href={`/${validLocale}/promotions/${p.slug}`}
                  className="flex items-start gap-[12px] rounded-[12px] border border-[#072c38] bg-[#001e28] p-3 transition-colors hover:border-[#26c159]"
                >
                  <div className="relative h-[64px] w-[114px] shrink-0 overflow-hidden rounded-[8px] bg-[#0a2a36]">
                    {p.cover_image && (
                      <Image
                        src={p.cover_image}
                        alt={p.title || ""}
                        fill
                        className="object-contain"
                        sizes="114px"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-[4px]">
                    <p className="line-clamp-2 text-[12px] font-medium leading-[16.8px] text-white">
                      {p.title}
                    </p>
                    <span className="flex items-center gap-[4px] text-[10px] text-[#0092c0]">
                      {t(validLocale, "view_full")}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 6h7M6.5 3.5 9 6l-2.5 2.5" stroke="#0092c0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

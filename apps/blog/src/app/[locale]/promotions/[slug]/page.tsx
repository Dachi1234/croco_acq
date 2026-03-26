import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { t, LOCALES } from "@/lib/i18n";
import { fetchPromotion, fetchPromotions } from "@/lib/api";
import { BlockRenderer } from "@/components/blocks";
import { PromotionCard } from "@/components/cards";

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const promotion = await fetchPromotion(slug, locale);
  if (!promotion) return { title: "Not Found" };

  return {
    title: promotion.meta_title || promotion.title,
    description: promotion.meta_description || promotion.excerpt || "",
    openGraph: {
      title: promotion.meta_title || promotion.title,
      description: promotion.meta_description || promotion.excerpt || "",
      images: (promotion.og_image || promotion.cover_image) ? [{ url: promotion.og_image || promotion.cover_image }] : [],
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

  return (
    <div className="mx-auto max-w-[1056px] px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link
          href={`/${validLocale}/promotions`}
          className="transition-colors hover:text-white"
        >
          {t(validLocale, "promotions")}
        </Link>
        <span>/</span>
        <span className="truncate text-gray-400">{promotion.title}</span>
      </nav>

      <h1 className="mb-8 text-center text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
        {promotion.title}
      </h1>

      {promotion.cover_image && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={promotion.cover_image}
            alt={promotion.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {promotion.blocks && promotion.blocks.length > 0 && (
        <div className="mx-auto max-w-[800px]">
          <BlockRenderer blocks={promotion.blocks} />
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-white">
            {t(validLocale, "other_promotions")}
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p: any) => (
              <PromotionCard
                key={p.slug}
                promotion={p}
                locale={validLocale}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

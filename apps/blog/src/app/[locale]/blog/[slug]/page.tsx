import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { t, LOCALES } from "@/lib/i18n";
import { fetchArticle, fetchArticles } from "@/lib/api";
import { BlockRenderer } from "@/components/blocks";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const paramsList: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    const articles = await fetchArticles(locale);
    for (const article of articles) {
      paramsList.push({ locale, slug: article.slug });
    }
  }
  return paramsList;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticle(slug, locale);
  if (!article) return { title: "Not Found" };

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || "",
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || "",
      images: (article.og_image || article.cover_image) ? [{ url: article.og_image || article.cover_image }] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const validLocale = locale as Locale;

  const article = await fetchArticle(slug, validLocale);
  if (!article) notFound();

  const allArticles = await fetchArticles(validLocale);
  const related = allArticles
    .filter((a: any) => a.slug !== slug)
    .slice(0, 6);

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(validLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-[1056px] px-4 py-[48px]">
      {/* Breadcrumb */}
      <nav className="mb-[24px] flex items-center gap-[8px] text-[12px] text-[#83969c]">
        <Link href={`/${validLocale}/blog`} className="transition-colors hover:text-white">
          {t(validLocale, "blog")}
        </Link>
        <span>/</span>
        <span className="truncate text-white">{article.title}</span>
      </nav>

      {/* Published date */}
      {publishedDate && (
        <p className="mb-[12px] text-[12px] text-[#83969c]">
          {publishedDate}
        </p>
      )}

      {/* Title */}
      <h1 className="mb-[24px] text-[28px] font-medium leading-tight text-white sm:text-[32px] lg:text-[36px]">
        {article.title}
      </h1>

      {/* Cover image */}
      {article.cover_image && (
        <div className="relative mb-[32px] aspect-video w-full overflow-hidden rounded-[16px]">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            priority
            className="object-contain"
          />
        </div>
      )}

      {/* Content blocks */}
      {article.blocks && article.blocks.length > 0 && (
        <div className="mb-[32px]">
          <BlockRenderer blocks={article.blocks} locale={validLocale} />
        </div>
      )}

      {/* Related articles — compact thumbnail grid */}
      {related.length > 0 && (
        <section className="border-t border-[#072c38] pt-[32px]">
          <div className="mb-[16px] flex items-center justify-between">
            <h2 className="text-[16px] font-medium leading-[21px] text-white">
              {t(validLocale, "other_articles")}
            </h2>
            <Link
              href={`/${validLocale}/blog`}
              className="flex items-center gap-[4px] text-[14px] leading-[15px] text-[#0092c0]"
            >
              {t(validLocale, "view_all")}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3.333 8h9.334M9.333 4.667 12.667 8l-3.334 3.333" stroke="#0092c0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a: any) => (
              <Link
                key={a.slug}
                href={`/${validLocale}/blog/${a.slug}`}
                className="flex items-start gap-[12px] rounded-[12px] border border-[#072c38] bg-[#001e28] p-3 transition-colors hover:border-[#26c159]"
              >
                {/* Thumbnail */}
                <div className="relative h-[64px] w-[114px] shrink-0 overflow-hidden rounded-[8px] bg-[#0a2a36]">
                  {a.cover_image && (
                    <Image
                      src={a.cover_image}
                      alt={a.title || ""}
                      fill
                      className="object-contain"
                      sizes="114px"
                    />
                  )}
                </div>
                {/* Title + link */}
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-[4px]">
                  <p className="line-clamp-2 text-[12px] font-medium leading-[16.8px] text-white">
                    {a.title}
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
  );
}

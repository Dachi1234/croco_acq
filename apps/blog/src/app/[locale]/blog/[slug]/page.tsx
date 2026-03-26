import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { t, LOCALES } from "@/lib/i18n";
import { fetchArticle, fetchArticles } from "@/lib/api";
import { BlockRenderer } from "@/components/blocks";
import { ArticleCard } from "@/components/cards";

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
    <div className="mx-auto max-w-[1056px] px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link
          href={`/${validLocale}/blog`}
          className="transition-colors hover:text-white"
        >
          {t(validLocale, "blog")}
        </Link>
        <span>/</span>
        <span className="truncate text-gray-400">{article.title}</span>
      </nav>

      {publishedDate && (
        <p className="mb-4 text-center text-sm text-gray-500">
          {publishedDate}
        </p>
      )}

      <h1 className="mb-8 text-center text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
        {article.title}
      </h1>

      {article.cover_image && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {article.blocks && article.blocks.length > 0 && (
        <div className="mx-auto max-w-[800px]">
          <BlockRenderer blocks={article.blocks} />
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-white">
            {t(validLocale, "related_articles")}
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a: any) => (
              <ArticleCard key={a.slug} article={a} locale={validLocale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

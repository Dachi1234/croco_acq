import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { t, LOCALES } from "@/lib/i18n";
import { fetchArticles } from "@/lib/api";
import { ArticleCard } from "@/components/cards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKa = locale === "ka";
  return {
    title: isKa ? "ბლოგი" : "Blog",
    description: isKa
      ? "Crocobet-ის ბლოგი — სიახლეები, გზამკვლევები და ინსაითები."
      : "Crocobet Blog — news, guides and insights.",
    alternates: {
      canonical: `/${locale}/blog`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/blog`])),
    },
    openGraph: {
      title: isKa ? "ბლოგი | Crocobet" : "Blog | Crocobet",
      description: isKa
        ? "სიახლეები, გზამკვლევები და ინსაითები Crocobet-იდან."
        : "News, guides and insights from Crocobet.",
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const articles = await fetchArticles(validLocale);

  return (
    <div className="mx-auto max-w-[1056px] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
        {t(validLocale, "blog")}
      </h1>

      <div className="grid grid-cols-1 items-stretch gap-[16px] md:grid-cols-2 lg:grid-cols-4">
        {articles.map((article: any) => (
          <ArticleCard
            key={article.slug}
            article={article}
            locale={validLocale}
          />
        ))}
      </div>
    </div>
  );
}

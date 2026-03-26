import type { Locale } from "@acquisition/shared";
import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";

function pickCover(article: any): string | null {
  const a = article.cover_image ?? article.coverImage;
  return typeof a === "string" && a.length > 0 ? a : null;
}

function pickPublishedAt(article: any): string | null {
  const a = article.published_at ?? article.publishedAt;
  if (typeof a === "string" && a.length > 0) return a;
  if (a instanceof Date) return a.toISOString();
  return null;
}

function pickSlugTitle(article: any): { slug: string; title: string } {
  const slug = typeof article.slug === "string" ? article.slug : "";
  const title = typeof article.title === "string" ? article.title : "";
  return { slug, title };
}

export function ArticleCard({ article, locale }: { article: any; locale: Locale }) {
  const { slug, title } = pickSlugTitle(article);
  const cover = pickCover(article);
  const publishedRaw = pickPublishedAt(article);
  const excerpt =
    typeof article.excerpt === "string" && article.excerpt.length > 0 ? article.excerpt : null;

  const dateLabel = publishedRaw
    ? new Date(publishedRaw).toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const href = `/${locale}/blog/${slug}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-[#072c38] bg-[#00131a] transition-colors hover:border-[#189541]"
    >
      <div className="relative h-[184px] w-full overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={title || "Article"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="h-full w-full bg-[#0a2a36]" />
        )}
        {dateLabel ? (
          <span className="absolute right-3 top-3 rounded-md bg-[#00131a]/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {dateLabel}
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-[#26c159]">{title}</h2>
        {excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">{excerpt}</p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#26c159] transition-colors group-hover:text-[#189541]">
          {t(locale, "read_more")}
          <span aria-hidden className="translate-x-0 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

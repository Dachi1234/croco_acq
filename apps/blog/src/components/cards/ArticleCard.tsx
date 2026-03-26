import type { Locale } from "@acquisition/shared";
import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";

function pickCover(article: any): string | null {
  const a = article.cover_image ?? article.coverImage;
  return typeof a === "string" && a.length > 0 ? a : null;
}

function pickSlugTitle(article: any): { slug: string; title: string } {
  const slug = typeof article.slug === "string" ? article.slug : "";
  const title = typeof article.title === "string" ? article.title : "";
  return { slug, title };
}

export function ArticleCard({ article, locale }: { article: any; locale: Locale }) {
  const { slug, title } = pickSlugTitle(article);
  const cover = pickCover(article);
  const excerpt =
    typeof article.excerpt === "string" && article.excerpt.length > 0 ? article.excerpt : null;

  const href = `/${locale}/blog/${slug}`;

  return (
    <Link
      href={href}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[#072c38] bg-[#001e28] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.16)]"
    >
      <div className="relative h-[142px] w-full shrink-0 overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={title || "Article"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <div className="h-full w-full bg-[#0a2a36]" />
          )}
      </div>

      <div className="flex flex-1 flex-col gap-[12px] p-[20px]">
        <div className="flex flex-1 flex-col gap-[12px]">
          <h2 className="text-[14px] font-medium leading-[19.6px] text-white">{title}</h2>
          {excerpt ? (
            <p className="overflow-hidden text-ellipsis text-[12px] leading-[19.2px] text-[#83969c]">
              {excerpt}
            </p>
          ) : null}
        </div>
        <span className="flex items-center gap-[4px] text-[12px] font-medium text-[#0092c0]">
          {t(locale, "read_more")}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2.917 7h8.166M7.583 4.083 10.5 7l-2.917 2.917" stroke="#0092c0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

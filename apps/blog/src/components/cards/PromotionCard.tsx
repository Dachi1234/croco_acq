import type { Locale } from "@acquisition/shared";
import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";

function pickCover(promotion: any): string | null {
  const a = promotion.cover_image ?? promotion.coverImage;
  return typeof a === "string" && a.length > 0 ? a : null;
}

function pickSlugTitle(promotion: any): { slug: string; title: string } {
  const slug = typeof promotion.slug === "string" ? promotion.slug : "";
  const title = typeof promotion.title === "string" ? promotion.title : "";
  return { slug, title };
}

export function PromotionCard({ promotion, locale }: { promotion: any; locale: Locale }) {
  const { slug, title } = pickSlugTitle(promotion);
  const cover = pickCover(promotion);
  const excerpt =
    typeof promotion.excerpt === "string" && promotion.excerpt.length > 0 ? promotion.excerpt : null;

  const href = `/${locale}/promotions/${slug}`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#072c38] bg-[#00131a] transition-colors hover:border-[#189541]">
      <Link href={href} className="group block">
        <div className="relative h-[184px] w-full overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={title || "Promotion"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="h-full w-full bg-[#0a2a36]" />
          )}
          <span className="absolute right-3 top-3 rounded-full bg-[#189541] px-3 py-1 text-xs font-semibold text-white">
            {t(locale, "promo")}
          </span>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold leading-snug text-white group-hover:text-[#26c159]">{title}</h2>
          {excerpt ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">{excerpt}</p>
          ) : null}
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link
          href={href}
          className="flex w-full items-center justify-center rounded-full bg-[#189541] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#26c159]"
        >
          {t(locale, "learn_more")}
        </Link>
      </div>
    </div>
  );
}

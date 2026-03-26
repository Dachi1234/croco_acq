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
    <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#072c38] bg-[#001e28]">
      <Link href={href} className="block shrink-0">
        <div className="relative h-[192px] w-full overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={title || "Promotion"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="h-full w-full bg-[#0a2a36]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,26,36,0.7)] via-transparent to-transparent" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-[16px] p-[24px]">
        <div className="flex flex-1 flex-col gap-[12px]">
          <Link href={href}>
            <h2 className="text-[14px] font-medium leading-[19.6px] text-white">{title}</h2>
          </Link>
          {excerpt ? (
            <p className="text-[12px] leading-[19.2px] text-[#83969c]">{excerpt}</p>
          ) : null}
        </div>

        <Link
          href={href}
          className="flex w-full items-center justify-center rounded-[200px] border border-[#26c159] bg-[#189541] px-[16px] py-[10px] text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#26c159]"
        >
          {t(locale, "learn_more")}
        </Link>
      </div>
    </div>
  );
}

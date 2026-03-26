import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface CTABannerProps {
  banner: {
    headline?: string;
    subtext?: string;
    ctaLink?: string;
  };
  locale: Locale;
}

export function CTABanner({ banner, locale }: CTABannerProps) {
  return (
    <section className="rounded-xl bg-[#0a2a36] p-8 text-center sm:p-12">
      {banner.headline && (
        <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
          {banner.headline}
        </h2>
      )}

      {banner.subtext && (
        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-gray-400">
          {banner.subtext}
        </p>
      )}

      <a
        href={banner.ctaLink ?? "#"}
        className="inline-block rounded-lg bg-[#189541] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#26c159]"
      >
        {t(locale, "register")}
      </a>
    </section>
  );
}

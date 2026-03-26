import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { fetchPromotions } from "@/lib/api";
import { PromotionCard } from "@/components/cards";

export default async function PromotionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const promotions = await fetchPromotions(validLocale);

  return (
    <div className="mx-auto max-w-[1056px] px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {t(validLocale, "promotions")}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {t(validLocale, "all_promotions")}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo: any) => (
          <PromotionCard
            key={promo.slug}
            promotion={promo}
            locale={validLocale}
          />
        ))}
      </div>

      <section className="mt-16 rounded-xl bg-[#0a2a36] p-8 text-center sm:p-12">
        <h2 className="mb-3 text-2xl font-bold text-white">
          {t(validLocale, "register")}
        </h2>
        <a
          href="#"
          className="mt-4 inline-block rounded-lg bg-[#189541] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#26c159]"
        >
          {t(validLocale, "register")}
        </a>
      </section>
    </div>
  );
}

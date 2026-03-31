import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { t, LOCALES } from "@/lib/i18n";
import { fetchPromotions } from "@/lib/api";
import { PromotionCard } from "@/components/cards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKa = locale === "ka";
  return {
    title: isKa ? "აქციები" : "Promotions",
    description: isKa
      ? "Crocobet-ის ყველა აქცია — ექსკლუზიური შეთავაზებები და ბონუსები."
      : "All Crocobet promotions — exclusive offers and bonuses.",
    alternates: {
      canonical: `/${locale}/promotions`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/promotions`])),
    },
    openGraph: {
      title: isKa ? "აქციები | Crocobet" : "Promotions | Crocobet",
      description: isKa
        ? "ექსკლუზიური შეთავაზებები და ბონუსები Crocobet-იდან."
        : "Exclusive offers and bonuses from Crocobet.",
      type: "website",
    },
  };
}

export default async function PromotionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const promotions = await fetchPromotions(validLocale);

  return (
    <div className="mx-auto max-w-[1056px] px-4 py-[48px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {t(validLocale, "promotions")}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {t(validLocale, "all_promotions")}
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo: any) => (
          <PromotionCard
            key={promo.slug}
            promotion={promo}
            locale={validLocale}
          />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { t, LOCALES } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKa = locale === "ka";
  return {
    title: isKa ? "კონფიდენციალურობის პოლიტიკა" : "Privacy Policy",
    description: isKa
      ? "Crocobet-ის კონფიდენციალურობის პოლიტიკა."
      : "Crocobet Privacy Policy.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/privacy`])),
    },
    robots: { index: false },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale as Locale;

  return (
    <div className="mx-auto max-w-[1056px] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
        {t(validLocale, "privacy")}
      </h1>

      <div className="space-y-4 text-sm leading-relaxed text-gray-400">
        <p>
          This is a placeholder for the Privacy Policy page. The content will be
          populated with the actual privacy policy text once it is finalized.
        </p>
        <p>
          We are committed to protecting your personal information and your right
          to privacy. If you have any questions or concerns about this policy or
          our practices with regard to your personal information, please contact
          us.
        </p>
        <p>
          This privacy policy applies to all information collected through our
          services, as well as any related services, sales, marketing, or
          events.
        </p>
      </div>
    </div>
  );
}

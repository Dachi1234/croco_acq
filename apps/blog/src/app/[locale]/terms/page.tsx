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
    title: isKa ? "წესები და პირობები" : "Terms & Conditions",
    description: isKa
      ? "Crocobet-ის მომსახურების წესები და პირობები."
      : "Crocobet Terms & Conditions.",
    alternates: {
      canonical: `/${locale}/terms`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/terms`])),
    },
    robots: { index: false },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale as Locale;

  return (
    <div className="mx-auto max-w-[1056px] px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
        {t(validLocale, "terms")}
      </h1>

      <div className="space-y-4 text-sm leading-relaxed text-gray-400">
        <p>
          This is a placeholder for the Terms &amp; Conditions page. The content
          will be populated with the actual terms once they are finalized.
        </p>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by the terms and provisions of this agreement. Please review these
          terms carefully before using our services.
        </p>
        <p>
          We reserve the right to modify these terms at any time without prior
          notice. Your continued use of the site following any changes indicates
          your acceptance of the new terms.
        </p>
      </div>
    </div>
  );
}

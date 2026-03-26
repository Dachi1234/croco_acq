import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

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

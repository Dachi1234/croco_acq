import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { GTMScript, GTMNoScript } from "@/components/GTMScript";
import { GTMPageView } from "@/components/GTMPageView";
import { isValidLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

import "../globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }

  const validLocale: Locale = locale;

  return (
    <html lang={validLocale}>
      <head>
        <GTMScript />
      </head>
      <body>
        <GTMNoScript />
        <GTMPageView />
        <Header locale={validLocale} />
        <main className="pt-14 lg:pt-16">{children}</main>
        <Footer locale={validLocale} />
        <CookieConsent locale={validLocale} />
      </body>
    </html>
  );
}

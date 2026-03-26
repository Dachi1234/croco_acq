import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

function FooterSeparator() {
  return (
    <span
      className="font-footer select-none text-[16px] leading-none text-[#072c38]"
      aria-hidden
    >
      |
    </span>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t-[0.667px] border-[#072c38] bg-[#001e28]">
      <div className="mx-auto hidden max-w-[1232px] flex-row items-center justify-between px-[16px] py-[24.667px] font-footer lg:flex">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="shrink-0" aria-label="Home">
            <Image
              src="/images/footer-logo.svg"
              alt=""
              width={43}
              height={24}
            />
          </Link>
          <p className="text-[10px] leading-none text-[#83969c]">
            {t(locale, "copyright")}
          </p>
        </div>

        <div className="flex items-center gap-[16px]">
          <Link
            href={`/${locale}/privacy`}
            className="text-[10px] text-[#83969c]"
          >
            {t(locale, "privacy")}
          </Link>
          <FooterSeparator />
          <Link
            href={`/${locale}/terms`}
            className="text-[10px] text-[#83969c]"
          >
            {t(locale, "terms")}
          </Link>
          <FooterSeparator />
          <span className="rounded-[4px] border border-[#ff2929] px-[8.667px] py-[2.667px] text-[10px] font-medium text-[#ff2929]">
            18+
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1232px] flex-col items-center gap-[12px] px-[16px] py-[20.667px] font-footer lg:hidden">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${locale}`} className="shrink-0" aria-label="Home">
            <Image
              src="/images/footer-logo.svg"
              alt=""
              width={43}
              height={24}
            />
          </Link>
          <p className="text-center text-[10px] leading-snug text-[#83969c]">
            {t(locale, "copyright")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-[16px]">
          <Link
            href={`/${locale}/privacy`}
            className="text-[10px] text-[#83969c]"
          >
            {t(locale, "privacy")}
          </Link>
          <FooterSeparator />
          <Link
            href={`/${locale}/terms`}
            className="text-[10px] text-[#83969c]"
          >
            {t(locale, "terms")}
          </Link>
          <FooterSeparator />
          <span className="rounded-[4px] border border-[#ff2929] px-[8.667px] py-[2.667px] text-[10px] font-medium text-[#ff2929]">
            18+
          </span>
        </div>
      </div>
    </footer>
  );
}

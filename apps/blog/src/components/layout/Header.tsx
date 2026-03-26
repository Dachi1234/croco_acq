"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Locale } from "@/lib/i18n";

import { HeaderDesktopNav } from "./HeaderDesktopNav";
import { MobileMenu } from "./MobileMenu";

export function Header({ locale }: { locale: Locale }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#072c38] bg-[rgba(0,30,40,0.85)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1056px] items-center justify-between px-[16px] lg:h-[64px] lg:px-0">
        <Link href={`/${locale}`} className="shrink-0" aria-label="Home">
          <Image
            src="/images/mobile-logo.svg"
            alt=""
            width={44}
            height={24}
            className="lg:hidden"
            priority
          />
          <Image
            src="/images/cb-logo.svg"
            alt=""
            width={56}
            height={44}
            className="hidden lg:block"
            priority
          />
        </Link>

        <HeaderDesktopNav locale={locale} />
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
          aria-label="Open menu"
        >
          <Image src="/images/hamburger.svg" alt="" width={24} height={24} className="h-6 w-6" />
        </button>

        <MobileMenu
          locale={locale}
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        />
      </div>
    </header>
  );
}

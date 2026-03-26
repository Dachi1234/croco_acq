"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { HomeIcon, PromoIcon, BlogIcon } from "@/components/icons/NavIcons";

const NAV_LINKS: { key: string; path: string; icon: (props: { className?: string }) => ReactNode }[] = [
  { key: "home", path: "", icon: HomeIcon },
  { key: "promotions", path: "/promotions", icon: PromoIcon },
  { key: "blog", path: "/blog", icon: BlogIcon },
];

export type MobileMenuProps =
  | { locale: Locale }
  | {
      locale: Locale;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    };

function linkActive(pathname: string, locale: string, path: string): boolean {
  const base = `/${locale}`;
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (path === "") {
    return normalized === base;
  }
  return normalized.startsWith(`${base}${path}`);
}

export function MobileMenu(props: MobileMenuProps) {
  const { locale } = props;
  const pathname = usePathname() ?? "";
  const isControlled = "open" in props;
  const onOpenChange = isControlled ? props.onOpenChange : undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const menuOpen = isControlled ? props.open : internalOpen;

  const setMenuOpen = useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (!isControlled) setInternalOpen(next);
    },
    [isControlled, onOpenChange],
  );

  const [panelVisible, setPanelVisible] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      setPanelVisible(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPanelEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }

    setPanelEntered(false);
    const t = window.setTimeout(() => setPanelVisible(false), 300);
    return () => window.clearTimeout(t);
  }, [menuOpen]);

  useEffect(() => {
    if (!panelVisible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [panelVisible]);

  return (
    <>
      {!isControlled ? (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-white"
            aria-label="Open menu"
          >
            <Image src="/images/hamburger.svg" alt="" width={24} height={24} className="h-6 w-6" />
          </button>
        </div>
      ) : null}

      {panelVisible ? (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
              panelEntered ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel — drops down from top */}
          <div
            className={`fixed left-0 right-0 top-0 z-50 transition-transform duration-300 ease-out ${
              panelEntered ? "translate-y-0" : "-translate-y-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex flex-col rounded-bl-[32px] rounded-br-[32px] border-b border-[#072c38] bg-[#001e28] shadow-[0px_12px_48px_0px_rgba(0,0,0,0.6)]">
              {/* Top bar: logo + close */}
              <div className="flex h-[56px] shrink-0 items-center justify-between px-[16px]">
                <Link
                  href={`/${locale}`}
                  onClick={() => setMenuOpen(false)}
                  aria-label={t(locale, "home")}
                >
                  <Image
                    src="/images/mobile-logo.svg"
                    alt=""
                    width={44}
                    height={24}
                    className="h-6 w-[44px]"
                    priority
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex size-[24px] items-center justify-center text-white"
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Nav + register button */}
              <div className="flex flex-col gap-[12px] border-t border-[#072c38] p-[16px]">
                <div className="flex flex-col gap-[8px]">
                  {NAV_LINKS.map(({ key, path, icon: Icon }) => {
                    const active = linkActive(pathname, locale, path);
                    return (
                      <Link
                        key={key}
                        href={`/${locale}${path}`}
                        onClick={() => setMenuOpen(false)}
                        className={`flex w-full items-center gap-[8px] rounded-[8px] ${active ? "bg-[#072c38]" : ""}`}
                      >
                        {/* Left accent bar */}
                        <div className="flex h-[20px] w-[2px] shrink-0 items-center justify-center">
                          <div className={`h-[20px] w-[2px] rounded-full ${active ? "bg-[#1caf4b]" : "bg-transparent"}`} />
                        </div>
                        {/* Icon + label */}
                        <div className={`flex h-[40px] items-center gap-[4px] ${active ? "" : "opacity-[0.64]"}`}>
                          <Icon className="size-5 shrink-0 text-current" />
                          <span className={`text-[14px] font-medium leading-[20px] ${active ? "text-[#26c159]" : "text-white"}`}>
                            {t(locale, key)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-[6px] rounded-[200px] border border-[#26c159] bg-[#189541] px-[16px] py-[10px] text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#26c159]"
                >
                  {t(locale, "register")}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

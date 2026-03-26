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
        <div
          className={`fixed inset-0 z-50 flex flex-col bg-[#001a24] transition-[transform,opacity] duration-300 ease-out lg:hidden ${
            panelEntered ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-14 shrink-0 items-center justify-between px-[16px]">
            <Link
              href={`/${locale}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center"
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
              className="flex h-10 w-10 items-center justify-center text-white"
              aria-label="Close menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-[8px] px-[24px] pt-[16px]">
            {NAV_LINKS.map(({ key, path, icon: Icon }) => {
              const active = linkActive(pathname, locale, path);
              return (
                <Link
                  key={key}
                  href={`/${locale}${path}`}
                  onClick={() => setMenuOpen(false)}
                  className={
                    active
                      ? "flex items-center gap-[12px] rounded-[12px] border-l-[3px] border-[#189541] bg-[rgba(28,175,75,0.1)] py-[14px] px-[20px]"
                      : "flex items-center gap-[12px] rounded-[12px] border-l-[3px] border-transparent py-[14px] px-[20px] text-white/[0.64]"
                  }
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#189541]" : "text-current"}`} />
                  <span
                    className={`text-[16px] font-medium ${active ? "text-[#189541]" : ""}`}
                  >
                    {t(locale, key)}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mx-[24px] mt-[24px] w-[calc(100%-48px)]">
            <a
              href="#"
              className="block w-full rounded-[200px] border border-[#26c159] bg-[#189541] py-[14px] text-center text-[16px] font-medium text-white"
            >
              {t(locale, "register")}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

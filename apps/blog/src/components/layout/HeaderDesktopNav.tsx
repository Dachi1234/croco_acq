"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { HomeIcon, PromoIcon, BlogIcon } from "@/components/icons/NavIcons";

const NAV_LINKS: { key: string; path: string; icon: (props: { className?: string }) => ReactNode }[] = [
  { key: "home", path: "", icon: HomeIcon },
  { key: "promotions", path: "/promotions", icon: PromoIcon },
  { key: "blog", path: "/blog", icon: BlogIcon },
];

function linkActive(pathname: string, locale: string, path: string): boolean {
  const base = `/${locale}`;
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (path === "") return normalized === base;
  return normalized.startsWith(`${base}${path}`);
}

export function HeaderDesktopNav({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="hidden items-center gap-[32px] lg:flex">
      <nav
        className="flex items-end gap-[24px] text-[14px] leading-5 text-white"
        aria-label="Main"
      >
        {NAV_LINKS.map(({ key, path, icon: Icon }) => {
          const href = path === "" ? `/${locale}` : `/${locale}${path}`;
          const active = linkActive(pathname, locale, path);
          return (
            <Link
              key={key}
              href={href}
              className="flex flex-col items-center"
            >
              <span
                className={`flex h-[32px] items-center gap-[6px] font-medium transition-opacity ${active ? "text-[#26c159] opacity-100" : "text-white opacity-[0.64]"}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{t(locale, key)}</span>
              </span>
              <span
                className="mt-0 h-[2px] w-5 shrink-0 rounded-full bg-[#1caf4b] transition-opacity"
                style={{ opacity: active ? 1 : 0 }}
                aria-hidden
              />
            </Link>
          );
        })}
      </nav>

      <a
        href="#"
        className="rounded-[200px] border border-[#26c159] bg-[#189541] px-[16px] py-[8px] text-[14px] font-medium text-white"
      >
        {t(locale, "register")}
      </a>
    </div>
  );
}

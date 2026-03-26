"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function handleChoice(choice: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#072c38] bg-[#00131a] px-4 py-4">
      <div className="mx-auto flex max-w-[1056px] flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-300">
          {t(locale, "cookie_message")}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-lg bg-[#189541] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#26c159]"
          >
            {t(locale, "accept")}
          </button>
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="rounded-lg border border-[#072c38] px-5 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
          >
            {t(locale, "decline")}
          </button>
        </div>
      </div>
    </div>
  );
}

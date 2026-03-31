"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { GTM_EVENTS, GTM_PROPERTIES } from "@acquisition/shared";

function push(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

/**
 * Thin client wrapper around server-rendered block content.
 * Reads data-* attributes from the DOM to fire GTM events
 * without converting block components to client components.
 */
export function GTMBlockTracker({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const impressedRef = useRef<Set<string>>(new Set());
  const scrollFiredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // --- Banner & CTA impression tracking via IntersectionObserver ---
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const pos = el.dataset.blockPosition;
          const type = el.dataset.blockType;
          if (!pos || !type) continue;

          const key = `${type}-${pos}`;
          if (impressedRef.current.has(key)) continue;
          impressedRef.current.add(key);

          if (type === "banner" || type === "two_banner") {
            push({
              event: GTM_EVENTS.BANNER_IMPRESSION,
              [GTM_PROPERTIES.BLOCK_POSITION]: Number(pos),
            });
          }
        }
      },
      { threshold: 0.5 },
    );

    const blocks = container.querySelectorAll<HTMLElement>("[data-block-type]");
    blocks.forEach((block) => observer.observe(block));

    // --- Click tracking via event delegation ---
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // CTA click: look for data-cta-label on nearest ancestor <a>
      const ctaLink = target.closest<HTMLAnchorElement>("a[data-cta-label]");
      if (ctaLink) {
        const block = ctaLink.closest<HTMLElement>("[data-block-position]");
        push({
          event: GTM_EVENTS.CTA_CLICK,
          [GTM_PROPERTIES.LABEL]: ctaLink.dataset.ctaLabel ?? "",
          [GTM_PROPERTIES.DESTINATION]: ctaLink.dataset.ctaDest ?? "",
          [GTM_PROPERTIES.BLOCK_POSITION]: Number(block?.dataset.blockPosition ?? 0),
        });
        return;
      }

      // Banner click: look for nearest banner/two_banner block with a link
      const bannerLink = target.closest<HTMLAnchorElement>(
        '[data-block-type="banner"] a, [data-block-type="two_banner"] a, a[data-block-type="banner"]',
      );
      if (bannerLink) {
        const block = bannerLink.closest<HTMLElement>("[data-block-position]") ?? bannerLink;
        const slot = bannerLink.closest<HTMLElement>("[data-slot]")?.dataset.slot as
          | "left"
          | "right"
          | undefined;
        push({
          event: GTM_EVENTS.BANNER_CLICK,
          [GTM_PROPERTIES.BLOCK_POSITION]: Number(block.dataset.blockPosition ?? 0),
          ...(slot ? { [GTM_PROPERTIES.SLOT]: slot } : {}),
        });
      }
    }

    container.addEventListener("click", handleClick);

    // --- Scroll depth tracking ---
    const DEPTH_THRESHOLDS = [25, 50, 75, 100];

    function handleScroll() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.scrollHeight;
      if (containerHeight === 0) return;

      const viewportBottom = window.innerHeight;
      const scrolled = viewportBottom - rect.top;
      const pct = Math.min(100, Math.round((scrolled / containerHeight) * 100));

      const blocks = container.querySelectorAll<HTMLElement>("[data-block-position]");
      const lastVisiblePos =
        Array.from(blocks).reduce((last, block) => {
          const r = block.getBoundingClientRect();
          return r.top < viewportBottom ? Math.max(last, Number(block.dataset.blockPosition ?? 0)) : last;
        }, -1);

      for (const threshold of DEPTH_THRESHOLDS) {
        if (pct >= threshold && !scrollFiredRef.current.has(String(threshold))) {
          scrollFiredRef.current.add(String(threshold));
          push({
            event: GTM_EVENTS.SCROLL_DEPTH,
            [GTM_PROPERTIES.DEPTH]: threshold,
            [GTM_PROPERTIES.BLOCK_POSITION]: lastVisiblePos >= 0 ? lastVisiblePos : 0,
          });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      container.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}

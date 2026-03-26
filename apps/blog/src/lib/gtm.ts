"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { GTM_EVENTS, GTM_PROPERTIES } from "@acquisition/shared";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

function pushToDataLayer(data: Record<string, any>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export function useGTM() {
  const pathname = usePathname();

  useEffect(() => {
    pushToDataLayer({
      event: GTM_EVENTS.PAGE_VIEW,
      page_path: pathname,
    });
  }, [pathname]);

  const trackBannerImpression = useCallback((position: number) => {
    pushToDataLayer({
      event: GTM_EVENTS.BANNER_IMPRESSION,
      [GTM_PROPERTIES.BLOCK_POSITION]: position,
    });
  }, []);

  const trackBannerClick = useCallback((position: number, slot?: "left" | "right") => {
    pushToDataLayer({
      event: GTM_EVENTS.BANNER_CLICK,
      [GTM_PROPERTIES.BLOCK_POSITION]: position,
      ...(slot ? { [GTM_PROPERTIES.SLOT]: slot } : {}),
    });
  }, []);

  const trackCTAClick = useCallback((params: { label: string; destination: string; position: number }) => {
    pushToDataLayer({
      event: GTM_EVENTS.CTA_CLICK,
      [GTM_PROPERTIES.LABEL]: params.label,
      [GTM_PROPERTIES.DESTINATION]: params.destination,
      [GTM_PROPERTIES.BLOCK_POSITION]: params.position,
    });
  }, []);

  const trackScrollDepth = useCallback((depth: number, position: number) => {
    pushToDataLayer({
      event: GTM_EVENTS.SCROLL_DEPTH,
      [GTM_PROPERTIES.DEPTH]: depth,
      [GTM_PROPERTIES.BLOCK_POSITION]: position,
    });
  }, []);

  return { trackBannerImpression, trackBannerClick, trackCTAClick, trackScrollDepth };
}

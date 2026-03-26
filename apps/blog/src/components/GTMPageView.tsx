"use client";

import { useGTM } from "@/lib/gtm";

export function GTMPageView() {
  useGTM(); // This fires page_view on pathname change
  return null;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crocobet.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Crocobet",
    template: "%s | Crocobet",
  },
  description: "Crocobet — news, promotions and insights from Georgia's leading gaming platform.",
  openGraph: {
    siteName: "Crocobet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

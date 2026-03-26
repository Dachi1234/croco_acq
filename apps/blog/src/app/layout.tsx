import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Acquisition",
  description:
    "Acquisition blog — news, updates, and insights from the Acquisition platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

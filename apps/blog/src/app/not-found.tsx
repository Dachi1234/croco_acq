import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <body className="m-0 flex min-h-screen items-center justify-center bg-[#001a24] font-sans text-white">
        <div className="p-8 text-center">
          <h1 className="m-0 text-[6rem] font-bold text-[#189541]">404</h1>
          <p className="my-4 text-lg text-[#83969c]">Page not found</p>
          <Link
            href="/ka"
            className="inline-block rounded-[200px] bg-[#189541] px-8 py-3 text-sm font-medium text-white no-underline"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  );
}

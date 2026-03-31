import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-[6rem] font-bold leading-none text-[#189541]">404</h1>
      <p className="mt-4 text-lg text-[#83969c]">
        გვერდი ვერ მოიძებნა / Page not found
      </p>
      <Link
        href="/ka"
        className="mt-8 inline-block rounded-[200px] border border-[#26c159] bg-[#189541] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#26c159]"
      >
        მთავარი / Home
      </Link>
    </div>
  );
}

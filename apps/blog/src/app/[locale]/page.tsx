import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import {
  PromoIcon,
  BlogIcon,
  ArrowRightIcon,
} from "@/components/icons/NavIcons";
import { fetchHomepage, fetchPromotions, fetchArticles } from "@/lib/api";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locale as Locale;

  const [homepage, allPromotions, allArticles] = await Promise.all([
    fetchHomepage(validLocale),
    fetchPromotions(validLocale),
    fetchArticles(validLocale),
  ]);

  const heroSlides =
    homepage.hero_slides && homepage.hero_slides.length > 0
      ? homepage.hero_slides.map((s: any) => ({ image: s.image, alt: s.heading ?? "" }))
      : [{ image: "https://picsum.photos/seed/hero-default/1200/500", alt: "Hero" }];

  const promotions = allPromotions.slice(0, 3);
  const blogPosts = allArticles.slice(0, 4);

  const ctaBanner = homepage.cta_banner;

  const labels =
    validLocale === "ka"
      ? {
          promotions: "აქციები",
          allPromos: "ყველა აქცია",
          learnMore: "გაიგე მეტი",
          blog: "ბლოგი",
          allArticles: "ყველა სტატია",
          readMore: "წაიკითხე მეტი",
          getBonus: "მიიღე ბონუსი",
          ctaHeadline: "500 ფრისპინი საჩუქრად!",
          ctaSubtext:
            "რეგისტრირდით და მიიღეთ ექსკლუზიური შეთავაზებები. არ გამოტოვოთ შანსი!",
        }
      : {
          promotions: "Promotions",
          allPromos: "All Promotions",
          learnMore: "Learn More",
          blog: "Blog",
          allArticles: "All Articles",
          readMore: "Read More",
          getBonus: "Get Bonus",
          ctaHeadline: "500 Free Spins Gift!",
          ctaSubtext:
            "Register and receive exclusive offers. Don't miss out!",
        };

  return (
    <div className="flex flex-col pt-[48px]">
      {/* Section 1: Hero Carousel */}
      <div className="mx-auto w-full max-w-[1056px] px-[16px] md:px-0">
        <HeroCarousel slides={heroSlides} />
      </div>

      {/* Section 2: Promotions */}
      {promotions.length > 0 && (
        <section className="mx-auto mt-[48px] w-full max-w-[1056px]">
          <div className="flex flex-col gap-[24px]">
            <div className="flex items-center justify-between px-[16px] md:px-0">
              <div className="flex items-center gap-[6px]">
                <PromoIcon className="h-5 w-5 text-white" />
                <span className="text-[16px] font-medium text-white">
                  {labels.promotions}
                </span>
              </div>
              <Link
                href={`/${validLocale}/promotions`}
                className="flex items-center gap-[4px] text-[12px] text-[#0092c0]"
              >
                {labels.allPromos}
                <ArrowRightIcon className="h-3.5 w-3.5 text-[#0092c0]" />
              </Link>
            </div>

            {/* Desktop grid */}
            <div className="hidden grid-cols-[repeat(3,minmax(0,1fr))] gap-x-[16px] gap-y-[16px] md:grid">
              {promotions.map((promo: any) => (
                <Link
                  key={promo.slug}
                  href={`/${validLocale}/promotions/${promo.slug}`}
                  className="overflow-hidden rounded-[24px] border border-[#072c38] bg-[#001e28]"
                >
                  <div className="relative h-[192px] w-full overflow-hidden">
                    {promo.cover_image ? (
                      <Image
                        src={promo.cover_image}
                        alt={promo.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#0a2a36]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,26,36,0.7)] to-[rgba(0,0,0,0)]" />
                  </div>
                  <div className="flex flex-col gap-[16px] p-[24px]">
                    <div className="flex flex-col gap-[12px]">
                      <h3 className="text-[14px] font-medium leading-[19.6px] text-white">
                        {promo.title}
                      </h3>
                      <p className="text-[12px] leading-[19.2px] text-[#83969c]">
                        {promo.excerpt}
                      </p>
                    </div>
                    <span className="block w-full rounded-[200px] border border-[#26c159] bg-[#189541] px-[16px] py-[10px] text-center text-[14px] font-medium text-white">
                      {labels.learnMore}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile horizontal scroll */}
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-[16px] overflow-x-auto px-[16px] md:hidden">
              {promotions.map((promo: any) => (
                <Link
                  key={promo.slug}
                  href={`/${validLocale}/promotions/${promo.slug}`}
                  className="min-w-[320px] snap-start overflow-hidden rounded-[24px] border border-[#072c38] bg-[#001e28]"
                >
                  <div className="relative h-[192px] w-full overflow-hidden">
                    {promo.cover_image ? (
                      <Image
                        src={promo.cover_image}
                        alt={promo.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#0a2a36]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,26,36,0.7)] to-[rgba(0,0,0,0)]" />
                  </div>
                  <div className="flex flex-col gap-[16px] p-[24px]">
                    <div className="flex flex-col gap-[12px]">
                      <h3 className="text-[14px] font-medium leading-[19.6px] text-white">
                        {promo.title}
                      </h3>
                      <p className="text-[12px] leading-[19.2px] text-[#83969c]">
                        {promo.excerpt}
                      </p>
                    </div>
                    <span className="block w-full rounded-[200px] border border-[#26c159] bg-[#189541] px-[16px] py-[10px] text-center text-[14px] font-medium text-white">
                      {labels.learnMore}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: CTA Banner */}
      <section className="mx-auto mt-[48px] w-full max-w-[1056px] px-[16px] md:px-0">
        <div
          className="relative overflow-hidden rounded-[24px] border border-solid p-[40px]"
          style={{
            borderColor: "rgba(0,146,192,0.2)",
            backgroundImage:
              "linear-gradient(172.18deg, rgba(0,146,192,0.12) 0%, rgba(28,175,75,0.06) 50%, rgba(0,146,192,0.04) 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute left-[-41px] top-[-41px] size-[128px] opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(28,175,75,1) 0%, rgba(21,131,56,0.75) 17.5%, rgba(14,88,38,0.5) 35%, rgba(7,44,19,0.25) 52.5%, transparent 70%)",
              filter: "blur(25px)",
            }}
          />
          <div
            className="pointer-events-none absolute bottom-[-41px] right-[-21px] size-[96px] opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(28,175,75,1) 0%, rgba(21,131,56,0.75) 17.5%, rgba(14,88,38,0.5) 35%, rgba(7,44,19,0.25) 52.5%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-[16px] md:flex-row md:items-center md:gap-[24px]">
            <div className="flex flex-1 items-center gap-[32px]">
              <div className="relative size-[64px] shrink-0 overflow-hidden rounded-[8px]">
                <Image
                  src="/images/cta-icon.png"
                  alt=""
                  width={100}
                  height={73}
                  className="absolute left-[-28.13%] top-[-6.87%] h-[113.91%] w-[156.25%] max-w-none"
                  unoptimized
                />
              </div>
              <div className="flex flex-1 flex-col gap-[8px]">
                <h3 className="text-[16px] font-medium leading-[21px] text-white">
                  {ctaBanner?.headline ?? labels.ctaHeadline}
                </h3>
                <p className="text-[14px] leading-[18px] text-[#83969c]">
                  {ctaBanner?.subtext ?? labels.ctaSubtext}
                </p>
              </div>
            </div>
            <button className="w-full shrink-0 rounded-[200px] border border-[#26c159] bg-[#189541] px-[20px] py-[8px] text-[14px] font-medium leading-[20px] text-white md:w-auto">
              {ctaBanner?.button_text ?? labels.getBonus}
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Blog */}
      {blogPosts.length > 0 && (
        <section className="mx-auto mt-[48px] w-full max-w-[1056px] pb-[32px]">
          <div className="flex flex-col gap-[24px]">
            <div className="flex items-center justify-between px-[16px] md:px-0">
              <div className="flex items-center gap-[6px]">
                <BlogIcon className="h-5 w-5 text-white" />
                <span className="text-[16px] font-medium text-white">
                  {labels.blog}
                </span>
              </div>
              <Link
                href={`/${validLocale}/blog`}
                className="flex items-center gap-[4px] text-[12px] text-[#0092c0]"
              >
                {labels.allArticles}
                <ArrowRightIcon className="h-3.5 w-3.5 text-[#0092c0]" />
              </Link>
            </div>

            {/* Desktop grid */}
            <div className="hidden grid-cols-[repeat(4,minmax(0,1fr))] gap-x-[16px] gap-y-[16px] md:grid">
              {blogPosts.map((post: any) => (
                <Link
                  key={post.slug}
                  href={`/${validLocale}/blog/${post.slug}`}
                  className="overflow-hidden rounded-[20px] border border-[#072c38] bg-[#001e28] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.16)]"
                >
                  <div className="relative h-[142px] overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#0a2a36]" />
                    )}
                  </div>
                  <div className="flex h-[183.083px] flex-col gap-[12px] p-[20px]">
                    <div className="flex flex-1 flex-col gap-[12px]">
                      <h3 className="text-[14px] font-medium leading-[19.6px] text-white">
                        {post.title}
                      </h3>
                      <p className="flex-1 overflow-hidden text-ellipsis text-[12px] leading-[19.2px] text-[#83969c]">
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="flex items-center gap-[4px] text-[12px] font-medium text-[#0092c0]">
                      {labels.readMore}
                      <ArrowRightIcon className="h-3.5 w-3.5 text-[#0092c0]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile horizontal scroll */}
            <div className="scrollbar-hide flex gap-[16px] overflow-x-auto px-[16px] md:hidden">
              {blogPosts.map((post: any) => (
                <Link
                  key={post.slug}
                  href={`/${validLocale}/blog/${post.slug}`}
                  className="min-w-[252px] overflow-hidden rounded-[20px] border border-[#072c38] bg-[#001e28] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.16)]"
                >
                  <div className="relative h-[142px] overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#0a2a36]" />
                    )}
                  </div>
                  <div className="flex h-[183.083px] flex-col gap-[12px] p-[20px]">
                    <div className="flex flex-1 flex-col gap-[12px]">
                      <h3 className="text-[14px] font-medium leading-[19.6px] text-white">
                        {post.title}
                      </h3>
                      <p className="flex-1 overflow-hidden text-ellipsis text-[12px] leading-[19.2px] text-[#83969c]">
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="flex items-center gap-[4px] text-[12px] font-medium text-[#0092c0]">
                      {labels.readMore}
                      <ArrowRightIcon className="h-3.5 w-3.5 text-[#0092c0]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

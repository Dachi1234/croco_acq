"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface HeroCarouselProps {
  slides: { image: string; alt?: string }[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % total),
    [total],
  );

  const prev = useCallback(
    () => setCurrent((prev) => (prev - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  if (!total) return null;

  return (
    <div className="relative">
      {/* Carousel container */}
      <div className="relative h-[160px] overflow-hidden rounded-[20px] md:h-[229px] md:rounded-[24px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt ?? ""}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute bottom-[13.6px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-[6.807px]">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-[40.841px] transition-all ${
                  i === current
                    ? "h-[5.105px] w-[24px] bg-[#1caf4b] shadow-[0px_0px_6.807px_0px_rgba(28,175,75,0.5)]"
                    : "h-[5.105px] w-[5.105px] bg-[rgba(255,255,255,0.3)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Arrow buttons — desktop only, positioned outside carousel */}
      {total > 1 && (
        <div className="pointer-events-none absolute inset-0 left-1/2 hidden w-[1176px] -translate-x-1/2 items-center justify-between px-[8px] md:flex">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="pointer-events-auto flex h-[40px] w-[40px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(0,30,40,0.8)]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.25 14.25L6.75 9L11.25 3.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="pointer-events-auto flex h-[40px] w-[40px] items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(0,30,40,0.8)]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.75 3.75L11.25 9L6.75 14.25"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

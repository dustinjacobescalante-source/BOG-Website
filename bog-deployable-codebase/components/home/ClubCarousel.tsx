"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  { src: "/images/slide-1.jpg", alt: "Buffalo Dog Brotherhood of Growth intro" },
  { src: "/images/slide-2.jpg", alt: "What We Are" },
  { src: "/images/slide-3.jpg", alt: "What We Do" },
  { src: "/images/slide-4.jpg", alt: "Who This Is For" },
  { src: "/images/slide-5.jpg", alt: "How It Works" },
  { src: "/images/slide-6.jpg", alt: "Our Mission" },
  { src: "/images/slide-7.jpg", alt: "Apply to Join" },
];

const AUTOPLAY_MS = 4500;

export default function ClubCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setProgressKey((prev) => prev + 1);
    }, AUTOPLAY_MS);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    setProgressKey((prev) => prev + 1);
  }, [current, paused]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <section className="border-t border-white/10 bg-black px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
              Inside the Brotherhood
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              What BOG Stands For
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              A visual walkthrough of the standards, mission, structure, and path into BOG.
            </p>
          </div>

          <div
            className="mx-auto max-w-6xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.45)]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative aspect-[16/9] w-full bg-black">
                {slides.map((slide, index) => {
                  const isLast = index === slides.length - 1;
                  const isActive = current === index;

                  const slideContent = (
                    <div
                      className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "z-10 scale-100 opacity-100"
                          : "pointer-events-none z-0 scale-[1.035] opacity-0"
                      }`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        className={`bg-black object-contain transition-transform duration-[7000ms] ease-out ${
                          isActive ? "scale-105" : "scale-110"
                        }`}
                      />
                    </div>
                  );

                  if (isLast && isActive) {
                    return (
                      <Link
                        href="/portal"
                        key={slide.src}
                        className="absolute inset-0 z-20 block"
                        aria-label="Go to join page"
                      >
                        {slideContent}
                      </Link>
                    );
                  }

                  return <div key={slide.src}>{slideContent}</div>;
                })}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />

                <button
                  onClick={goToPrevious}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-black/60 group-hover:opacity-100 md:block"
                >
                  ‹
                </button>

                <button
                  onClick={goToNext}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-black/60 group-hover:opacity-100 md:block"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    current === index
                      ? "w-8 bg-[#c49a6c] shadow-[0_0_12px_rgba(196,154,108,0.45)]"
                      : "w-2.5 bg-white/20 hover:bg-white/45"
                  }`}
                />
              ))}
            </div>

            <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                key={`${progressKey}-${current}-${paused ? "paused" : "playing"}`}
                className={`h-full bg-[#c49a6c] ${
                  paused ? "w-0" : "animate-[carouselProgress_4500ms_linear_forwards]"
                }`}
              />
            </div>

            <div className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-zinc-500">
              Swipe on mobile • Hover to pause • Loops continuously
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/about"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 transition duration-300 hover:-translate-y-0.5 hover:bg-white/5 hover:shadow-[0_0_18px_rgba(255,255,255,0.08)]"
              >
                View Full About Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes carouselProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

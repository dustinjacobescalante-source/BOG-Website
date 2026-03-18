"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { src: "/images/slide-1.jpg", alt: "Buffalo Dog Brotherhood of Growth intro" },
  { src: "/images/slide-2.jpg", alt: "What We Are" },
  { src: "/images/slide-3.jpg", alt: "What We Do" },
  { src: "/images/slide-4.jpg", alt: "Who This Is For" },
  { src: "/images/slide-5.jpg", alt: "How It Works" },
  { src: "/images/slide-6.jpg", alt: "Our Mission" },
  { src: "/images/slide-7.jpg", alt: "Apply to Join" },
];

export default function ClubCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="border-t border-white/10 bg-black px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
            Inside the Brotherhood
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            What Buffalo Dog Stands For
          </h2>
        </div>

        <div
          className="mx-auto max-w-6xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[16/9] w-full">
              <Image
                key={slides[current].src}
                src={slides[current].src}
                alt={slides[current].alt}
                fill
                priority={current === 0}
                className="object-contain bg-black"
              />
            </div>

            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/80"
            >
              ‹
            </button>

            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black/80"
            >
              ›
            </button>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2.5 rounded-full ${
                  current === index
                    ? "w-8 bg-[#c49a6c]"
                    : "w-2.5 bg-white/25"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/about"
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-white/5"
            >
              View Full About Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ClubCarousel from "@/components/home/ClubCarousel";
import { site } from "@/lib/site";

export default function HomePage() {
  const [parallaxY, setParallaxY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setHeroVisible(true);

    const handleScroll = () => {
      const y = Math.min(window.scrollY * 0.12, 80);
      setParallaxY(y);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const triggerFlash = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
    };

    const runFlashLoop = () => {
      const delay = Math.random() * 7000 + 5000;
      return setTimeout(() => {
        triggerFlash();

        if (Math.random() > 0.65) {
          setTimeout(() => triggerFlash(), 180);
        }

        flashTimer = runFlashLoop();
      }, delay);
    };

    let flashTimer = runFlashLoop();

    return () => clearTimeout(flashTimer);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <div className="absolute inset-0">
          {/* LIGHTNING BACKGROUND */}
          <div className="absolute inset-0">
            <Image
              src="/assets/lightning.jpg"
              alt="Lightning background"
              fill
              priority
              className="object-cover opacity-[0.20] blur-[3px]"
            />
          </div>

          {/* MOVING STORM CLOUD LAYER */}
          <div
            className="absolute inset-0 animate-[stormDrift_18s_ease-in-out_infinite]"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06), transparent 28%), radial-gradient(circle at 75% 20%, rgba(255,255,255,0.05), transparent 24%), radial-gradient(circle at 55% 65%, rgba(255,255,255,0.04), transparent 30%)",
            }}
          />

          {/* SUBTLE LIGHTNING FLASH */}
          <div
            className={`absolute inset-0 bg-white transition-opacity duration-100 ${
              flash ? "opacity-[0.06]" : "opacity-0"
            }`}
          />

          {/* BUFFALO PARALLAX */}
          <div
            className="absolute inset-0 will-change-transform transition-transform duration-150 ease-out"
            style={{ transform: `translateY(${parallaxY}px) scale(1.08)` }}
          >
            <Image
              src="/assets/Buffalo.png"
              alt="Buffalo background"
              fill
              className="object-contain opacity-20"
              priority
            />
          </div>

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div
            className={`flex max-w-3xl flex-col justify-center transform-gpu transition-all duration-700 ease-out ${
              heroVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div
              className={`mb-5 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-300 backdrop-blur-sm transition-all duration-700 delay-75 ${
                heroVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              BOG Website + Member Platform
            </div>

            <h1
              className={`max-w-4xl text-4xl font-black tracking-tight text-white transition-all duration-700 delay-150 sm:text-5xl lg:text-6xl ${
                heroVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              Built for Men Who Refuse Average.
            </h1>

            <p
              className={`mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 transition-all duration-700 delay-300 sm:text-lg lg:text-xl ${
                heroVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              Give men a purpose.
              <br />
              <br />
              BOG is built on standards — not personalities.
              We create a culture where discipline, health, and accountability
              are expected.
              <br />
              <br />
              Weak bodies erode strength everywhere else.
              Uncontrolled men are destructive.
              We train ourselves to respond — not react.
              <br />
              <br />
              We serve our communities.
              We build strong relationships.
              We use faith as a compass — not a weapon.
              <br />
              <br />
              <span className="text-xl font-bold tracking-widest text-red-500">
                RUN AT THE STORM.
              </span>
            </p>

            <p
              className={`mt-4 max-w-2xl text-base text-zinc-400 transition-all duration-700 delay-[450ms] ${
                heroVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              {site.quote}
            </p>

            <div
              className={`mt-8 flex flex-wrap gap-3 transition-all duration-700 delay-[600ms] ${
                heroVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <Link
                href="/about"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_rgba(220,38,38,0)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.45)]"
              >
                Learn What We Stand For
              </Link>

              <Link
                href="/portal"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 shadow-[0_0_0_rgba(255,255,255,0)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
              >
                Enter the Brotherhood
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes stormDrift {
            0% {
              transform: translate3d(0px, 0px, 0px) scale(1);
            }
            50% {
              transform: translate3d(12px, -8px, 0px) scale(1.03);
            }
            100% {
              transform: translate3d(0px, 0px, 0px) scale(1);
            }
          }
        `}</style>
      </section>

      <ClubCarousel />
    </>
  );
}

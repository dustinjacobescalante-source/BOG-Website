"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ClubCarousel from "@/components/home/ClubCarousel";
import { site } from "@/lib/site";

export default function HomePage() {
  const [parallaxY, setParallaxY] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const handleScroll = () => {
      const y = Math.min(window.scrollY * 0.14, 90);
      setParallaxY(y);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 will-change-transform transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${parallaxY}px) scale(1.12)` }}
          >
            <div className="absolute inset-0 animate-[heroDrift_16s_ease-in-out_infinite]">
              <Image
                src="/assets/Buffalo.png"
                alt="Buffalo background"
                fill
                className="object-contain opacity-20"
                priority
              />
            </div>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_52%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.65)_100%)]" />
          <div className="absolute inset-0 bg-black/10" />

          {/* GRAIN OVERLAY */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light grain-layer" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div
            className={`flex max-w-3xl flex-col justify-center transform-gpu transition-all duration-800 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div
              className={`mb-5 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-300 backdrop-blur-sm transition-all duration-800 delay-75 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              BOG Website + Member Platform
            </div>

            <h1
              className={`max-w-4xl text-4xl font-black tracking-tight text-white transition-all duration-800 delay-150 sm:text-5xl lg:text-6xl ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              Built for Men Who Refuse Average.
            </h1>

            <p
              className={`mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 transition-all duration-800 delay-300 sm:text-lg lg:text-xl ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
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
              className={`mt-4 max-w-2xl text-base text-zinc-400 transition-all duration-800 delay-[450ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {site.quote}
            </p>

            <div
              className={`mt-8 flex flex-wrap gap-3 transition-all duration-800 delay-[600ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <Link
                href="/about"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-[0_0_28px_rgba(220,38,38,0.45)]"
              >
                Learn What We Stand For
              </Link>

              <Link
                href="/portal"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_0_18px_rgba(255,255,255,0.12)]"
              >
                Enter the Brotherhood
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes heroDrift {
            0%,
            100% {
              transform: scale(1) translateY(0px);
            }
            50% {
              transform: scale(1.02) translateY(-6px);
            }
          }

          .grain-layer {
            background-image:
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8) 0.4px, transparent 0.8px),
              radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.6) 0.5px, transparent 0.9px),
              radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.7) 0.4px, transparent 0.8px),
              radial-gradient(circle at 65% 80%, rgba(255, 255, 255, 0.5) 0.5px, transparent 1px),
              radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.5) 0.3px, transparent 0.8px);
            background-size: 180px 180px, 220px 220px, 200px 200px, 260px 260px, 240px 240px;
            background-position: 0 0, 40px 60px, 80px 120px, 120px 40px, 160px 100px;
          }
        `}</style>
      </section>

      <ClubCarousel />
    </>
  );
}

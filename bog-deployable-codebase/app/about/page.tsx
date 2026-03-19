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
      const y = Math.min(window.scrollY * 0.16, 100);
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
          {/* BACKGROUND BUFFALO */}
          <div
            className="absolute inset-0 will-change-transform transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${parallaxY}px) scale(1.14)` }}
          >
            <div className="absolute inset-0 animate-[heroDrift_14s_ease-in-out_infinite]">
              <Image
                src="/assets/Buffalo.png"
                alt="Buffalo background"
                fill
                className="object-contain opacity-30"
                priority
              />
            </div>
          </div>

          {/* STRONGER MOVING FOG LAYER */}
          <div
            className="absolute inset-0 pointer-events-none animate-[fogMoveA_16s_ease-in-out_infinite]"
            style={{
              background: `
                radial-gradient(circle at 18% 28%, rgba(255,255,255,0.09), transparent 18%),
                radial-gradient(circle at 78% 22%, rgba(255,255,255,0.08), transparent 16%),
                radial-gradient(circle at 52% 70%, rgba(255,255,255,0.06), transparent 22%)
              `,
              filter: "blur(22px)",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none animate-[fogMoveB_22s_ease-in-out_infinite]"
            style={{
              background: `
                radial-gradient(circle at 28% 62%, rgba(255,255,255,0.05), transparent 20%),
                radial-gradient(circle at 68% 58%, rgba(255,255,255,0.05), transparent 18%),
                radial-gradient(circle at 50% 32%, rgba(255,255,255,0.04), transparent 20%)
              `,
              filter: "blur(28px)",
            }}
          />

          {/* STRONGER CENTER SPOTLIGHT */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_46%)]" />

          {/* TOP FADE */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/60" />

          {/* STRONGER VIGNETTE */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_36%,rgba(0,0,0,0.62)_100%)]" />

          {/* FINAL DARKENING */}
          <div className="absolute inset-0 bg-black/15" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div
            className={`flex max-w-3xl flex-col justify-center transform-gpu transition-all duration-900 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div
              className={`mb-5 inline-flex w-fit rounded-full border border-white/10 bg-white/8 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-200 backdrop-blur-md transition-all duration-900 delay-75 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              BOG Website + Member Platform
            </div>

            <h1
              className={`max-w-4xl text-4xl font-black tracking-tight text-white transition-all duration-900 delay-150 sm:text-5xl lg:text-6xl ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Built for Men Who Refuse Average.
            </h1>

            <p
              className={`mt-5 max-w-2xl text-base leading-relaxed text-zinc-200 transition-all duration-900 delay-300 sm:text-lg lg:text-xl ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
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
              className={`mt-4 max-w-2xl text-base text-zinc-400 transition-all duration-900 delay-[450ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {site.quote}
            </p>

            <div
              className={`mt-8 flex flex-wrap gap-3 transition-all duration-900 delay-[600ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Link
                href="/about"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_rgba(220,38,38,0)] transition duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-[0_0_28px_rgba(220,38,38,0.45)]"
              >
                Learn What We Stand For
              </Link>

              <Link
                href="/portal"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 shadow-[0_0_0_rgba(255,255,255,0)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
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
              transform: scale(1) translate3d(0, 0, 0);
            }
            50% {
              transform: scale(1.04) translate3d(0, -10px, 0);
            }
          }

          @keyframes fogMoveA {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 0.75;
            }
            50% {
              transform: translate3d(18px, -12px, 0) scale(1.08);
              opacity: 1;
            }
          }

          @keyframes fogMoveB {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 0.55;
            }
            50% {
              transform: translate3d(-14px, 10px, 0) scale(1.06);
              opacity: 0.9;
            }
          }
        `}</style>
      </section>

      <ClubCarousel />
    </>
  );
}

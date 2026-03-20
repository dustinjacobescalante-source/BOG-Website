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
      const y = Math.min(window.scrollY * 0.12, 72);
      setParallaxY(y);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-black">
        {/* Background system */}
        <div className="absolute inset-0">
          {/* Base background */}
          <div className="absolute inset-0 bg-black" />

          {/* Buffalo layer */}
          <div
            className="absolute inset-0 will-change-transform transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${parallaxY}px) scale(1.08)`,
            }}
          >
            <div className="absolute inset-0 animate-[heroFloat_18s_ease-in-out_infinite]">
              <Image
                src="/assets/Buffalo.png"
                alt="Buffalo background"
                fill
                priority
                className="object-contain object-center opacity-[0.16] select-none"
              />
            </div>
          </div>

          {/* Premium lighting layers */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.10),transparent_38%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.04),transparent_44%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.22)_24%,rgba(0,0,0,0.62)_72%,rgba(0,0,0,0.88)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.58)_100%)]" />

          {/* Side vignette for cinematic framing */}
          <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-black/50 to-transparent" />

          {/* Top highlight line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Grain */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light grain-layer" />
        </div>

        {/* Foreground content */}
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
            {/* Left content */}
            <div
              className={`transform-gpu transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-300 backdrop-blur-md transition-all duration-1000 delay-100 ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
                Brotherhood of Growth
              </div>

              <h1
                className={`mt-6 max-w-5xl text-4xl font-black leading-[0.96] tracking-[-0.04em] text-white transition-all duration-1000 delay-150 sm:text-5xl md:text-6xl lg:text-7xl ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                Built for Men
                <span className="block text-white/90">Who Refuse Average.</span>
              </h1>

              <div
                className={`mt-6 h-px w-24 bg-gradient-to-r from-red-500 via-red-400/70 to-transparent transition-all duration-1000 delay-250 ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              />

              <p
                className={`mt-7 max-w-2xl text-[15px] leading-7 text-zinc-300 transition-all duration-1000 delay-300 sm:text-base sm:leading-8 lg:text-lg ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                Give men a purpose.
                <br />
                <br />
                BOG is built on standards — not personalities. We create a culture
                where discipline, health, and accountability are expected.
                <br />
                <br />
                Weak bodies erode strength everywhere else. Uncontrolled men are
                destructive. We train ourselves to respond — not react.
                <br />
                <br />
                We serve our communities. We build strong relationships. We use
                faith as a compass — not a weapon.
              </p>

              <div
                className={`mt-6 transition-all duration-1000 delay-[400ms] ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <span className="inline-block text-sm font-bold uppercase tracking-[0.38em] text-red-500 sm:text-base">
                  Run at the storm.
                </span>
              </div>

              <p
                className={`mt-5 max-w-2xl text-sm leading-7 text-zinc-400 transition-all duration-1000 delay-[475ms] sm:text-base ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                {site.quote}
              </p>

              <div
                className={`mt-9 flex flex-col gap-3 sm:flex-row transition-all duration-1000 delay-[575ms] ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <Link
                  href="/about"
                  className="group inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(185,28,28,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400 hover:shadow-[0_16px_48px_rgba(185,28,28,0.32)] focus:outline-none focus:ring-2 focus:ring-red-500/60"
                >
                  <span>Learn What We Stand For</span>
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>

                <Link
                  href="/portal"
                  className="group inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/12 bg-white/[0.045] px-6 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_12px_36px_rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <span>Enter the Brotherhood</span>
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Right side stat / brand block */}
            <div
              className={`transform-gpu transition-all duration-1000 delay-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-600/10 blur-3xl" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                  Core Standard
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-3xl font-black tracking-[-0.04em] text-white">
                      Discipline
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Built daily through action, not talk.
                    </p>
                  </div>

                  <div className="h-px w-full bg-white/8" />

                  <div>
                    <p className="text-3xl font-black tracking-[-0.04em] text-white">
                      Accountability
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Men sharpened by standards and brotherhood.
                    </p>
                  </div>

                  <div className="h-px w-full bg-white/8" />

                  <div>
                    <p className="text-3xl font-black tracking-[-0.04em] text-white">
                      Leadership
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Strength directed with purpose and control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom cue */}
          <div
            className={`mt-12 flex items-center gap-3 text-zinc-500 transition-all duration-1000 delay-[700ms] ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="h-px w-10 bg-white/10" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.34em]">
              Scroll to explore
            </span>
            <div className="flex h-6 w-4 items-start justify-center rounded-full border border-white/15 p-1">
              <div className="h-1.5 w-1.5 animate-[scrollDot_1.8s_ease-in-out_infinite] rounded-full bg-white/60" />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes heroFloat {
            0%,
            100% {
              transform: scale(1) translateY(0px);
            }
            50% {
              transform: scale(1.015) translateY(-8px);
            }
          }

          @keyframes scrollDot {
            0%,
            100% {
              transform: translateY(0);
              opacity: 0.9;
            }
            50% {
              transform: translateY(8px);
              opacity: 0.35;
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

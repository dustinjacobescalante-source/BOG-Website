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
      const y = Math.min(window.scrollY * 0.12, 80);
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
          {/* BUFFALO PARALLAX + SLOW CINEMATIC ZOOM */}
          <div
            className="absolute inset-0 will-change-transform transition-transform duration-150 ease-out"
            style={{ transform: `translateY(${parallaxY}px) scale(1.08)` }}
          >
            <div className="absolute inset-0 animate-[heroDrift_18s_ease-in-out_infinite]">
              <Image
                src="/assets/Buffalo.png"
                alt="Buffalo background"
                fill
                className="object-contain opacity-20"
                priority
              />
            </div>
          </div>

          {/* SUBTLE ATMOSPHERIC FOG */}
          <div
            className="absolute inset-0 pointer-events-none animate-[fogMove_24s_ease-in-out_infinite]"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.045), transparent 22%),
                radial-gradient(circle at 78% 22%, rgba(255,255,255,0.035), transparent 20%),
                radial-gradient(circle at 55% 68%, rgba(255,255,255,0.03), transparent 24%)
              `,
              filter: "blur(18px)",
            }}
          />

          {/* CENTER DEPTH LIGHT */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_58%)]" />

          {/* VIGNETTE FOR FOCUS */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.34)_100%)]" />

          {/* MAIN OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div
            className={`flex max-w-3xl flex-col justify-center transform-gpu transition-all duration-700 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div
              className={`mb-5 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-300 backdrop-blur-sm transition-all duration-700 delay-75 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              BOG Website + Member Platform
            </div>

            <h1
              className={`max-w-4xl text-4xl font-black tracking-tight text-white transition-all duration-700 delay-150 sm:text-5xl lg:text-6xl ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              Built for Men Who Refuse Average.
            </h1>

            <p
              className={`mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 transition-all duration-700 delay-300 sm:text-lg lg:text-xl ${
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
              className={`mt-4 max-w-2xl text-base text-zinc-400 transition-all duration-700 delay-[450ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {site.quote}
            </p>

            <div
              className={`mt-8 flex flex-wrap gap-3 transition-all duration-700 delay-[600ms] ${
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <Link
                href="/about"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_rgba(220,38,38,0)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)]"
              >
                Learn What We Stand For
              </Link>

              <Link
                href="/portal"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 shadow-[0_0_0_rgba(255,255,255,0)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]"
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
              transform: scale(1.025) translate3d(0, -6px, 0);
            }
          }

          @keyframes fogMove {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translate3d(10px, -8px, 0) scale(1.03);
              opacity: 1;
            }
          }
        `}</style>
      </section>

      <ClubCarousel />
    </>
  );
}

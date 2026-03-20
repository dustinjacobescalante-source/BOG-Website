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
      const y = Math.min(window.scrollY * 0.1, 64);
      setParallaxY(y);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-black">
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#050505]" />

          <div
            className="absolute inset-0 will-change-transform transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${parallaxY}px) scale(1.06)`,
            }}
          >
            <div className="absolute inset-0 animate-[heroFloat_20s_ease-in-out_infinite]">
              <Image
                src="/assets/Buffalo.png"
                alt="Buffalo background"
                fill
                priority
                className="object-contain object-center opacity-[0.13] select-none"
              />
            </div>
          </div>

          {/* LIGHTING */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.11),transparent_24%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.05),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.25)_25%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.9)_100%)]" />

          {/* SIDE VIGNETTE */}
          <div className="absolute inset-y-0 left-0 w-[16%] bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[16%] bg-gradient-to-l from-black/60 to-transparent" />

          {/* GRAIN */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-soft-light grain-layer" />
        </div>

        {/* CONTENT */}
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
            
            {/* LEFT SIDE */}
            <div
              className={`transform-gpu transition-all duration-1000 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="inline-flex rounded-full border border-white/10 bg-white/[0.045] px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-zinc-300">
                Brotherhood of Growth
              </div>

              {/* ✅ FIXED HEADLINE */}
              <h1 className="mt-6 pb-1 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Built for Men
                <span className="block bg-gradient-to-r from-white via-white/85 to-white/60 bg-clip-text text-transparent">
                  Who Refuse Average.
                </span>
              </h1>

              <div className="mt-6 h-px w-28 bg-gradient-to-r from-red-500 to-transparent" />

              <p className="mt-7 max-w-2xl text-base text-zinc-300">
                Give men a purpose.
                <br /><br />
                BOG is built on standards — not personalities.
                Discipline, accountability, and growth are expected.
                <br /><br />
                Weak bodies erode strength everywhere else.
                We train ourselves to respond — not react.
              </p>

              <div className="mt-6 text-sm font-bold uppercase tracking-[0.35em] text-red-500">
                Run at the storm.
              </div>

              <p className="mt-5 text-zinc-400">{site.quote}</p>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/about"
                  className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
                >
                  Learn More
                </Link>

                <Link
                  href="/portal"
                  className="rounded-xl border border-white/10 px-5 py-3 text-white hover:bg-white/10"
                >
                  Enter
                </Link>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                BOG Creed
              </p>

              <p className="mt-4 text-xl font-bold text-white">
                Standards first. Brotherhood always.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-red-500 text-sm font-bold uppercase">Discipline</p>
                  <p className="text-zinc-400 text-sm">Daily action over excuses.</p>
                </div>

                <div>
                  <p className="text-red-500 text-sm font-bold uppercase">Accountability</p>
                  <p className="text-zinc-400 text-sm">Ownership and consistency.</p>
                </div>

                <div>
                  <p className="text-red-500 text-sm font-bold uppercase">Leadership</p>
                  <p className="text-zinc-400 text-sm">Strength with purpose.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ANIMATIONS */}
        <style jsx>{`
          @keyframes heroFloat {
            0%,100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }

          .grain-layer {
            background-image: radial-gradient(rgba(255,255,255,0.4) 0.5px, transparent 0.5px);
            background-size: 4px 4px;
          }
        `}</style>
      </section>

      <ClubCarousel />
    </>
  );
}

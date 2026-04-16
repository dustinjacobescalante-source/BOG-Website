"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

const pillars = [
  {
    number: "01",
    title: "Discipline",
    text: "We do what needs to be done, especially when we do not feel like it. Standards come before mood.",
  },
  {
    number: "02",
    title: "Brotherhood",
    text: "No man grows alone. We challenge, sharpen, and support each other through every season.",
  },
  {
    number: "03",
    title: "Growth",
    text: "Physical, mental, spiritual, and professional growth are all part of the mission.",
  },
  {
    number: "04",
    title: "Accountability",
    text: "We do not let each other drift. We expect effort, ownership, and follow-through.",
  },
];

const standards = [
  "Show up when it is hard",
  "Tell the truth",
  "Take responsibility",
  "Train your body and mind",
  "Lead at home and in public",
  "Choose discipline over excuses",
];

const steps = [
  {
    number: "01",
    title: "Step In",
    text: "Make the decision to stop living on autopilot and pursue something higher.",
  },
  {
    number: "02",
    title: "Commit",
    text: "Accept the standard. Growth requires discomfort, consistency, and ownership.",
  },
  {
    number: "03",
    title: "Train",
    text: "Develop through structure, accountability, brotherhood, and shared challenge.",
  },
  {
    number: "04",
    title: "Lead",
    text: "Become the kind of man who brings strength, steadiness, and purpose to others.",
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = Math.min(window.scrollY * 0.1, 80);
      setParallaxY(y);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-black text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#050505]" />

          <div
            className="absolute inset-0 will-change-transform transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${parallaxY}px) scale(1.03)` }}
          >
            {/* Mobile / tablet hero background */}
            <div className="absolute inset-0 lg:hidden">
              <div className="absolute left-1/2 top-[15rem] h-[60vw] w-[60vw] -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
              <div className="absolute left-1/2 top-[15rem] w-[150vw] max-w-none -translate-x-1/2 opacity-[0.40]">
                <Image
                  src="/assets/boggraf.jpg"
                  alt="BOG background"
                  width={1800}
                  height={1800}
                  priority
                  className="h-auto w-full select-none blur-[1px]"
                />
              </div>
            </div>

            {/* Desktop hero background */}
            <div className="absolute inset-0 hidden lg:block">
              <Image
                src="/assets/boggraf.jpg"
                alt="Buffalo background"
                fill
                priority
                className="object-contain object-center opacity-[0.40] select-none"
              />
            </div>
          </div>

          {/* Mobile overlays */}
          <div className="absolute inset-0 lg:hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.88)_14%,rgba(0,0,0,0.74)_28%,rgba(0,0,0,0.56)_46%,rgba(0,0,0,0.54)_66%,rgba(0,0,0,0.82)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-black via-black/90 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black via-black/85 to-transparent" />
          </div>

          {/* Desktop overlays */}
          <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.10),transparent_26%)]" />
          <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.04),transparent_40%)]" />
          <div className="hidden lg:block absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.20)_22%,rgba(0,0,0,0.48)_58%,rgba(0,0,0,0.82)_100%)]" />

          <div className="absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-black/85 to-transparent sm:w-[14%] lg:w-[16%] lg:from-black/60" />
          <div className="absolute inset-y-0 right-0 w-[12%] bg-gradient-to-l from-black/85 to-transparent sm:w-[14%] lg:w-[16%] lg:from-black/60" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-soft-light grain-layer" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-36">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
            <Reveal className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md sm:px-5 sm:text-xs sm:tracking-[0.28em]">
                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
                About BOG
              </div>

              <h1 className="mt-6 text-[2.5rem] font-black tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block leading-[0.98] sm:leading-[1.02]">Built on Discipline.</span>
                <span className="block leading-[0.98] sm:leading-[1.02]">Forged Through Brotherhood.</span>
                <span className="block pb-2 leading-[0.98] bg-gradient-to-r from-white via-white/88 to-white/60 bg-clip-text text-transparent sm:leading-[1.02]">
                  Driven by Growth.
                </span>
              </h1>

              <div className="mt-6 h-px w-24 bg-gradient-to-r from-red-500 via-red-400/70 to-transparent sm:w-28" />

              <p className="mt-7 max-w-2xl text-base leading-9 text-zinc-300 sm:text-base sm:leading-8 lg:text-lg">
                BOG exists to build stronger men through standards,
                accountability, challenge, and purpose. This is not about image.
                It is about becoming the kind of man who can be trusted with
                responsibility, pressure, leadership, and service.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  href="/portal"
                  className="group inline-flex min-h-[58px] w-full items-center justify-center rounded-[26px] border border-red-500/40 bg-gradient-to-b from-red-600 to-red-700 px-6 py-4 text-base font-semibold text-white shadow-[0_10px_40px_rgba(185,28,28,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400 hover:shadow-[0_16px_48px_rgba(185,28,28,0.32)] sm:min-h-[52px] sm:w-auto sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm"
                >
                  <span>Join the Brotherhood</span>
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>

                <Link
                  href="/"
                  className="group inline-flex min-h-[58px] w-full items-center justify-center rounded-[26px] border border-white/30 bg-white/[0.045] px-6 py-4 text-base font-semibold text-zinc-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.07] hover:shadow-[0_12px_36px_rgba(255,255,255,0.06)] sm:min-h-[52px] sm:w-auto sm:rounded-2xl sm:border-white/12 sm:px-6 sm:py-3 sm:text-sm"
                >
                  <span>Back Home</span>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="absolute -right-12 top-6 h-28 w-28 rounded-full bg-red-600/10 blur-3xl" />
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-gradient-to-r from-red-500 to-transparent" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                      Why We Exist
                    </p>
                  </div>

                  <p className="mt-5 text-2xl font-black leading-tight tracking-[-0.04em] text-white">
                    Men were not made to drift.
                  </p>

                  <div className="mt-8 space-y-5">
                    <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-500">
                        Standards
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        We reject passive living and raise the line.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-500">
                        Pressure
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Challenge reveals character and builds strength.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-500">
                        Brotherhood
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Real growth takes men willing to sharpen each other.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              The Mission
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              We do not gather to coast.
              <br />
              We gather to become more.
            </h2>
          </Reveal>

          <Reveal
            delay={100}
            className="space-y-6 text-base leading-8 text-zinc-300"
          >
            <p>
              BOG is a brotherhood for men who are tired of drifting, tired of
              average, and ready to hold a higher line.
            </p>
            <p>
              We believe weak habits affect every part of life. Strong men are
              built through discipline, consistency, humility, and challenge.
            </p>
            <p>
              Our goal is not noise. Our goal is transformation that shows up in
              health, family, leadership, faith, service, and the way we carry
              ourselves under pressure.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              The Pillars
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Four things we do not compromise on
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <div className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045] hover:shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute -right-8 top-6 h-24 w-24 rounded-full bg-red-600/10 blur-3xl transition-all duration-300 group-hover:bg-red-600/15" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px w-10 bg-gradient-to-r from-red-500 to-transparent" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                          Pillar
                        </p>
                      </div>

                      <span className="text-sm font-bold tracking-[0.3em] text-red-500">
                        {pillar.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-3xl font-black tracking-[-0.04em] text-white">
                      {pillar.title}
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                      {pillar.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Reveal className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-black/65 px-6 py-14 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-10 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              The Standard
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              We show up.
              <br />
              We do the work.
              <br />
              We do not make excuses.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
              Brotherhood means something only when it is backed by standards.
              We expect action, honesty, effort, humility, and a willingness to
              be sharpened.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              What This Looks Like
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Real standards.
              <br />
              Real action.
            </h2>
          </Reveal>

          <div className="grid gap-5">
            {standards.map((item, index) => (
              <Reveal key={item} delay={index * 80}>
                <div className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03] px-6 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.045] hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute -right-6 top-4 h-20 w-20 rounded-full bg-red-600/10 blur-3xl transition-all duration-300 group-hover:bg-red-600/20" />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold tracking-[0.3em] text-red-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="h-px w-10 bg-gradient-to-r from-white/20 to-transparent" />

                      <p className="text-base font-medium text-zinc-200 sm:text-lg">
                        {item}
                      </p>
                    </div>

                    <span className="text-zinc-500 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              The Process
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              How it works
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 80}>
                <div className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-black/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute -right-8 top-5 h-20 w-20 rounded-full bg-red-600/10 blur-3xl transition-all duration-300 group-hover:bg-red-600/15" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-500">
                        {step.number}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <h3 className="mt-5 text-2xl font-black tracking-[-0.03em] text-white">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-zinc-400">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              Who This Is For
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">
              This is for men who are ready to be challenged.
            </h2>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {[
              "Men tired of average",
              "Men ready to lead",
              "Men willing to be uncomfortable",
              "Men committed to growth",
            ].map((item, index) => (
              <Reveal key={item} delay={index * 80}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-base text-zinc-200 transition duration-300 hover:border-white/20 hover:bg-white/[0.05]">
                  {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 will-change-transform transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${parallaxY * 0.35}px) scale(1.05)` }}
          >
            <Image
              src="/assets/Buffalo.png"
              alt="Buffalo background"
              fill
              className="object-contain object-center opacity-[0.10]"
            />
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_26%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-soft-light grain-layer" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-28 text-center sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300 backdrop-blur-md">
              Final Word
            </div>

            <h2 className="mt-7 text-4xl font-black tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              <span className="block leading-[1.02]">This is not for everyone.</span>
              <span className="block leading-[1.02]">But if you are ready</span>
              <span className="block pb-2 leading-[1.02] bg-gradient-to-r from-white via-white/88 to-white/60 bg-clip-text text-transparent">
                step in.
              </span>
            </h2>

            <div className="mx-auto mt-7 h-px w-28 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
              Brotherhood means more when it costs something. This is for men
              willing to be sharpened, held accountable, and called higher.
              If you are ready to commit to growth, challenge, purpose, and
              responsibility, there is a place for you here. Are you feeling dangerous?
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/portal"
                className="group inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-600 to-red-700 px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(185,28,28,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400 hover:shadow-[0_16px_48px_rgba(185,28,28,0.32)]"
              >
                <span>Apply / Join BOG</span>
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>

              <Link
                href="/"
                className="group inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/12 bg-white/[0.045] px-7 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <span>Return Home</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style jsx>{`
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
    </main>
  );
}
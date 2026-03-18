"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

const pillars = [
  {
    title: "Discipline",
    text: "We do what needs to be done, especially when we do not feel like it. Standards come before mood.",
  },
  {
    title: "Brotherhood",
    text: "No man grows alone. We challenge, sharpen, and support each other through every season.",
  },
  {
    title: "Growth",
    text: "Physical, mental, spiritual, and professional growth are all part of the mission.",
  },
  {
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
      { threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-black text-white scroll-smooth">

      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo background"
            fill
            priority
            className="object-contain scale-125 opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black" />
        </div>

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="max-w-4xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-300">
              About BOG
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Built on Discipline.
              <br />
              Forged Through Brotherhood.
              <br />
              Driven by Growth.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              BOG exists to build stronger men through standards,
              accountability, challenge, and purpose.
            </p>

            <div className="mt-8 flex gap-3">
              <Link href="/portal" className="rounded-2xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-700">
                Join the Brotherhood
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <Reveal className="text-center mb-10">
            <h2 className="text-4xl font-black">The Pillars</h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 100}>
                <div className="p-6 border border-white/10 rounded-2xl bg-white/[0.03]">
                  <h3 className="text-xl font-bold">{pillar.title}</h3>
                  <p className="text-sm text-zinc-400 mt-2">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-24">
        <Reveal>
          <h2 className="text-5xl font-black">
            This is not for everyone.
            <br />
            But if you're ready—
          </h2>

          <div className="mt-8">
            <Link href="/portal" className="bg-red-600 px-8 py-4 rounded-2xl font-bold hover:bg-red-700">
              Apply / Join BOG
            </Link>
          </div>
        </Reveal>
      </section>

    </main>
  );
}

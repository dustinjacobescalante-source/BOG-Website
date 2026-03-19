import Image from "next/image";
import Link from "next/link";
import ClubCarousel from "@/components/home/ClubCarousel";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo background"
            fill
            className="object-contain scale-125 opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex max-w-3xl flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-gold/10 bg-gold/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-300">
              BOG Website + Member Platform
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Built for Men Who Refuse Average.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg lg:text-xl">
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

            <p className="mt-4 max-w-2xl text-base text-zinc-400">
              {site.quote}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Learn What We Stand For
              </Link>

              <Link
                href="/portal"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/5"
              >
                Enter the Brotherhood
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ClubCarousel />
    </>
  );
}

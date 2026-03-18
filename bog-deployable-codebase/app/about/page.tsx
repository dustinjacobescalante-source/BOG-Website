import Image from "next/image";
import Link from "next/link";

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

export default function AboutPage() {
  return (
    <main className="bg-black text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo background"
            fill
            priority
            className="object-contain scale-125 opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />
        </div>

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-300">
              About BOG
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Built on Discipline.
              <br />
              Forged Through Brotherhood.
              <br />
              Driven by Growth.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              BOG exists to build stronger men through standards, accountability,
              challenge, and purpose. This is not about image. It is about
              becoming the kind of man who can be trusted with responsibility,
              pressure, leadership, and service.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/portal"
                className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Join the Brotherhood
              </Link>
              <Link
                href="/"
                className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/5"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
              The Mission
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              We do not gather to coast.
              <br />
              We gather to become more.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-zinc-300">
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
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
              The Pillars
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Four things we do not compromise on
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="text-sm font-bold uppercase tracking-[0.24em] text-red-500">
                  Pillar
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {pillar.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
            The Standard
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            We show up.
            <br />
            We do the work.
            <br />
            We do not make excuses.
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
            Brotherhood means something only when it is backed by standards. We
            expect action, honesty, effort, humility, and a willingness to be
            sharpened.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
              What This Looks Like
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Real standards.
              <br />
              Real action.
            </h2>
          </div>

          <div className="grid gap-4">
            {standards.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-base text-zinc-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
              The Process
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              How it works
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-white/10 bg-black/30 p-6"
              >
                <div className="text-sm font-bold uppercase tracking-[0.24em] text-red-500">
                  {step.number}
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
            Who This Is For
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
            This is for men who are ready to be challenged.
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {[
              "Men tired of average",
              "Men ready to lead",
              "Men willing to be uncomfortable",
              "Men committed to growth",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-base text-zinc-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo background"
            fill
            className="object-contain scale-125 opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c49a6c]">
            Final Word
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            This is not for everyone.
            <br />
            But if you are ready,
            <br />
            step in.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            Brotherhood means more when it costs something. If you are ready to
            commit to growth, accountability, challenge, and purpose, there is a
            place for you here.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/portal"
              className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Apply / Join BOG
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/5"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

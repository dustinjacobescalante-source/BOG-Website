import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/cards';
import { Section } from '@/components/section';
import { site, codeItems, rankItems } from '@/lib/site';

const portalCards = [
  'Accountability Dashboard',
  'Meetings Center',
  'Document Library',
  'Member Directory',
  'Private Discussion Board',
  'Scholarship Review',
  'Merch Management',
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo background"
            fill
            className="object-contain opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex max-w-3xl flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-300">
              Public Website + Member Platform
            </div>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              A deployable platform built for the pack.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              {site.name} combines a public-facing brand presence with private member tools
              for accountability, meetings, scholarship management, merch, and brotherhood
              communication.
            </p>

            <p className="mt-4 max-w-2xl text-base text-zinc-400">{site.quote}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Explore BOG
              </Link>

              <Link
                href="/portal"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-white/5"
              >
                View Member Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section
        label="Platform"
        title="Everything the pack needs in one system"
        description="A public website backed by private member tools and admin workflows."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {portalCards.map((item) => (
            <Card key={item}>
              <div className="text-base font-semibold text-white">{item}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        label="The Code"
        title="Simple. Memorable. Non-negotiable."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {codeItems.map((item) => (
            <Card key={item}>
              <div className="text-base font-semibold text-white">{item}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        label="Ranks"
        title="You do not ask for rank. You earn it through behavior."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rankItems.map(([name, text]) => (
            <Card key={name}>
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
                Rank
              </div>
              <div className="mt-2 text-2xl font-black text-white">{name}</div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

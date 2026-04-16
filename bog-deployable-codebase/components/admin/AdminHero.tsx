import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type HeroAction = {
  href: string;
  label: string;
};

type AdminHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: HeroAction[];
};

export default function AdminHero({
  eyebrow,
  title,
  description,
  actions = [],
}: AdminHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#11141a_0%,#0b0d11_100%)] px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_30%)]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[3.25rem] lg:leading-[1]">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
            {description}
          </p>
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action, index) => (
              <Link
                key={`${action.href}-${action.label}`}
                href={action.href}
                className={
                  index === 0
                    ? "inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    : "inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                }
              >
                {action.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import {
  UserX,
  Shield,
  Hammer,
  Swords,
  Crown,
  ScrollText,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Section } from "@/components/section";
import { Card } from "@/components/cards";

type RankItem = {
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  role: string;
  purpose: string;
  requirements: string[];
  growth: string[];
  responsibilities?: string[];
  note?: string;
  rule?: string;
  tone: string;
};

const ranks: RankItem[] = [
  {
    name: "Lone Wolf",
    subtitle: "Unaffiliated / Observing",
    icon: <UserX className="h-5 w-5" />,
    role: "Allowed proximity, not belonging",
    purpose: "Learns the Code without representing it",
    requirements: [
      "Consistent presence",
      "No disruption to culture",
      "Accepts correction without defensiveness",
      "Does not speak for the pack",
    ],
    growth: [
      "Time + behavior",
      "Prove usefulness",
      "Earns chance to serve to become Omega",
    ],
    rule: "Lone Wolves don’t vote, lead, or recruit.",
    tone:
      "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]",
  },
  {
    name: "Omega",
    subtitle: "The New Wolf",
    icon: <Shield className="h-5 w-5" />,
    role: "Learner & Builder",
    purpose: "Survival and adaptation",
    requirements: [
      "Shows up consistently",
      "Listens more than talks",
      "Accepts correction without excuses",
      "Handles basic responsibilities",
    ],
    growth: [
      "Reliability over time",
      "Stops blaming circumstances",
      "Starts carrying weight for the pack",
    ],
    note: "Every pack needs Omegas. They either grow or leave.",
    tone:
      "border-blue-400/20 bg-[linear-gradient(180deg,rgba(37,99,235,0.16),rgba(255,255,255,0.02))]",
  },
  {
    name: "Beta",
    subtitle: "The Worker",
    icon: <Hammer className="h-5 w-5" />,
    role: "Contributor",
    purpose: "Execution and effort",
    requirements: [
      "Consistent attendance",
      "Keeps commitments",
      "Disciplined habits",
      "Trusted with small leadership tasks",
    ],
    growth: [
      "Does the work when no one is watching",
      "Helps others without seeking credit",
      "Stays steady under pressure",
    ],
    note: "Betas are the engine of the pack.",
    tone:
      "border-emerald-400/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),rgba(255,255,255,0.02))]",
  },
  {
    name: "Delta",
    subtitle: "The Enforcer",
    icon: <Swords className="h-5 w-5" />,
    role: "Protector & Standard Keeper",
    purpose: "Order and accountability",
    requirements: [
      "Proven consistency over time",
      "Emotional control",
      "Corrects others respectfully but firmly",
      "Leads by example",
    ],
    growth: [
      "Holds the line when it’s uncomfortable",
      "Protects culture over friendships",
      "Trusted by wolves at every level",
    ],
    note: "Deltas keep the pack safe from itself.",
    tone:
      "border-amber-400/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.12),rgba(255,255,255,0.02))]",
  },
  {
    name: "Alpha",
    subtitle: "The Leader",
    icon: <Crown className="h-5 w-5" />,
    role: "Direction & Decision-Maker",
    purpose: "Survival of the pack",
    requirements: [
      "Chosen, never self-appointed",
      "Servant leadership",
      "Puts pack before ego",
    ],
    growth: [],
    responsibilities: [
      "Sets vision",
      "Maintains standards",
      "Takes blame first, credit last",
      "Removes threats to the pack",
    ],
    note: "Alphas don’t dominate. They carry the heaviest load.",
    tone:
      "border-red-400/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.14),rgba(255,255,255,0.02))]",
  },
  {
    name: "Council",
    subtitle: "The Elders",
    icon: <ScrollText className="h-5 w-5" />,
    role: "Wisdom & Stewardship",
    purpose: "Long-term survival",
    requirements: [
      "Years of proven loyalty",
      "Emotional maturity",
      "Trusted judgment",
    ],
    growth: [],
    responsibilities: [
      "Advise Alphas",
      "Preserve culture",
      "Mentor future leaders",
    ],
    note: "Councils speak rarely. When they do, the pack listens.",
    tone:
      "border-violet-400/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.14),rgba(255,255,255,0.02))]",
  },
];

const ladder = [
  { name: "Lone Wolf", sub: "Observe", tone: "border-white/12 bg-white/[0.04]" },
  { name: "Omega", sub: "Learn", tone: "border-blue-400/20 bg-blue-500/10" },
  { name: "Beta", sub: "Work", tone: "border-emerald-400/20 bg-emerald-500/10" },
  { name: "Delta", sub: "Protect", tone: "border-amber-400/20 bg-amber-500/10" },
  { name: "Alpha", sub: "Lead", tone: "border-red-400/20 bg-red-500/10" },
  { name: "Council", sub: "Steward", tone: "border-violet-400/20 bg-violet-500/10" },
];

export default function Page() {
  return (
    <Section
      label="Ranks"
      title="Wolfpack Hierarchy"
      description="You don’t ask for rank. You earn it through behavior. Rank can be lost."
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,24,40,0.95),rgba(10,12,18,0.98))] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_28px_90px_rgba(0,0,0,0.45)]">
          <div className="grid gap-0 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.12),transparent_28%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Brotherhood Hierarchy
                </div>

                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">
                  Earn trust.
                  <br />
                  Carry weight.
                  <br />
                  Protect the pack.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Rank is not branding. It is proof of behavior. Each level in
                  the hierarchy reflects what a man can be trusted to carry,
                  protect, reinforce, and lead. Advancement is earned slowly and
                  can be lost quickly.
                </p>

                <div className="mt-8">
                  <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                    Progression Ladder
                  </div>

                  <div className="grid gap-3 md:grid-cols-6">
                    {ladder.map((item, index) => (
                      <div key={item.name} className="relative">
                        <div
                          className={`rounded-[22px] border px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${item.tone}`}
                        >
                          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Stage {index + 1}
                          </div>
                          <div className="mt-2 text-lg font-black text-white">
                            {item.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-300">
                            {item.sub}
                          </div>
                        </div>

                        {index < ladder.length - 1 && (
                          <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-white/25 to-transparent md:block" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(9,11,18,0.98))] p-6 sm:p-8 xl:border-l xl:border-t-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Rank Progression System
              </div>

              <div className="mt-5 rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_38%),rgba(16,18,28,0.92)] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                  Core Rule
                </div>
                <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                  You don’t ask for rank.
                  <br />
                  You earn it through behavior.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  No physical initiation. No self-awarding. No ego titles.
                  Advancement comes through time, tested steadiness, service,
                  correction, discipline, and the ability to put the pack above self.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Carry more, rise higher
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Leadership Standard
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Higher rank does not mean higher ego. It means more burden,
                  more responsibility, more visibility, and stricter alignment
                  with the Brotherhood standard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {ranks.map((rank) => (
            <Card
              key={rank.name}
              className={`overflow-hidden ${rank.tone} shadow-[0_14px_40px_rgba(0,0,0,0.22)]`}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {rank.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {rank.subtitle}
                    </div>
                    <div className="mt-1 text-3xl font-black leading-none tracking-tight text-white">
                      {rank.name}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-300">
                  <div>
                    <strong>Role:</strong> {rank.role}
                  </div>
                  <div className="mt-2">
                    <strong>Purpose:</strong> {rank.purpose}
                  </div>
                </div>

                {rank.requirements.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Requirements
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-300">
                      {rank.requirements.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rank.growth.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      How You Move Up
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-300">
                      {rank.growth.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rank.responsibilities && rank.responsibilities.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Responsibilities
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-300">
                      {rank.responsibilities.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rank.note && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5 text-sm leading-6 text-zinc-300">
                    {rank.note}
                  </div>
                )}

                {rank.rule && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3.5 text-sm leading-6 text-red-200">
                    {rank.rule}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_40%),linear-gradient(180deg,rgba(127,29,29,0.16),rgba(15,18,28,0.94))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
            <div className="flex items-center gap-2 text-red-300">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em]">
                Pack Law
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-white">
              Titles mean nothing without behavior.
            </h3>

            <ul className="mt-5 space-y-3 text-sm leading-7 text-red-100">
              <li>• Rank can be lost</li>
              <li>• Ego, laziness, or betrayal = demotion or removal</li>
              <li>• No wolf is bigger than the pack</li>
            </ul>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(22,28,42,0.96),rgba(10,12,18,0.98))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
              Closing Standard
            </div>
            <p className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              “The pack doesn’t rise by talent.
              <br />
              It survives by standards.”
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              The hierarchy only works when men live it. Standards protect the
              brotherhood, expose weakness, and keep leadership tied to
              service instead of image.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

import {
  Shield,
  Flame,
  Swords,
  Eye,
  Home,
  MessageSquareWarning,
  HandHeart,
  Cross,
  ScrollText,
  CheckCircle2,
} from "lucide-react";

import { Section } from "@/components/section";
import { Card } from "@/components/cards";

const codeItems = [
  {
    title: "Loyalty to the Pack",
    description:
      "I do not undermine, gossip, or betray. I protect the unity of the pack.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Discipline Before Comfort",
    description:
      "I choose routine, responsibility, and restraint over ease and excuses.",
    icon: <Flame className="h-5 w-5" />,
  },
  {
    title: "Strength With Control",
    description:
      "I build strength to serve and protect, never to intimidate or harm.",
    icon: <Swords className="h-5 w-5" />,
  },
  {
    title: "Accountability Without Ego",
    description:
      "I accept correction and give it privately, honestly, and respectfully.",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    title: "Family First",
    description:
      "I lead my home well. The pack never replaces my responsibility to family.",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Truth Over Approval",
    description:
      "I speak truth even when it costs comfort or popularity.",
    icon: <MessageSquareWarning className="h-5 w-5" />,
  },
  {
    title: "Service Over Status",
    description:
      "Rank exists to serve others, not to elevate self.",
    icon: <HandHeart className="h-5 w-5" />,
  },
  {
    title: "Faith and Humility",
    description:
      "I acknowledge I am not self-made. I submit to God’s authority and wisdom.",
    icon: <Cross className="h-5 w-5" />,
  },
];

export default function Page() {
  return (
    <Section
      label="Code"
      title="Code of the Buffalo Dogs"
      description="Broken men are welcome. Undisciplined men are corrected. Unwilling men are removed."
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,24,40,0.95),rgba(10,12,18,0.98))] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.10),transparent_24%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                  <ScrollText className="h-3.5 w-3.5" />
                  Brotherhood Standard
                </div>

                <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl">
                  Simple.
                  <br />
                  Memorable.
                  <br />
                  Non-negotiable.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  The Code of the Buffalo Dogs is not decoration. It is the
                  operating standard. These principles shape how men carry
                  themselves, how they treat one another, and how they hold the
                  line when comfort, ego, or weakness try to creep in.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Standard
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Clear
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      No confusion about what is expected from the men in this brotherhood.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Direction
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Strong
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Principles that guide action, correction, leadership, and restraint.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Purpose
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Brotherhood
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Built to strengthen men, protect the pack, and keep the culture clean.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(9,11,18,0.98))] p-6 sm:p-8 xl:border-l xl:border-t-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Closing Standard
              </div>

              <div className="mt-5 rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_38%),rgba(16,18,28,0.92)] p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                  Code Declaration
                </div>
                <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                  Broken men are welcome.
                  <br />
                  Undisciplined men are corrected.
                  <br />
                  Unwilling men are removed.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  This brotherhood is not built on passivity, excuses, or shallow
                  belonging. It is built on standards, correction, humility, and
                  the willingness to grow.
                </p>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      What this means
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      The Code is not just for reading. It is for applying. A man
                      should be able to look at these eight points and know where
                      he stands.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
          {codeItems.map((item, index) => (
            <Card key={item.title}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {index + 1}. Code Standard
                    </div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.18)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
            Final Reminder
          </div>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-200">
            Titles mean nothing without behavior. The Code exists to be lived,
            not admired. A brotherhood without standards becomes noise. A
            brotherhood with standards becomes a force.
          </p>
        </div>
      </div>
    </Section>
  );
}

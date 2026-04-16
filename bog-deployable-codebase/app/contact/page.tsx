import {
  Mail,
  ShieldCheck,
  Users,
  ArrowRight,
  Globe,
  UserRound,
  CheckCircle2,
} from "lucide-react";

import { Section } from "@/components/section";
import { Card } from "@/components/cards";
import { JoinForm } from "@/components/forms/join-form";

const contactItems = [
  {
    label: "Club Email",
    value: "BOGBuffalodogs@gmail.com",
    icon: <Mail className="h-5 w-5" />,
    description: "Primary contact for Brotherhood communication and public inquiries.",
    tone:
      "border-blue-400/20 bg-[linear-gradient(180deg,rgba(37,99,235,0.16),rgba(255,255,255,0.02))]",
  },
  {
    label: "Leadership Contact",
    value: "BOGDustinE@gmail.com",
    icon: <UserRound className="h-5 w-5" />,
    description: "Direct leadership contact for serious questions and next-step conversations.",
    tone:
      "border-red-400/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.14),rgba(255,255,255,0.02))]",
  },
  {
    label: "Website Domain",
    value: "TheBuffaloDogs.com",
    icon: <Globe className="h-5 w-5" />,
    description: "Digital front door for the Brotherhood and member-facing platform.",
    tone:
      "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]",
  },
];

export default function Page() {
  return (
    <Section
      label="Contact"
      title="Contact BOG"
      description="Public contact and join flow."
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,24,40,0.95),rgba(10,12,18,0.98))] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_28px_90px_rgba(0,0,0,0.45)]">
          <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.12),transparent_28%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                  <Users className="h-3.5 w-3.5" />
                  Brotherhood Entry Point
                </div>

                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">
                  Reach out.
                  <br />
                  Step forward.
                  <br />
                  Start clean.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  The contact page is not just a message board. It is the first
                  gate. Men who reach out should do it with clarity, honesty,
                  and intention. Brotherhood starts with how you present
                  yourself before you ever enter the room.
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
                      Send your request with direct information and real purpose.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Process
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Intentional
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Joining starts with interest, then review, then approval.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Culture
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Strong
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Brotherhood is built by standards, not random access.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(9,11,18,0.98))] p-6 sm:p-8 xl:border-l xl:border-t-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Join Flow
              </div>

              <div className="mt-5 rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_38%),rgba(16,18,28,0.92)] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.28)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                  First Step
                </div>
                <h3 className="mt-3 text-3xl font-black leading-tight text-white">
                  Show interest.
                  <br />
                  Respect the process.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Submit a clean request. If there is alignment, the next step
                  is review and conversation. Access is not assumed — it is
                  considered.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Apply below
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Approval-based access
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      Every join request should be reviewed with care so the
                      Brotherhood stays aligned, intentional, and protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-4">
            {contactItems.map((item) => (
              <Card
                key={item.label}
                className={`overflow-hidden shadow-[0_14px_40px_rgba(0,0,0,0.22)] ${item.tone}`}
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-3 break-words text-xl font-black text-white">
                      {item.value}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                Contact Reminder
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                IF your ready to take the next step reach out to BOG.
                Let the process do the rest.
              </p>
            </Card>
          </div>

          <Card className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(18,22,34,0.96),rgba(10,12,18,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Apply / Join
                </div>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
                  Submit an Interest Request
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Send your request to start the approval process. Be clear
                  about who you are, why you are reaching out, and what kind of
                  step you are asking to take.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
                <JoinForm />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

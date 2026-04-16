import {
  Award,
  GraduationCap,
  FileText,
  ScrollText,
  Mail,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { Section } from "@/components/section";
import { Card } from "@/components/cards";
import { ScholarshipForm } from "@/components/forms/scholarship-form";

const requirements = [
  {
    title: "Minimum 3.0 GPA",
    description: "Applicants must currently meet or exceed a 3.0 GPA standard.",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: "College or trade school eligible",
    description: "This scholarship supports both college and trade school paths.",
    icon: <Award className="h-5 w-5" />,
  },
  {
    title: "Application required",
    description: "Every applicant must complete the full scholarship submission form.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "500–750 word essay",
    description: "Applicants must submit a thoughtful essay responding to the prompt selected.",
    icon: <ScrollText className="h-5 w-5" />,
  },
  {
    title: "Recommendation letter",
    description: "A recommendation letter is required as part of the submission package.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: "Official transcript",
    description: "Applicants must provide an official transcript for review.",
    icon: <GraduationCap className="h-5 w-5" />,
  },
];

export default function Page() {
  return (
    <Section
      label="Scholarship"
      title="Iron Sharpens Iron Scholarship"
      description="A public scholarship page with a premium submission experience aligned with the Brotherhood standard."
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,24,40,0.95),rgba(10,12,18,0.98))] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.10),transparent_24%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                  <Award className="h-3.5 w-3.5" />
                  Scholarship Opportunity
                </div>

                <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl">
                  Invest in the next
                  <br />
                  generation with
                  <br />
                  intention.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  The Iron Sharpens Iron Scholarship is built to support students
                  who show discipline, direction, and a willingness to keep
                  building. This is not just financial support — it is a vote of
                  confidence in the kind of person the applicant is becoming.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Award Type
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Scholarship
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Built to support future college or trade school students.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Eligibility
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      3.0 GPA
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Applicants must meet the academic minimum to be considered.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Submission
                    </div>
                    <div className="mt-2 text-xl font-black text-white">
                      Full Packet
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Form, essay, recommendation, and transcript all matter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(9,11,18,0.98))] p-6 sm:p-8 xl:border-l xl:border-t-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Submission Contact
              </div>

              <div className="mt-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                    <Mail className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      Scholarship Email
                    </div>
                    <div className="mt-1 text-sm text-slate-300 break-all">
                      BOGBuffalodogs@gmail.com
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_38%),rgba(16,18,28,0.92)] p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                  What We Value
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">
                  Discipline over hype.
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  This scholarship is meant to recognize students with real
                  effort, real direction, and real intent. We are looking for
                  more than a résumé. We are looking for substance.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Submit below
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.96fr]">
          <Card>
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Requirements
                </div>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
                  Scholarship Standards
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Before submitting, make sure the full application package is
                  complete. Incomplete submissions weaken the process and may not
                  be considered.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {requirements.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                        {item.icon}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">
                          {item.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Submission Reminder
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Applicants should submit a clean, complete package. Strong
                  applications reflect both preparation and character.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                  <FileText className="h-3.5 w-3.5" />
                  Application Form
                </div>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
                  Apply for Review
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Fill out the application carefully. The quality of the
                  submission should reflect the seriousness of the applicant.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
                <ScholarshipForm />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

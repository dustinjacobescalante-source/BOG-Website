import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Clock3,
  GraduationCap,
  Mail,
  ShieldCheck,
  UserRound,
  FileText,
  ArrowRight,
  Trophy,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";

function formatDate(date?: string | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusTone(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "approved" || value === "accepted") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (value === "denied" || value === "rejected") {
    return "border-red-400/20 bg-red-500/10 text-red-300";
  }

  return "border-amber-400/20 bg-amber-500/10 text-amber-300";
}

function getStatusLabel(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "approved" || value === "accepted") return "Approved";
  if (value === "denied" || value === "rejected") return "Denied";
  return "Pending";
}

function getSafeScore(score?: number | null) {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  return score;
}

export default async function AdminScholarshipPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: applications, error } = await supabase
    .from("scholarship_applications")
    .select(
      `
      id,
      student_name,
      email,
      status,
      created_at,
      review_notes,
      total_score,
      essay_score,
      character_score,
      leadership_score,
      work_ethic_score,
      academic_score
    `
    )
    .order("created_at", { ascending: false });

  const allApplications = applications ?? [];

  const applicationsWithCalculatedScores = allApplications.map((app) => {
    const calculatedScore =
      getSafeScore(app.essay_score) +
      getSafeScore(app.character_score) +
      getSafeScore(app.leadership_score) +
      getSafeScore(app.work_ethic_score) +
      getSafeScore(app.academic_score);

    return {
      ...app,
      display_score:
        getSafeScore(app.total_score) > 0
          ? getSafeScore(app.total_score)
          : calculatedScore,
    };
  });

  const totalApplications = applicationsWithCalculatedScores.length;

  const pendingCount = applicationsWithCalculatedScores.filter(
    (app) => (app.status ?? "").toLowerCase() === "pending"
  ).length;

  const approvedCount = applicationsWithCalculatedScores.filter((app) => {
    const status = (app.status ?? "").toLowerCase();
    return status === "approved" || status === "accepted";
  }).length;

  const deniedCount = applicationsWithCalculatedScores.filter((app) => {
    const status = (app.status ?? "").toLowerCase();
    return status === "denied" || status === "rejected";
  }).length;

  const reviewedCount = applicationsWithCalculatedScores.filter(
    (app) => !!app.review_notes && app.review_notes.trim().length > 0
  ).length;

  const highestScore = applicationsWithCalculatedScores.reduce((max, app) => {
    return Math.max(max, app.display_score);
  }, 0);

  const featuredApplication = applicationsWithCalculatedScores[0] ?? null;

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Review submissions. Protect the standard."
        description="Monitor scholarship applications, track review status, compare rubric scores, and keep the selection process clean and aligned with the standard behind the award."
        actions={[
          { href: "/admin", label: "Back to Dashboard" },
          { href: "/scholarship", label: "View Public Scholarship Page" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_32%),rgba(10,14,25,0.9)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-200">
            Scholarship Command
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl xl:text-6xl">
              Review carefully.
              <br />
              Score clearly.
              <br />
              Protect the process.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is your scholarship review board. Track incoming
              applications, monitor status, compare rubric scores, and keep the
              selection process clean and aligned with the standard behind the
              award.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Total Applications
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {totalApplications}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Scholarship submissions currently stored in the system.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Pending Review
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {pendingCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Applications still waiting for admin review.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Approved
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {approvedCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Applications already moved forward.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Review Notes Added
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {reviewedCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Applications with admin notes already saved.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Highest Score
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {highestScore}
                <span className="ml-1 text-base text-slate-400">/100</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Top rubric score currently saved on the board.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_38%),rgba(16,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-200">
              Priority Read
            </div>
            <h3 className="mt-3 text-2xl font-black text-white">
              {pendingCount > 0
                ? "Pending applications need review."
                : "Review queue is currently clear."}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {pendingCount > 0
                ? `${pendingCount} application${
                    pendingCount === 1 ? "" : "s"
                  } still waiting for admin action.`
                : "There are no scholarship applications currently waiting for review."}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
              Scholarship review should feel deliberate. Clear titles, clear
              status, visible scoring, and a structured pipeline make the
              process easier to trust and easier to manage.
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Latest Submission
            </div>

            {featuredApplication ? (
              <>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {featuredApplication.student_name || "Unnamed Applicant"}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{featuredApplication.email || "No email provided"}</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                      featuredApplication.status
                    )}`}
                  >
                    {getStatusLabel(featuredApplication.status)}
                  </span>

                  {featuredApplication.review_notes?.trim() ? (
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      Notes Added
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Submitted
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {formatDate(featuredApplication.created_at)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Score
                    </div>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {featuredApplication.display_score} / 100
                    </p>
                  </div>
                </div>

                <div className="mt-5 break-all text-xs text-slate-500">
                  Review Path: /admin/scholarship/{featuredApplication.id}
                </div>

                <a
                  href={`/admin/scholarship/${featuredApplication.id}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  Open Review
                  <ArrowRight className="h-4 w-4" />
                </a>
              </>
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-300">
                No scholarship submissions yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <AdminSection
        eyebrow="Scholarship Board"
        title="Manage Scholarship Applications"
        description="Open each application to review notes, files, rubric scores, and decision status."
      >
        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            Failed to load scholarship applications.
          </div>
        ) : null}

        {!error && !applicationsWithCalculatedScores.length ? (
          <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 text-sm text-zinc-400">
            No scholarship applications found.
          </div>
        ) : null}

        <div className="space-y-4">
          {applicationsWithCalculatedScores.map((app) => {
            const hasReviewNotes =
              !!app.review_notes && app.review_notes.trim().length > 0;
            const reviewHref = `/admin/scholarship/${app.id}`;

            return (
              <div
                key={app.id}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0 xl:max-w-[520px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                          app.status
                        )}`}
                      >
                        {getStatusLabel(app.status)}
                      </span>

                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Application Record
                      </span>

                      {hasReviewNotes ? (
                        <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                          Notes Added
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 text-2xl font-black text-white">
                      {app.student_name || "Unnamed Applicant"}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate">
                        {app.email || "No email provided"}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <Clock3 className="h-4 w-4" />
                      <span>Submitted {formatDate(app.created_at)}</span>
                    </div>

                    <div className="mt-3 break-all text-xs text-slate-500">
                      Review Path: {reviewHref}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 xl:min-w-[620px]">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <UserRound className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Applicant
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {app.student_name || "Unnamed"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <BadgeCheck className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Status
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {getStatusLabel(app.status)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Trophy className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Score
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {app.display_score} / 100
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                          Review
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white">
                        {hasReviewNotes ? "Notes Saved" : "No Notes Yet"}
                      </div>
                    </div>

                    <div className="flex items-stretch">
                      <a
                        href={reviewHref}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                      >
                        Open Review
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
            <div>
              <div className="text-sm font-semibold text-white">
                Scholarship review board is active
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Applications now show status, notes, and total rubric scores
                more clearly, making it easier to compare applicants at a
                glance.
              </p>
            </div>
          </div>
        </div>
      </AdminSection>
    </AdminPageShell>
  );
}
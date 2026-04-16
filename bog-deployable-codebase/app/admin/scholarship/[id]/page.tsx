import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";

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

  if (value === "archived") {
    return "border-slate-400/20 bg-slate-500/10 text-slate-300";
  }

  return "border-amber-400/20 bg-amber-500/10 text-amber-300";
}

function getStatusLabel(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "approved" || value === "accepted") return "Approved";
  if (value === "denied" || value === "rejected") return "Denied";
  if (value === "archived") return "Archived";
  return "Pending";
}

function clampScore(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(min, Math.min(max, value));
}

async function updateScholarshipApplication(id: string, formData: FormData) {
  "use server";

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

  const status = String(formData.get("status") ?? "pending").trim();
  const review_notes = String(formData.get("review_notes") ?? "").trim();

  const essay_score = clampScore(Number(formData.get("essay_score") ?? 0), 0, 40);
  const character_score = clampScore(
    Number(formData.get("character_score") ?? 0),
    0,
    20
  );
  const leadership_score = clampScore(
    Number(formData.get("leadership_score") ?? 0),
    0,
    10
  );
  const work_ethic_score = clampScore(
    Number(formData.get("work_ethic_score") ?? 0),
    0,
    20
  );
  const academic_score = clampScore(
    Number(formData.get("academic_score") ?? 0),
    0,
    10
  );

  const total_score =
    essay_score +
    character_score +
    leadership_score +
    work_ethic_score +
    academic_score;

  const { error } = await supabase
    .from("scholarship_applications")
    .update({
      status,
      review_notes: review_notes || null,
      essay_score,
      character_score,
      leadership_score,
      work_ethic_score,
      academic_score,
      total_score,
    })
    .eq("id", id);

  if (error) {
    console.error("updateScholarshipApplication error:", error);
    throw new Error(`Failed to update application: ${error.message}`);
  }

  revalidatePath("/admin/scholarship");
  revalidatePath(`/admin/scholarship/${id}`);
}

async function archiveScholarshipApplication(id: string) {
  "use server";

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

  const { error } = await supabase
    .from("scholarship_applications")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) {
    console.error("archiveScholarshipApplication error:", error);
    throw new Error(`Failed to archive application: ${error.message}`);
  }

  revalidatePath("/admin/scholarship");
  revalidatePath(`/admin/scholarship/${id}`);
  redirect("/admin/scholarship");
}

async function restoreScholarshipApplication(id: string) {
  "use server";

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

  const { error } = await supabase
    .from("scholarship_applications")
    .update({ status: "pending" })
    .eq("id", id);

  if (error) {
    console.error("restoreScholarshipApplication error:", error);
    throw new Error(`Failed to restore application: ${error.message}`);
  }

  revalidatePath("/admin/scholarship");
  revalidatePath(`/admin/scholarship/${id}`);
  redirect("/admin/scholarship");
}

export default async function AdminScholarshipReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const { data: app } = await supabase
    .from("scholarship_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!app) {
    notFound();
  }

  const totalScore =
    (app.essay_score ?? 0) +
    (app.character_score ?? 0) +
    (app.leadership_score ?? 0) +
    (app.work_ethic_score ?? 0) +
    (app.academic_score ?? 0);

  const isArchived = (app.status ?? "").toLowerCase() === "archived";

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="Scholarship Review"
        title={app.student_name || "Applicant"}
        description="Review the full application, score the rubric, save notes, update the decision, archive the application, or restore it back to the active board."
        actions={[
          { href: "/admin/scholarship", label: "Back to Applications" },
          { href: "/scholarship", label: "View Public Scholarship Page" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
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

              {isArchived ? (
                <span className="inline-flex items-center rounded-full border border-slate-400/20 bg-slate-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Hidden from active board
                </span>
              ) : null}
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">Applicant Info</h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Name
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {app.student_name || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Email
                </div>
                <div className="mt-2 break-all text-sm font-semibold text-white">
                  {app.email || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Phone
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {app.phone || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  School
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {app.school_name || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  GPA
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {app.gpa ?? "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Intended Path
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {app.intended_path || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Submitted
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {formatDate(app.created_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
            <h3 className="text-lg font-bold text-white">Essay Prompt</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
              {app.essay_prompt || "No essay prompt selected."}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
            <h3 className="text-lg font-bold text-white">
              Activities, Leadership, and Work Experience
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
              {app.activities || "No activities provided."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
            <h3 className="text-lg font-bold text-white">Application Files</h3>

            <div className="mt-4 space-y-3">
              {app.essay_file_url ? (
                <a
                  href={app.essay_file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Open Essay File
                </a>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                  No essay file uploaded.
                </div>
              )}

              {app.recommendation_file_url ? (
                <a
                  href={app.recommendation_file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Open Recommendation Letter
                </a>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                  No recommendation letter uploaded.
                </div>
              )}

              {app.transcript_file_url ? (
                <a
                  href={app.transcript_file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Open Transcript
                </a>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                  No transcript uploaded.
                </div>
              )}
            </div>
          </div>

          <form
            action={updateScholarshipApplication.bind(null, id)}
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
          >
            <h3 className="text-lg font-bold text-white">Application Review</h3>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Total Score
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {totalScore}
                <span className="ml-1 text-base text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Essay Depth &amp; Clarity (0–40)
                </label>
                <input
                  type="number"
                  name="essay_score"
                  min="0"
                  max="40"
                  defaultValue={app.essay_score ?? 0}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Evidence of Character (0–20)
                </label>
                <input
                  type="number"
                  name="character_score"
                  min="0"
                  max="20"
                  defaultValue={app.character_score ?? 0}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Leadership Demonstrated (0–10)
                </label>
                <input
                  type="number"
                  name="leadership_score"
                  min="0"
                  max="10"
                  defaultValue={app.leadership_score ?? 0}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Work Ethic (0–20)
                </label>
                <input
                  type="number"
                  name="work_ethic_score"
                  min="0"
                  max="20"
                  defaultValue={app.work_ethic_score ?? 0}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Academic Achievement (0–10)
                </label>
                <input
                  type="number"
                  name="academic_score"
                  min="0"
                  max="10"
                  defaultValue={app.academic_score ?? 0}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-white">
                Review Notes
              </label>
              <textarea
                name="review_notes"
                defaultValue={app.review_notes ?? ""}
                rows={8}
                placeholder="Add admin notes, committee comments, decision reasons, or follow-up items..."
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-white/20"
              />
            </div>

            <div className="mt-5">
              <div className="mb-3 text-sm font-medium text-white">
                Current Status
              </div>
              <div className="text-sm text-slate-300">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                    app.status
                  )}`}
                >
                  {getStatusLabel(app.status)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="submit"
                name="status"
                value="approved"
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Save Review + Approve
              </button>

              <button
                type="submit"
                name="status"
                value="denied"
                className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Save Review + Deny
              </button>

              <button
                type="submit"
                name="status"
                value="pending"
                className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                Save Review + Set Pending
              </button>
            </div>
          </form>

          {!isArchived ? (
            <form
              action={archiveScholarshipApplication.bind(null, id)}
              className="rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_40%),linear-gradient(180deg,rgba(24,14,16,0.95),rgba(14,10,12,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                Archive Application
              </div>

              <h3 className="mt-3 text-lg font-bold text-white">
                Remove this application from the active board
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                This will not permanently delete the record. It will mark the
                application as archived and remove it from the main scholarship
                review list.
              </p>

              <button
                type="submit"
                className="mt-5 w-full rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/25"
              >
                Archive Application
              </button>
            </form>
          ) : (
            <form
              action={restoreScholarshipApplication.bind(null, id)}
              className="rounded-[28px] border border-emerald-400/20 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_40%),linear-gradient(180deg,rgba(12,24,18,0.95),rgba(10,14,12,0.98))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                Restore Application
              </div>

              <h3 className="mt-3 text-lg font-bold text-white">
                Return this application to the active board
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                This will change the status back to pending and make the
                application visible again in the active scholarship review list.
              </p>

              <button
                type="submit"
                className="mt-5 w-full rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25"
              >
                Restore to Pending
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}

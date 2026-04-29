import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  CalendarDays,
  Eye,
  PlusCircle,
  Save,
  SquarePen,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { notifyActiveMembers } from "@/lib/member-notifications";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import AccordionSection from "@/components/ui/AccordionSection";

async function saveMeeting(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const arrival_silent_transition = String(
    formData.get("arrival_silent_transition") ?? ""
  ).trim();
  const opening_anchor = String(formData.get("opening_anchor") ?? "").trim();
  const code_standard_reaffirmation = String(
    formData.get("code_standard_reaffirmation") ?? ""
  ).trim();
  const ownership_round = String(formData.get("ownership_round") ?? "").trim();
  const council_reflection = String(
    formData.get("council_reflection") ?? ""
  ).trim();
  const practical_alignment_block = String(
    formData.get("practical_alignment_block") ?? ""
  ).trim();
  const open_business = String(formData.get("open_business") ?? "").trim();
  const commitment_declarations = String(
    formData.get("commitment_declarations") ?? ""
  ).trim();
  const closing_anchor = String(formData.get("closing_anchor") ?? "").trim();
  const post_meeting_notes = String(
    formData.get("post_meeting_notes") ?? ""
  ).trim();

  const meeting_date = String(formData.get("meeting_date") ?? "");
  const next_meeting_date = String(formData.get("next_meeting_date") ?? "");
  const status = String(formData.get("status") ?? "draft");

  if (!title) return;

  const result = await supabase
    .from("meetings")
    .insert({
      title,
      meeting_date: meeting_date || null,
      next_meeting_date: next_meeting_date || null,
      status,
      arrival_silent_transition: arrival_silent_transition || null,
      opening_anchor: opening_anchor || null,
      code_standard_reaffirmation: code_standard_reaffirmation || null,
      ownership_round: ownership_round || null,
      council_reflection: council_reflection || null,
      practical_alignment_block: practical_alignment_block || null,
      open_business: open_business || null,
      commitment_declarations: commitment_declarations || null,
      closing_anchor: closing_anchor || null,
      post_meeting_notes: post_meeting_notes || null,
    })
    .select("id, title, status, meeting_date")
    .single();

  if (result.error) {
    console.error("saveMeeting error:", result.error);
    return;
  }

  if (result.data?.status === "published") {
    await notifyActiveMembers({
      type: "meetings",
      subject: "New BOG Meeting Posted",
      heading: "New Meeting Posted",
      message: `A new BOG meeting has been posted: ${result.data.title}.`,
      buttonLabel: "View Meeting",
      buttonUrl: `/portal/meetings/${result.data.id}`,
    });
  }

  revalidatePath("/admin/meetings");
  revalidatePath("/portal/meetings");
}

async function deleteMeeting(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  if (!id) return;

  const result = await supabase.from("meetings").delete().eq("id", id);

  if (result.error) {
    console.error("deleteMeeting error:", result.error);
    return;
  }

  revalidatePath("/admin/meetings");
  revalidatePath("/portal/meetings");
}

function formatDateTime(date?: string | null) {
  if (!date) return "Not scheduled";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getPreviewText(meeting: {
  arrival_silent_transition: string | null;
  opening_anchor: string | null;
  code_standard_reaffirmation: string | null;
  ownership_round: string | null;
  council_reflection: string | null;
  practical_alignment_block: string | null;
  open_business: string | null;
  commitment_declarations: string | null;
  closing_anchor: string | null;
  post_meeting_notes: string | null;
}) {
  return (
    meeting.opening_anchor ||
    meeting.practical_alignment_block ||
    meeting.open_business ||
    meeting.code_standard_reaffirmation ||
    meeting.arrival_silent_transition ||
    meeting.ownership_round ||
    meeting.council_reflection ||
    meeting.commitment_declarations ||
    meeting.closing_anchor ||
    meeting.post_meeting_notes ||
    "No agenda preview available yet."
  );
}

export default async function AdminMeetingsPage() {
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

  const { data: meetings, error } = await supabase
    .from("meetings")
    .select(
      `
        id,
        title,
        meeting_date,
        next_meeting_date,
        status,
        arrival_silent_transition,
        opening_anchor,
        code_standard_reaffirmation,
        ownership_round,
        council_reflection,
        practical_alignment_block,
        open_business,
        commitment_declarations,
        closing_anchor,
        post_meeting_notes
      `
    )
    .order("meeting_date", { ascending: false });

  const allMeetings = meetings ?? [];
  const publishedCount = allMeetings.filter(
    (meeting) => meeting.status === "published"
  ).length;
  const draftCount = allMeetings.filter(
    (meeting) => meeting.status === "draft"
  ).length;
  const totalMeetings = allMeetings.length;
  const featuredMeeting = allMeetings[0] ?? null;

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Build the agenda. Control the room."
        description="Create meetings, structure the flow, publish what members need to see, and keep the brotherhood aligned before the meeting begins."
        actions={[
          { href: "/admin", label: "Back to Dashboard" },
          { href: "/portal/meetings", label: "View Member Meetings" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_32%),rgba(10,14,25,0.9)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-200">
            Meeting Command
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl xl:text-6xl">
              Plan clearly.
              <br />
              Publish intentionally.
              <br />
              Lead the meeting before it starts.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is your meeting control system. Build the agenda, control the
              sequence, and decide exactly what members can review before they
              step into the room.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Total Meetings
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {totalMeetings}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Total agenda records currently inside the platform.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Published
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {publishedCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Agendas currently visible to members in the portal.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Drafts
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {draftCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Meeting drafts still waiting to be finalized or published.
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
              {draftCount > 0
                ? "Draft meetings still need attention."
                : "Meeting board is under control."}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {draftCount > 0
                ? `${draftCount} draft meeting${
                    draftCount === 1 ? "" : "s"
                  } still waiting for final review or publication.`
                : "No meeting drafts are currently waiting for action."}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
              Keep published agendas clean and intentional. Members should only
              see what is ready to support the standard of the meeting.
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Featured Meeting
            </div>

            {featuredMeeting ? (
              <>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {featuredMeeting.title}
                </h3>

                <div className="mt-3 text-sm text-slate-300">
                  Meeting: {formatDateTime(featuredMeeting.meeting_date)}
                </div>

                {featuredMeeting.next_meeting_date && (
                  <div className="mt-1 text-sm text-slate-400">
                    Next Meeting:{" "}
                    {formatDateTime(featuredMeeting.next_meeting_date)}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      featuredMeeting.status === "published"
                        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                        : featuredMeeting.status === "archived"
                          ? "border-zinc-400/20 bg-zinc-500/10 text-zinc-300"
                          : "border-amber-400/20 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {featuredMeeting.status}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Agenda Preview
                  </div>
                  <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {getPreviewText(featuredMeeting)}
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-300">
                No meetings available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminSection
          eyebrow="Meeting Builder"
          title="Create New Meeting"
          description="Build the next meeting agenda, set the date, and choose its visibility."
        >
          <div className="mb-4 rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="flex items-start gap-3">
              <PlusCircle className="mt-0.5 h-5 w-5 text-slate-300" />
              <div>
                <div className="text-sm font-semibold text-white">
                  Meeting creation is live
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Complete the agenda below, choose draft or published status,
                  and save the record into the admin system.
                </p>
              </div>
            </div>
          </div>

          <form action={saveMeeting} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Title
              </label>
              <input
                name="title"
                placeholder="Brotherhood Meeting"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20"
                required
              />
            </div>

            <AccordionSection title="Opening" defaultOpen>
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Arrival &amp; Silent Transition
                </label>
                <textarea
                  name="arrival_silent_transition"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Opening Anchor
                </label>
                <textarea
                  name="opening_anchor"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>
            </AccordionSection>

            <AccordionSection title="Core Meeting Flow">
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Code &amp; Standard Reaffirmation
                </label>
                <textarea
                  name="code_standard_reaffirmation"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Ownership Round
                </label>
                <textarea
                  name="ownership_round"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Council Reflection
                </label>
                <textarea
                  name="council_reflection"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Practical Alignment Block
                </label>
                <textarea
                  name="practical_alignment_block"
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Open Business
                </label>
                <textarea
                  name="open_business"
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>
            </AccordionSection>

            <AccordionSection title="Closing">
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Commitment Declarations
                </label>
                <textarea
                  name="commitment_declarations"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Closing Anchor
                </label>
                <textarea
                  name="closing_anchor"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>
            </AccordionSection>

            <AccordionSection title="Post Meeting">
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Post-Meeting Notes
                </label>
                <textarea
                  name="post_meeting_notes"
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>
            </AccordionSection>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Meeting Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  name="meeting_date"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Next Meeting Date
                </label>
                <input
                  type="datetime-local"
                  name="next_meeting_date"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Status
              </label>
              <select
                name="status"
                defaultValue="draft"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#f26a3d]/30 bg-[#f26a3d] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Save Meeting
            </button>
          </form>
        </AdminSection>

        <AdminSection
          eyebrow="Meeting Board"
          title="Existing Meetings"
          description="Review meeting status, open full editing, and remove records when needed."
        >
          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              Failed to load meetings.
            </div>
          ) : null}

          {!error && !allMeetings.length ? (
            <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 text-sm text-zinc-400">
              No meetings created yet.
            </div>
          ) : null}

          <div className="space-y-4">
            {allMeetings.map((meeting) => {
              const statusTone =
                meeting.status === "published"
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                  : meeting.status === "archived"
                    ? "border-zinc-400/20 bg-zinc-500/10 text-zinc-300"
                    : "border-amber-400/20 bg-amber-500/10 text-amber-300";

              const previewText = getPreviewText(meeting);

              return (
                <div
                  key={meeting.id}
                  className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.95),rgba(10,12,18,0.98))] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusTone}`}
                    >
                      {meeting.status}
                    </span>

                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      Meeting Record
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-white">
                    {meeting.title}
                  </h3>

                  <div className="mt-3 text-sm text-slate-300">
                    Meeting: {formatDateTime(meeting.meeting_date)}
                  </div>

                  {meeting.next_meeting_date && (
                    <div className="mt-1 text-sm text-slate-400">
                      Next Meeting: {formatDateTime(meeting.next_meeting_date)}
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Agenda Preview
                    </div>
                    <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {previewText}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/admin/meetings/${meeting.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                    >
                      <SquarePen className="h-4 w-4" />
                      Edit Meeting
                    </Link>

                    <Link
                      href={`/portal/meetings/${meeting.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      View in Portal
                    </Link>

                    <form action={deleteMeeting}>
                      <input type="hidden" name="id" value={meeting.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminSection>
      </section>
    </AdminPageShell>
  );
}

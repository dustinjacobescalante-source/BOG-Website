import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  Save,
  Trash2,
  Eye,
  SquarePen,
  Radio,
  MonitorPlay,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import MeetingAttachmentUpload from "@/components/meetings/MeetingAttachmentUpload";

const APP_TIME_ZONE = "America/Chicago";

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  return asUtc - date.getTime();
}

function dateTimeLocalToTimeZoneIso(
  value: string,
  timeZone: string = APP_TIME_ZONE
) {
  if (!value) return null;

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );

  if (!match) return null;

  const [, year, month, day, hour, minute, second = "00"] = match;

  const utcGuessMs = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );

  const utcGuess = new Date(utcGuessMs);
  const firstOffset = getTimeZoneOffsetMs(utcGuess, timeZone);

  let corrected = new Date(utcGuessMs - firstOffset);

  const secondOffset = getTimeZoneOffsetMs(corrected, timeZone);

  if (secondOffset !== firstOffset) {
    corrected = new Date(utcGuessMs - secondOffset);
  }

  return corrected.toISOString();
}

function toDateTimeLocalValue(
  date?: string | null,
  timeZone: string = APP_TIME_ZONE
) {
  if (!date) return "";

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date(date));
  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
}

async function sendMeetingPublishedEmails(
  supabase: any,
  title: string,
  meetingId: string
) {
  try {
    const { data: members } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("is_active", true);

    if (!members?.length) return;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.thebuffalodogs.com";

    for (const member of members) {
      if (!member.email) continue;

      await fetch(`${siteUrl}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: member.email,
          subject: `New BOG Meeting Published: ${title}`,
          html: `
            <div style="font-family:Arial;padding:24px;color:#111;">
              <h2>New Meeting Published</h2>
              <p>${member.full_name || "Brother"}, a new meeting has been posted.</p>
              <p><strong>${title}</strong></p>
              <p>
                <a href="${siteUrl}/portal/meetings/${meetingId}">
                  Open Meeting
                </a>
              </p>
            </div>
          `,
        }),
      });
    }
  } catch (error) {
    console.error("meeting publish email error:", error);
  }
}

async function updateMeeting(id: string, formData: FormData) {
  "use server";

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("meetings")
    .select("status")
    .eq("id", id)
    .single();

  const previousStatus = existing?.status ?? "draft";

  const title = String(formData.get("title") ?? "").trim();
  const meeting_date_input = String(formData.get("meeting_date") ?? "");
  const next_meeting_date_input = String(formData.get("next_meeting_date") ?? "");
  const status = String(formData.get("status") ?? "draft");

  const meeting_date = dateTimeLocalToTimeZoneIso(meeting_date_input);
  const next_meeting_date =
    dateTimeLocalToTimeZoneIso(next_meeting_date_input);

  const { error } = await supabase
    .from("meetings")
    .update({
      title,
      meeting_date,
      next_meeting_date,
      status,
      arrival_silent_transition:
        String(formData.get("arrival_silent_transition") ?? "") || null,
      opening_anchor:
        String(formData.get("opening_anchor") ?? "") || null,
      code_standard_reaffirmation:
        String(formData.get("code_standard_reaffirmation") ?? "") || null,
      ownership_round:
        String(formData.get("ownership_round") ?? "") || null,
      council_reflection:
        String(formData.get("council_reflection") ?? "") || null,
      practical_alignment_block:
        String(formData.get("practical_alignment_block") ?? "") || null,
      open_business:
        String(formData.get("open_business") ?? "") || null,
      commitment_declarations:
        String(formData.get("commitment_declarations") ?? "") || null,
      closing_anchor:
        String(formData.get("closing_anchor") ?? "") || null,
      post_meeting_notes:
        String(formData.get("post_meeting_notes") ?? "") || null,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  if (previousStatus !== "published" && status === "published") {
    await sendMeetingPublishedEmails(supabase, title, id);
  }

  revalidatePath("/admin/meetings");
  revalidatePath(`/admin/meetings/${id}`);
  revalidatePath("/portal/meetings");
  revalidatePath(`/portal/meetings/${id}`);

  redirect(`/admin/meetings/${id}?saved=1`);
}

/* KEEP THE REST OF YOUR ORIGINAL FILE BELOW THIS LINE EXACTLY AS IT WAS */

async function deleteAttachment(
  attachmentId: string,
  fileUrl: string,
  meetingId: string
) {
  "use server";

  const supabase = await createClient();

  const path = fileUrl.split("/meeting-files/")[1];

  if (path) {
    const { error: storageError } = await supabase.storage
      .from("meeting-files")
      .remove([path]);

    if (storageError) {
      console.error("deleteAttachment storage error:", storageError);
    }
  }

  const { error: dbError } = await supabase
    .from("meeting_attachments")
    .delete()
    .eq("id", attachmentId);

  if (dbError) {
    console.error("deleteAttachment db error:", dbError);
    return;
  }

  revalidatePath(`/admin/meetings/${meetingId}`);
  revalidatePath(`/portal/meetings/${meetingId}`);
}

function formatDateTime(date?: string | null) {
  if (!date) return "Not scheduled";

  return new Date(date).toLocaleString("en-US", {
    timeZone: APP_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusTone(status?: string | null) {
  if (status === "published") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "archived") {
    return "border-zinc-400/20 bg-zinc-500/10 text-zinc-300";
  }

  return "border-amber-400/20 bg-amber-500/10 text-amber-300";
}

function textareaClassName() {
  return "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20";
}

function inputClassName() {
  return "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20";
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
      {children}
    </label>
  );
}

export default async function AdminMeetingEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const wasSaved = saved === "1";
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

  const { data: meeting } = await supabase
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
    .eq("id", id)
    .single();

  if (!meeting) {
    notFound();
  }

  const { data: attachments } = await supabase
    .from("meeting_attachments")
    .select("id, file_name, file_url")
    .eq("meeting_id", id)
    .order("created_at", { ascending: false });

  const attachmentCount = attachments?.length ?? 0;
  const statusTone = getStatusTone(meeting.status);

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Edit meeting. Tighten the agenda."
        description="Refine the structure, update visibility, manage attachments, and keep the meeting record clean before members see it."
        actions={[
          { href: "/admin/meetings", label: "Back to Meetings" },
          { href: `/portal/meetings/${meeting.id}`, label: "View in Portal" },
          {
            href: `/admin/meetings/${meeting.id}/live`,
            label: "Live Control",
          },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_32%),rgba(10,14,25,0.9)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-200">
            Meeting Edit Control
          </div>

          <div className="max-w-3xl">
            <h2 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl xl:text-6xl">
              Refine clearly.
              <br />
              Publish intentionally.
              <br />
              Keep the record sharp.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is your deep meeting editor. Adjust the agenda flow, update
              status, manage attachments, and make sure the meeting record reads
              the way the room should feel.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Meeting Status
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusTone}`}
                >
                  {meeting.status ?? "draft"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Current visibility setting for this meeting record.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Attachments
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {attachmentCount}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Files currently connected to this meeting.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Meeting Date
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {formatDateTime(meeting.meeting_date)}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Current scheduled time for this meeting.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-[28px] border border-red-400/20 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_38%),rgba(16,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-200">
              Active Record
            </div>
            <h3 className="mt-3 text-2xl font-black text-white">
              {meeting.title || "Untitled Meeting"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Use this page for deep editing. This is where agenda structure,
              sequence, wording, and supporting files should be cleaned up
              before publication.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/meetings"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Meetings
              </Link>

              <Link
                href={`/portal/meetings/${meeting.id}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Eye className="h-4 w-4" />
                Open Portal View
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_32%),rgba(11,16,28,0.94)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Live Meeting Control
            </div>

            <h3 className="mt-4 text-2xl font-black text-white">
              Run this meeting from the admin side
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              This gives admins a dedicated command entry instead of relying on
              the portal join flow or old test routes. Use it to launch the live
              meeting experience intentionally.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <Link
                href={`/admin/meetings/${meeting.id}/live`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                <ShieldCheck className="h-4 w-4" />
                Launch Admin Live Control
              </Link>

              <Link
                href={`/portal/meetings/${meeting.id}/live`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                <MonitorPlay className="h-4 w-4" />
                Open Member Live View
              </Link>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start gap-3">
                <Radio className="mt-0.5 h-5 w-5 text-cyan-200" />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Next phase of the build
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    After this, we will create the actual admin live page so you
                    have a proper home base for entering and running the room.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Meeting Snapshot
            </div>

            <h3 className="mt-3 text-2xl font-black text-white">
              {meeting.title || "Untitled Meeting"}
            </h3>

            <div className="mt-3 text-sm text-slate-300">
              Meeting: {formatDateTime(meeting.meeting_date)}
            </div>

            {meeting.next_meeting_date && (
              <div className="mt-1 text-sm text-slate-400">
                Next Meeting: {formatDateTime(meeting.next_meeting_date)}
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Current Status
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusTone}`}
                >
                  {meeting.status ?? "draft"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminSection
  eyebrow="Agenda Editor"
  title="Update Meeting"
  description="Adjust agenda content, schedule, and status from one clean editing surface."
>
  {wasSaved ? (
    <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
        <div>
          <div className="font-semibold text-emerald-100">
            Meeting saved successfully.
          </div>
          <p className="mt-1 text-emerald-200/80">
            Your updates have been saved and the meeting views were refreshed.
          </p>
        </div>
      </div>
    </div>
  ) : null}

  <form action={updateMeeting.bind(null, id)} className="space-y-4">
            <div>
              <FieldLabel>Title</FieldLabel>
              <input
                name="title"
                defaultValue={meeting.title ?? ""}
                className={inputClassName()}
                required
              />
            </div>

            <div>
              <FieldLabel>Arrival &amp; Silent Transition</FieldLabel>
              <textarea
                name="arrival_silent_transition"
                defaultValue={meeting.arrival_silent_transition ?? ""}
                rows={3}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Opening Anchor</FieldLabel>
              <textarea
                name="opening_anchor"
                defaultValue={meeting.opening_anchor ?? ""}
                rows={3}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Code &amp; Standard Reaffirmation</FieldLabel>
              <textarea
                name="code_standard_reaffirmation"
                defaultValue={meeting.code_standard_reaffirmation ?? ""}
                rows={3}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Ownership Round</FieldLabel>
              <textarea
                name="ownership_round"
                defaultValue={meeting.ownership_round ?? ""}
                rows={3}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Council Reflection</FieldLabel>
              <textarea
                name="council_reflection"
                defaultValue={meeting.council_reflection ?? ""}
                rows={3}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Practical Alignment Block</FieldLabel>
              <textarea
                name="practical_alignment_block"
                defaultValue={meeting.practical_alignment_block ?? ""}
                rows={4}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Open Business</FieldLabel>
              <textarea
                name="open_business"
                defaultValue={meeting.open_business ?? ""}
                rows={4}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Commitment Declarations</FieldLabel>
              <textarea
                name="commitment_declarations"
                defaultValue={meeting.commitment_declarations ?? ""}
                rows={3}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Closing Anchor</FieldLabel>
              <textarea
                name="closing_anchor"
                defaultValue={meeting.closing_anchor ?? ""}
                rows={3}
                className={textareaClassName()}
              />
            </div>

            <div>
              <FieldLabel>Post-Meeting Notes</FieldLabel>
              <textarea
                name="post_meeting_notes"
                defaultValue={meeting.post_meeting_notes ?? ""}
                rows={4}
                className={textareaClassName()}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Meeting Date &amp; Time</FieldLabel>
                <input
                  type="datetime-local"
                  name="meeting_date"
                  defaultValue={toDateTimeLocalValue(meeting.meeting_date)}
                  className={inputClassName()}
                />
              </div>

              <div>
                <FieldLabel>Next Meeting Date</FieldLabel>
                <input
                  type="datetime-local"
                  name="next_meeting_date"
                  defaultValue={toDateTimeLocalValue(meeting.next_meeting_date)}
                  className={inputClassName()}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Status</FieldLabel>
              <select
                name="status"
                defaultValue={meeting.status ?? "draft"}
                className={inputClassName()}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#f26a3d]/30 bg-[#f26a3d] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Save className="h-4 w-4" />
                Update Meeting
              </button>
            </div>
          </form>
        </AdminSection>

        <div className="space-y-6">
          <AdminSection
            eyebrow="Meeting Files"
            title="Attachments"
            description="Upload supporting documents and remove anything outdated."
          >
            <div className="mb-4 rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="flex items-start gap-3">
                <Paperclip className="mt-0.5 h-5 w-5 text-slate-300" />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Attachment control is live
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Add files members need for preparation and remove old files
                    when they are no longer relevant.
                  </p>
                </div>
              </div>
            </div>

            <MeetingAttachmentUpload meetingId={meeting.id} />

            <div className="mt-6 space-y-3">
              {attachments?.length ? (
                attachments.map((file) => (
                  <form
                    key={file.id}
                    action={deleteAttachment.bind(
                      null,
                      file.id,
                      file.file_url,
                      meeting.id
                    )}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <FileText className="h-4 w-4 text-slate-300" />
                        <span className="truncate">{file.file_name}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </form>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 text-sm text-zinc-400">
                  No attachments yet.
                </div>
              )}
            </div>
          </AdminSection>

          <AdminSection
            eyebrow="Quick Access"
            title="Meeting Actions"
            description="Jump directly to the most important next step."
          >
            <div className="grid grid-cols-1 gap-3">
              <Link
                href={`/admin/meetings/${meeting.id}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                <SquarePen className="h-4 w-4" />
                Refresh this editor
              </Link>

              <Link
                href={`/admin/meetings/${meeting.id}/live`}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/15"
              >
                <ShieldCheck className="h-4 w-4" />
                Open live control
              </Link>

              <Link
                href={`/portal/meetings/${meeting.id}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Eye className="h-4 w-4" />
                Open member-facing view
              </Link>

              <Link
                href="/admin/meetings"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to meetings board
              </Link>
            </div>
          </AdminSection>
        </div>
      </section>
    </AdminPageShell>
  );
}

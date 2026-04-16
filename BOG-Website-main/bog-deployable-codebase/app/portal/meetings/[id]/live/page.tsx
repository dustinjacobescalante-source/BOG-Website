import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Radio, Shield, Video } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import LiveMeetingRoom from "@/components/portal/LiveMeetingRoom";
import PortalShell from "@/components/portal/PortalShell";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateTime(value?: string | null) {
  if (!value) return "Not scheduled";

  return new Date(value).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusLabel(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "live") return "Live now";
  if (value === "scheduled") return "Scheduled";
  if (value === "ended") return "Ended";
  if (value === "cancelled") return "Cancelled";

  return "Unknown";
}

function getStatusClasses(status?: string | null) {
  const value = (status ?? "").toLowerCase();

  if (value === "live") {
    return "border-red-500/30 bg-red-500/10 text-red-200";
  }

  if (value === "scheduled") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }

  if (value === "ended") {
    return "border-white/10 bg-white/[0.05] text-white/70";
  }

  if (value === "cancelled") {
    return "border-white/10 bg-white/[0.05] text-white/50";
  }

  return "border-white/10 bg-white/[0.05] text-white/70";
}

export default async function PortalMeetingLivePage({ params }: PageProps) {
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
    .select("id, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/sign-in");
  }

  if (!profile.is_active) {
    redirect("/pending");
  }

  const { data: meeting, error: meetingError } = await supabase
    .from("meetings")
    .select("id, title, meeting_date, status")
    .eq("id", id)
    .single();

  if (meetingError || !meeting) {
    notFound();
  }

  const { data: liveMeeting } = await supabase
    .from("live_meetings")
    .select(`
      id,
      title,
      description,
      room_name,
      scheduled_start,
      scheduled_end,
      status,
      recording_enabled,
      replay_ready,
      recording_url
    `)
    .eq("meeting_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <PortalShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(135deg,rgba(10,10,10,0.96),rgba(22,22,22,0.92))] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col gap-6 px-6 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <Link
                  href={`/portal/meetings/${meeting.id}`}
                  className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to meeting details
                </Link>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.34em] text-red-300/80">
                    Brotherhood of Growth
                  </div>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    {liveMeeting?.title || meeting.title || "Live Meeting"}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
                    Join the live meeting room for real-time video, audio, and
                    discussion inside the member portal.
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses(
                  liveMeeting?.status
                )}`}
              >
                <Radio className="h-4 w-4" />
                {getStatusLabel(liveMeeting?.status)}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Linked agenda
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {meeting.title || "Meeting"}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  {formatDateTime(meeting.meeting_date)}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Scheduled start
                </div>
                <div className="mt-2 text-base font-semibold text-white">
                  {formatDateTime(liveMeeting?.scheduled_start)}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  Central time
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                  Access
                </div>
                <div className="mt-2 flex items-center gap-2 text-base font-semibold text-white">
                  <Shield className="h-4 w-4 text-red-300" />
                  Active members only
                </div>
                <div className="mt-1 text-sm text-white/60">
                  Camera and mic enabled
                </div>
              </div>
            </div>
          </div>
        </section>

        {!liveMeeting ? (
          <section className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-6">
            <div className="flex items-start gap-3">
              <Video className="mt-0.5 h-5 w-5 text-amber-200" />
              <div>
                <div className="text-sm font-semibold text-amber-100">
                  No live room has been created for this meeting yet.
                </div>
                <p className="mt-2 text-sm leading-7 text-amber-100/80">
                  Once an admin creates a live meeting room for this agenda,
                  active members will be able to join from this page.
                </p>
              </div>
            </div>
          </section>
        ) : liveMeeting.status === "cancelled" ? (
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-sm font-semibold text-white">
              This live meeting has been cancelled.
            </div>
            <p className="mt-2 text-sm leading-7 text-white/65">
              Check the meeting detail page for updates from the admin team.
            </p>
          </section>
        ) : liveMeeting.status === "ended" && liveMeeting.replay_ready && liveMeeting.recording_url ? (
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-sm font-semibold text-white">
              This live meeting has ended.
            </div>
            <p className="mt-2 text-sm leading-7 text-white/65">
              A replay is available for members.
            </p>
            <div className="mt-4">
              <a
                href={liveMeeting.recording_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                Open recording
              </a>
            </div>
          </section>
        ) : (
          <LiveMeetingRoom liveMeetingId={liveMeeting.id} />
        )}
      </div>
    </PortalShell>
  );
}
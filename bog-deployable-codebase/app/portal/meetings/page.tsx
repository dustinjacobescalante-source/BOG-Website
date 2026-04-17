import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  ShieldCheck,
  Video,
} from 'lucide-react';

const APP_TIME_ZONE = 'America/Chicago';

function formatMeetingDate(date?: string | null) {
  if (!date) return 'No date set';

  return new Date(date).toLocaleString('en-US', {
    timeZone: APP_TIME_ZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getMeetingTimingState(meetingDate?: string | null) {
  if (!meetingDate) {
    return {
      status: 'unscheduled' as const,
      showJoin: false,
      label: 'Unscheduled',
      tone:
        'border-zinc-500/30 bg-zinc-500/10 text-zinc-300',
    };
  }

  const meetingMs = new Date(meetingDate).getTime();
  const nowMs = Date.now();

  if (Number.isNaN(meetingMs)) {
    return {
      status: 'unscheduled' as const,
      showJoin: false,
      label: 'Unscheduled',
      tone:
        'border-zinc-500/30 bg-zinc-500/10 text-zinc-300',
    };
  }

  const earlyJoinWindow = 10 * 60 * 1000;
  const lateJoinWindow = 2 * 60 * 60 * 1000;

  if (nowMs < meetingMs - earlyJoinWindow) {
    return {
      status: 'upcoming' as const,
      showJoin: false,
      label: 'Starts Soon',
      tone:
        'border-amber-500/30 bg-amber-500/10 text-amber-300',
    };
  }

  if (nowMs >= meetingMs - earlyJoinWindow && nowMs <= meetingMs + lateJoinWindow) {
    return {
      status: 'live' as const,
      showJoin: true,
      label: 'Live Now',
      tone:
        'border-red-500/30 bg-red-500/10 text-red-300',
    };
  }

  return {
    status: 'ended' as const,
    showJoin: false,
    label: 'Ended',
    tone:
      'border-zinc-500/30 bg-zinc-500/10 text-zinc-300',
  };
}

export default async function PortalMeetingsPage() {
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from('meetings')
    .select('id, title, meeting_date, next_meeting_date, status')
    .eq('status', 'published')
    .order('meeting_date', { ascending: false });

  const publishedMeetings = meetings ?? [];

  const upcomingMeetings = [...publishedMeetings]
    .filter((meeting) => meeting.meeting_date)
    .sort((a, b) => {
      return (
        new Date(a.meeting_date as string).getTime() -
        new Date(b.meeting_date as string).getTime()
      );
    });

  const now = Date.now();

  const featuredMeeting =
    upcomingMeetings.find((meeting) => {
      if (!meeting.meeting_date) return false;
      return new Date(meeting.meeting_date).getTime() >= now;
    }) ?? publishedMeetings[0] ?? null;

  const featuredMeetingState = featuredMeeting
    ? getMeetingTimingState(featuredMeeting.meeting_date)
    : null;

  return (
    <Section
      label="Portal"
      title="Meetings"
      description="View published brotherhood meetings."
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,14,24,0.96),rgba(6,8,14,1))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-7 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_24%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_22%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  <CalendarDays className="h-3 w-3" />
                  Meetings Command
                </div>

                <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
                  Stay prepared.
                  <br />
                  Show up aligned.
                  <br />
                  <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                    Review the agenda early.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  Review published meetings, prepare before the brotherhood gathers,
                  and use the agenda page for attachments, comments, and discussion
                  context.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Published Meetings
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">
                    {publishedMeetings.length}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">
                    Meetings currently available in the member portal.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Featured Meeting
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">
                    {featuredMeeting ? featuredMeetingState?.label ?? 'Ready' : 'None Yet'}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">
                    {featuredMeeting
                      ? 'Meeting timing is now shown directly on the portal.'
                      : 'No published meetings are available yet.'}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Member Standard
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">
                    Come Prepared
                  </div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">
                    Review before the meeting, not when it starts.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-red-500/25 bg-gradient-to-br from-red-600/18 to-red-950/10 px-5 py-5 shadow-[0_12px_40px_rgba(239,68,68,0.10)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                  Featured Meeting
                </div>

                {featuredMeeting ? (
                  <>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="text-2xl font-bold text-white">
                        {featuredMeeting.title}
                      </div>

                      {featuredMeetingState && (
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${featuredMeetingState.tone}`}
                        >
                          {featuredMeetingState.label}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-zinc-200">
                      <Clock3 className="h-4 w-4 text-red-300" />
                      {formatMeetingDate(featuredMeeting.meeting_date)}
                    </div>

                    {featuredMeeting.next_meeting_date && (
                      <div className="mt-2 text-sm text-zinc-300">
                        Next Meeting: {formatMeetingDate(featuredMeeting.next_meeting_date)}
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      {featuredMeetingState?.showJoin && (
                        <Link
                          href={`/portal/meetings/live?meetingId=${featuredMeeting.id}`}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-400/40 hover:bg-red-500/20"
                        >
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </Link>
                      )}

                      <Link
                        href={`/portal/meetings/${featuredMeeting.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
                      >
                        Open Agenda
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-3 text-2xl font-bold text-white">
                      No Published Meetings
                    </div>
                    <div className="mt-2 text-sm leading-6 text-zinc-300">
                      Nothing is live yet. Stay ready for the next brotherhood agenda.
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/25 px-5 py-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  What You Can Do
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-zinc-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Review agenda</div>
                      <div className="text-xs leading-5 text-zinc-500">
                        See the full meeting structure before the brotherhood gathers.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <FileText className="mt-0.5 h-4 w-4 text-zinc-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Open attachments</div>
                      <div className="text-xs leading-5 text-zinc-500">
                        Review supporting files and material connected to the meeting.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-zinc-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Contribute cleanly</div>
                      <div className="text-xs leading-5 text-zinc-500">
                        Members can add their own comments and attachments. Admins control the full record.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {publishedMeetings.length ? (
            publishedMeetings.map((meeting, index) => {
              const meetingState = getMeetingTimingState(meeting.meeting_date);

              return (
                <Card key={meeting.id}>
                  <div className="group flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                          Meeting {publishedMeetings.length - index}
                        </span>

                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green-300">
                          Published
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${meetingState.tone}`}
                        >
                          {meetingState.label}
                        </span>
                      </div>

                      <div className="mt-3 text-2xl font-bold text-white transition group-hover:text-zinc-100">
                        {meeting.title}
                      </div>

                      <div className="mt-3 flex flex-col gap-1 text-sm text-zinc-400">
                        <div>{formatMeetingDate(meeting.meeting_date)}</div>

                        {meeting.next_meeting_date && (
                          <div className="text-zinc-500">
                            Next Meeting: {formatMeetingDate(meeting.next_meeting_date)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      {meetingState.showJoin && (
                        <Link
                          href={`/portal/meetings/live?meetingId=${meeting.id}`}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-400/40 hover:bg-red-500/20"
                        >
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </Link>
                      )}

                      <Link
                        href={`/portal/meetings/${meeting.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        View Agenda
                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <div className="text-lg font-semibold text-white">
                  No published meetings found
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  No meeting agendas are live in the portal yet. Stay ready.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Section>
  );
}

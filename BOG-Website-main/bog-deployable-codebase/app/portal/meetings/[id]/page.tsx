import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarDays,
  Clock3,
  ChevronRight,
  FileText,
  MessageSquare,
  Paperclip,
  ShieldCheck,
  Radio,
  Video,
  PlayCircle,
} from 'lucide-react';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import MeetingComments from '@/components/meetings/MeetingComments';
import TestAttachmentUpload from '@/components/meetings/TestAttachmentUpload';

function formatMeetingDate(date?: string | null) {
  if (!date) return 'No date set';

  return new Date(date).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getLiveStatusLabel(status?: string | null) {
  const value = (status ?? '').toLowerCase();

  if (value === 'live') return 'Live Now';
  if (value === 'scheduled') return 'Scheduled';
  if (value === 'ended') return 'Ended';
  if (value === 'cancelled') return 'Cancelled';

  return 'Unavailable';
}

function getLiveStatusClasses(status?: string | null) {
  const value = (status ?? '').toLowerCase();

  if (value === 'live') {
    return 'border-red-500/30 bg-red-500/10 text-red-200';
  }

  if (value === 'scheduled') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
  }

  if (value === 'ended') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
  }

  if (value === 'cancelled') {
    return 'border-white/10 bg-white/[0.04] text-zinc-400';
  }

  return 'border-white/10 bg-white/[0.04] text-zinc-400';
}

function AgendaBlock({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
        {content}
      </p>
    </div>
  );
}

export default async function PortalMeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
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
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (meetingError || !meeting) {
    notFound();
  }

  const { data: attachments, error: attachmentsError } = await supabase
    .from('meeting_attachments')
    .select('id, file_name, file_path, created_at')
    .eq('meeting_id', id)
    .order('created_at', { ascending: false });

  const attachmentsWithUrls = await Promise.all(
    (attachments || []).map(async (attachment) => {
      const { data: signedUrlData } = await supabase.storage
        .from('meeting-attachments')
        .createSignedUrl(attachment.file_path, 60 * 60);

      return {
        ...attachment,
        signedUrl: signedUrlData?.signedUrl || null,
      };
    })
  );

  const { data: liveMeeting } = await supabase
    .from('live_meetings')
    .select(
      `
        id,
        title,
        room_name,
        status,
        scheduled_start,
        scheduled_end,
        recording_enabled,
        recording_status,
        recording_url,
        replay_ready
      `
    )
    .eq('meeting_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const agendaBlocks = [
    {
      title: 'Arrival & Silent Transition',
      content: meeting.arrival_silent_transition,
    },
    {
      title: 'Opening Anchor',
      content: meeting.opening_anchor,
    },
    {
      title: 'Code & Standard Reaffirmation',
      content: meeting.code_standard_reaffirmation,
    },
    {
      title: 'Ownership Round',
      content: meeting.ownership_round,
    },
    {
      title: 'Council Reflection',
      content: meeting.council_reflection,
    },
    {
      title: 'Practical Alignment Block',
      content: meeting.practical_alignment_block,
    },
    {
      title: 'Open Business',
      content: meeting.open_business,
    },
    {
      title: 'Commitment Declarations',
      content: meeting.commitment_declarations,
    },
    {
      title: 'Closing Anchor',
      content: meeting.closing_anchor,
    },
    {
      title: 'Post-Meeting Notes',
      content: meeting.post_meeting_notes,
    },
  ].filter((block) => block.content);

  const showJoinButton =
    !!liveMeeting &&
    (liveMeeting.status === 'live' || liveMeeting.status === 'scheduled');

  const showReplayButton =
    !!liveMeeting?.recording_url &&
    liveMeeting.replay_ready === true &&
    (liveMeeting.status === 'ended' || liveMeeting.recording_status === 'stopped');

  return (
    <Section
      label="Portal"
      title={meeting.title}
      description="Meeting agenda and details."
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
                  Meeting Detail
                </div>

                <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
                  Review the agenda.
                  <br />
                  Show up aligned.
                  <br />
                  <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                    Contribute with intention.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  Use this page to review the agenda, open attachments, leave
                  comments, and join or replay the live meeting when available.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Meeting Date
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">
                    {meeting.meeting_date ? 'Scheduled' : 'Pending'}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">
                    {formatMeetingDate(meeting.meeting_date)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Attachments
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">
                    {attachmentsWithUrls.length}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">
                    Files connected to this meeting.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Agenda Sections
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">
                    {agendaBlocks.length}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">
                    Structured blocks published for review.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-red-500/25 bg-gradient-to-br from-red-600/18 to-red-950/10 px-5 py-5 shadow-[0_12px_40px_rgba(239,68,68,0.10)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                  Meeting Snapshot
                </div>

                <div className="mt-3 text-2xl font-bold text-white">
                  {meeting.title}
                </div>

                <div className="mt-4 space-y-2 text-sm text-zinc-200">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-red-300" />
                    {formatMeetingDate(meeting.meeting_date)}
                  </div>

                  {meeting.next_meeting_date && (
                    <div className="text-zinc-300">
                      Next Meeting: {formatMeetingDate(meeting.next_meeting_date)}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/print/meetings/${meeting.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
                  >
                    <FileText className="h-4 w-4" />
                    Print Agenda
                  </Link>

                  {showJoinButton && (
                    <Link
                      href={`/portal/meetings/${meeting.id}/live`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/15"
                    >
                      <Video className="h-4 w-4" />
                      Join Live Meeting
                    </Link>
                  )}

                  {showReplayButton && (
                    <a
                      href={liveMeeting.recording_url!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/15"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Watch Replay
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/25 px-5 py-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Live Meeting
                </div>

                <div className="mt-4 space-y-3">
                  {liveMeeting ? (
                    <>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {liveMeeting.title || 'Live Meeting Room'}
                          </div>
                          <div className="mt-1 text-xs leading-5 text-zinc-500">
                            {liveMeeting.scheduled_start
                              ? `Starts ${formatMeetingDate(liveMeeting.scheduled_start)}`
                              : 'Live meeting schedule not set'}
                          </div>
                        </div>

                        <div
                          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getLiveStatusClasses(
                            liveMeeting.status
                          )}`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Radio className="h-3.5 w-3.5" />
                            {getLiveStatusLabel(liveMeeting.status)}
                          </span>
                        </div>
                      </div>

                      {showJoinButton && (
                        <Link
                          href={`/portal/meetings/${meeting.id}/live`}
                          className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3"
                        >
                          <Video className="mt-0.5 h-4 w-4 text-red-200" />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Enter the live room
                            </div>
                            <div className="text-xs leading-5 text-zinc-300">
                              Join the active meeting with camera, microphone, chat,
                              and screen sharing.
                            </div>
                          </div>
                        </Link>
                      )}

                      {showReplayButton && (
                        <a
                          href={liveMeeting.recording_url!}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3"
                        >
                          <PlayCircle className="mt-0.5 h-4 w-4 text-emerald-200" />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Replay available
                            </div>
                            <div className="text-xs leading-5 text-zinc-300">
                              Open the saved meeting recording for members who
                              missed the live session.
                            </div>
                          </div>
                        </a>
                      )}

                      {!showJoinButton && !showReplayButton && (
                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                          <Radio className="mt-0.5 h-4 w-4 text-zinc-300" />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Live room status tracked
                            </div>
                            <div className="text-xs leading-5 text-zinc-500">
                              This meeting has a live room connected to it. Join and
                              replay options will appear here when available.
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                      <Video className="mt-0.5 h-4 w-4 text-zinc-300" />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          No live room yet
                        </div>
                        <div className="text-xs leading-5 text-zinc-500">
                          Once an admin creates a live meeting for this agenda,
                          join and replay options will appear here.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 text-zinc-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Leave comments
                      </div>
                      <div className="text-xs leading-5 text-zinc-500">
                        Add feedback, questions, or direction tied to this agenda.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-zinc-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Controlled permissions
                      </div>
                      <div className="text-xs leading-5 text-zinc-500">
                        Members manage their own items. Admins manage the full meeting record.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <Paperclip className="mt-0.5 h-4 w-4 text-zinc-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Open and upload files
                      </div>
                      <div className="text-xs leading-5 text-zinc-500">
                        Members can contribute attachments directly on the meeting page.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Card>
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Agenda Overview
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  Published Agenda
                </div>
              </div>

              <Link
                href={`/print/meetings/${meeting.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
              >
                Print View
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4">
              {agendaBlocks.length ? (
                agendaBlocks.map((block) => (
                  <AgendaBlock
                    key={block.title}
                    title={block.title}
                    content={block.content}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                  <div className="text-lg font-semibold text-white">
                    No agenda sections published
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    This meeting exists, but no agenda blocks have been added yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Attachments
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                Meeting Files
              </div>
            </div>

            <TestAttachmentUpload meetingId={meeting.id} />

            <div className="space-y-3">
              {attachmentsError ? (
                <p className="text-sm text-red-400">Could not load attachments.</p>
              ) : attachmentsWithUrls.length ? (
                attachmentsWithUrls.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/25"
                  >
                    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-zinc-200">
                          {attachment.file_name}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          Uploaded {formatMeetingDate(attachment.created_at)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {attachment.signedUrl && (
                          <a
                            href={attachment.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/5"
                          >
                            Open
                          </a>
                        )}

                        <form
                          action={`/api/meetings/${meeting.id}/attachments/${attachment.id}`}
                          method="POST"
                        >
                          <button
                            type="submit"
                            className="rounded-xl border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                  <div className="text-lg font-semibold text-white">
                    No attachments yet
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    Nothing has been uploaded to this meeting yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div>
          <MeetingComments meetingId={meeting.id} />
        </div>
      </div>
    </Section>
  );
}
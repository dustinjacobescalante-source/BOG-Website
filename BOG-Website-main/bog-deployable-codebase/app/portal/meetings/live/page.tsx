import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import LiveMeetingRoom from '@/components/meetings/LiveMeetingRoom';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Video,
} from 'lucide-react';

function formatMeetingDate(date?: string | null) {
  if (!date) return 'No date set';

  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type LiveMeetingPageProps = {
  searchParams?: Promise<{
    meetingId?: string;
  }>;
};

export default async function PortalLiveMeetingPage({
  searchParams,
}: LiveMeetingPageProps) {
  const params = (await searchParams) ?? {};
  const meetingId = params.meetingId;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, is_active, role')
    .eq('id', user.id)
    .single();

  if (!profile?.is_active) {
    redirect('/pending');
  }

  if (!meetingId) {
    return (
      <Section
        label="Portal"
        title="Live Meeting"
        description="Secure brotherhood live room."
      >
        <Card>
          <div className="rounded-[28px] border border-white/10 bg-black/25 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <Video className="h-7 w-7 text-red-300" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              No meeting selected
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Open the meetings page and use the Join Meeting button on an active
              meeting.
            </p>

            <Link
              href="/portal/meetings"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Meetings
            </Link>
          </div>
        </Card>
      </Section>
    );
  }

  const { data: meeting } = await supabase
    .from('meetings')
    .select('id, title, meeting_date, next_meeting_date, status')
    .eq('id', meetingId)
    .eq('status', 'published')
    .single();

  if (!meeting) {
    return (
      <Section
        label="Portal"
        title="Live Meeting"
        description="Secure brotherhood live room."
      >
        <Card>
          <div className="rounded-[28px] border border-white/10 bg-black/25 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <Video className="h-7 w-7 text-red-300" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Meeting not available
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              This meeting could not be found or is not published for members.
            </p>

            <Link
              href="/portal/meetings"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Meetings
            </Link>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <Section
      label="Portal"
      title="Live Meeting"
      description="Secure brotherhood live room."
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,14,24,0.96),rgba(6,8,14,1))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-7 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_24%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_22%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                <Video className="h-3 w-3" />
                Brotherhood Live
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
                Enter the room.
                <br />
                Show up present.
                <br />
                <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  Stay sharp on camera.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Join the live brotherhood session with secure member access,
                camera and microphone support, and a clean mobile-capable meeting
                experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/portal/meetings/${meeting.id}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Open Agenda
              </Link>

              <Link
                href="/portal/meetings"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Meetings
              </Link>
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5" />
                Meeting
              </div>
              <div className="mt-2 text-lg font-bold text-white">{meeting.title}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <Clock3 className="h-3.5 w-3.5" />
                Start Time
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {formatMeetingDate(meeting.meeting_date)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5" />
                Access
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Authenticated active members only
              </div>
            </div>
          </div>
        </section>

        <LiveMeetingRoom meetingId={meeting.id} meetingTitle={meeting.title} />
      </div>
    </Section>
  );
}
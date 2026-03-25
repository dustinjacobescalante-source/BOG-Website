import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import MeetingComments from '@/components/meetings/MeetingComments';
import PrintMeetingButton from '@/components/meetings/PrintMeetingButton';

function AgendaBlock({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) return null;

  return (
    <div className="pt-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {title}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{content}</p>
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

  const { data: meeting } = await supabase
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

  if (!meeting) {
    notFound();
  }

  const { data: attachments } = await supabase
    .from('meeting_attachments')
    .select('id, file_name, file_url')
    .eq('meeting_id', id)
    .order('created_at', { ascending: false });

  const { data: comments } = await supabase
    .from('meeting_comments')
    .select(
      `
        id,
        comment_text,
        created_at,
        profiles (
          full_name
        )
      `
    )
    .eq('meeting_id', id)
    .order('created_at', { ascending: false });

  return (
    <Section
      label="Portal"
      title={meeting.title}
      description="Meeting agenda and details."
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <PrintMeetingButton />

        <Link
         href={`/print/meetings/${meeting.id}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
        >
          Print Agenda Page
        </Link>
      </div>

      <Card>
        <div className="space-y-2">
          <div className="text-sm text-zinc-400">
            {meeting.meeting_date
              ? new Date(meeting.meeting_date).toLocaleString()
              : 'No date set'}
          </div>

          {meeting.next_meeting_date && (
            <div className="text-sm text-zinc-500">
              Next Meeting: {new Date(meeting.next_meeting_date).toLocaleString()}
            </div>
          )}

          <AgendaBlock
            title="Arrival & Silent Transition"
            content={meeting.arrival_silent_transition}
          />
          <AgendaBlock title="Opening Anchor" content={meeting.opening_anchor} />
          <AgendaBlock
            title="Code & Standard Reaffirmation"
            content={meeting.code_standard_reaffirmation}
          />
          <AgendaBlock title="Ownership Round" content={meeting.ownership_round} />
          <AgendaBlock title="Council Reflection" content={meeting.council_reflection} />
          <AgendaBlock
            title="Practical Alignment Block"
            content={meeting.practical_alignment_block}
          />
          <AgendaBlock title="Open Business" content={meeting.open_business} />
          <AgendaBlock
            title="Commitment Declarations"
            content={meeting.commitment_declarations}
          />
          <AgendaBlock title="Closing Anchor" content={meeting.closing_anchor} />
          <AgendaBlock
            title="Post-Meeting Notes"
            content={meeting.post_meeting_notes}
          />

          <div className="pt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Attachments
            </div>

            <div className="mt-3 space-y-2">
              {attachments?.length ? (
                attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3"
                  >
                    <div className="text-sm text-zinc-200">{attachment.file_name}</div>

                    <a
                      href={attachment.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white hover:bg-white/5"
                    >
                      Open
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No attachments for this meeting.</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="pt-6">
        <MeetingComments meetingId={meeting.id} />
      </div>

      <div className="pt-6">
        <Card>
          <div className="mb-3 text-sm font-medium text-white">Recent Comments</div>

          <div className="space-y-3">
            {comments?.length ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="text-xs text-zinc-500">
                    {(comment.profiles as { full_name?: string } | null)?.full_name || 'Unknown'} •{' '}
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">
                    {comment.comment_text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No comments yet.</p>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}

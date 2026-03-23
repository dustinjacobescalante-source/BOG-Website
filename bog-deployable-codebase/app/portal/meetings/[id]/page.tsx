import { notFound } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

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

  return (
    <Section
      label="Portal"
      title={meeting.title}
      description="Meeting agenda and details."
    >
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
        </div>
      </Card>
    </Section>
  );
}

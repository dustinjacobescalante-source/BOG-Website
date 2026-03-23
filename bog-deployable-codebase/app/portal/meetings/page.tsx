import Link from 'next/link';
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
    <div className="pt-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {title}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{content}</p>
    </div>
  );
}

export default async function MeetingsPage() {
  const supabase = await createClient();

  const { data: meetings } = await supabase
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
    .eq('status', 'published')
    .order('meeting_date', { ascending: true });

  return (
    <Section
      label="Portal"
      title="Meetings"
      description="View published brotherhood meetings and agenda details."
    >
      <div className="space-y-4">
        {meetings?.map((meeting) => (
          <Link key={meeting.id} href={`/portal/meetings/${meeting.id}`} className="block">
            <Card>
              <div className="space-y-2">
                <div className="text-lg font-bold text-white">{meeting.title}</div>

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
          </Link>
        ))}

        {!meetings?.length && (
          <Card>
            <div className="font-semibold text-white">No published meetings yet</div>
            <p className="mt-2 text-sm text-zinc-400">
              Once leadership publishes meetings, they will appear here.
            </p>
          </Card>
        )}
      </div>
    </Section>
  );
}

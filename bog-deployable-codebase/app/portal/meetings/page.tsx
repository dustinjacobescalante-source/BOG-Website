import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function MeetingsPage() {
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from('meetings')
    .select('id, title, meeting_date, status, arrival_silent_transition')
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
          <Card key={meeting.id}>
            <div className="space-y-2">
              <div className="text-lg font-bold text-white">{meeting.title}</div>

              <div className="text-sm text-zinc-400">
                {meeting.meeting_date
                  ? new Date(meeting.meeting_date).toLocaleString()
                  : 'No date set'}
              </div>

              {meeting.arrival_silent_transition && (
                <div className="pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Arrival &amp; Silent Transition
                  </div>
                  <p className="mt-1 text-sm text-zinc-300">
                    {meeting.arrival_silent_transition}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}

        <div>
  <label className="mb-2 block text-sm font-medium text-white">
    Opening Anchor
  </label>
  <textarea
    name="opening_anchor"
    placeholder="Opening message, intention, or grounding..."
    rows={3}
    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
  />
</div>
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

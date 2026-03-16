import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function MeetingsPage() {
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('status', 'published')
    .order('meeting_date', { ascending: true });

  return (
    <Section
      label="Portal"
      title="Meetings"
      description="View published brotherhood meetings, agendas, and locations."
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

              <div className="text-sm text-zinc-500">
                {meeting.location || 'No location set'}
              </div>

              {meeting.description && (
                <p className="pt-2 text-sm text-zinc-300">{meeting.description}</p>
              )}
            </div>
          </Card>
        ))}

        {!meetings?.length && (
          <Card>
            <div className="text-white font-semibold">No published meetings yet</div>
            <p className="mt-2 text-sm text-zinc-400">
              Once leadership publishes meetings, they will appear here.
            </p>
          </Card>
        )}
      </div>
    </Section>
  );
}

import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

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
        status
      `
    )
    .eq('status', 'published')
    .order('meeting_date', { ascending: true });

  return (
    <Section
      label="Portal"
      title="Meetings"
      description="View published brotherhood meetings."
    >
      <div className="space-y-4">
        {meetings?.map((meeting) => (
          <Link
            key={meeting.id}
            href={`/portal/meetings/${meeting.id}`}
            className="block"
          >
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-lg font-bold text-white">
                    {meeting.title}
                  </div>

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
                </div>

                <div className="text-sm font-medium text-zinc-300">
                  View Agenda →
                </div>
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

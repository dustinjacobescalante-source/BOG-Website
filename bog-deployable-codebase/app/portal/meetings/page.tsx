import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function PortalMeetingsPage() {
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from('meetings')
    .select('id, title, meeting_date, next_meeting_date, status')
    .eq('status', 'published')
    .order('meeting_date', { ascending: false });

  return (
    <Section
      label="Portal"
      title="Meetings"
      description="View published brotherhood meetings."
    >
      <div className="space-y-4">
        {meetings?.length ? (
          meetings.map((meeting) => (
            <Card key={meeting.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-white">
                    {meeting.title}
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    {meeting.meeting_date
                      ? new Date(meeting.meeting_date).toLocaleString()
                      : 'No date set'}
                  </div>

                  {meeting.next_meeting_date && (
                    <div className="mt-1 text-sm text-zinc-500">
                      Next Meeting: {new Date(meeting.next_meeting_date).toLocaleString()}
                    </div>
                  )}
                </div>

               <a
  href={`/portal/meetings/${meeting.id}`}
  className="text-sm font-semibold text-white hover:text-zinc-300"
>
  View Agenda →
</a>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm text-zinc-500">No published meetings found.</p>
          </Card>
        )}
      </div>
    </Section>
  );
}

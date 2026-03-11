import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: meetings } = await supabase
    .from('meetings')
    .select('id, title, meeting_date, status, monthly_scripture, monthly_priorities')
    .in('status', ['published', 'archived'])
    .order('meeting_date', { ascending: false })
    .limit(12);

  return (
    <Section label="Portal" title="Meetings Center" description="Publish agendas in advance and archive prior meetings.">
      <div className="space-y-4">
        {meetings?.length ? meetings.map((meeting) => (
          <Card key={meeting.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-white">{meeting.title}</div>
                <div className="mt-1 text-sm text-zinc-500">{new Date(meeting.meeting_date).toLocaleString()}</div>
                <div className="mt-3 text-sm text-zinc-400">Scripture: {meeting.monthly_scripture || '—'}</div>
                <div className="text-sm text-zinc-400">Priorities: {meeting.monthly_priorities || '—'}</div>
              </div>
              <div className="rounded-full bg-red-600/15 px-3 py-1 text-xs font-bold text-red-400">{meeting.status}</div>
            </div>
          </Card>
        )) : <Card><div className="text-sm text-zinc-300">No meetings yet.</div></Card>}
      </div>
    </Section>
  );
}

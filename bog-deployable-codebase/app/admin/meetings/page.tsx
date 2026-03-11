import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('meetings').select('id, title, meeting_date, status').order('meeting_date', { ascending: false });
  return <Section label="Admin" title="Manage Meetings" description="Create, publish, and archive meeting agendas."><div className="space-y-3">{data?.map((meeting) => <Card key={meeting.id}><div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-white">{meeting.title}</div><div className="text-sm text-zinc-500">{new Date(meeting.meeting_date).toLocaleString()}</div></div><div className="rounded-full bg-red-600/15 px-3 py-1 text-xs font-bold text-red-400">{meeting.status}</div></div></Card>)}</div></Section>;
}

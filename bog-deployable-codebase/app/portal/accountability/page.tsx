import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function Page() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from('accountability_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('entry_year', { ascending: false })
    .order('entry_month', { ascending: false })
    .limit(12);

  return (
    <Section label="Portal" title="Accountability Dashboard" description="Track spiritual, personal, professional, physical, and emotional goals each month.">
      <div className="space-y-4">
        {entries?.length ? entries.map((entry) => (
          <Card key={entry.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-white">{entry.entry_month}/{entry.entry_year}</div>
                <div className="mt-2 text-sm text-zinc-400">Personal: {entry.personal_goal || '—'}</div>
                <div className="text-sm text-zinc-400">Physical: {entry.physical_goal || '—'}</div>
              </div>
              <div className="text-right text-sm text-zinc-400">
                <div>Meeting: {entry.meeting_attended ? 'Yes' : 'No'}</div>
                <div>Scripture: {entry.scripture_memorized ? 'Yes' : 'No'}</div>
                <div>Book: {entry.book_completed ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </Card>
        )) : <Card><div className="text-sm text-zinc-300">No accountability entries yet. The schema is ready for live entry forms next.</div></Card>}
      </div>
    </Section>
  );
}

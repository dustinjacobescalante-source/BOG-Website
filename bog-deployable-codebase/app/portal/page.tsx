import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';

export default async function Page() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: latest }, { data: upcoming }] = await Promise.all([
    supabase
      .from('accountability_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_year', { ascending: false })
      .order('entry_month', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('meetings')
      .select('title, meeting_date, status')
      .eq('status', 'published')
      .gte('meeting_date', new Date().toISOString())
      .order('meeting_date', { ascending: true })
      .limit(1)
      .maybeSingle()
  ]);

  const stats = [
    ['Personal Goals', latest?.personal_goal ? 'Set' : 'Add one'],
    ['Habits', latest?.weekly_notes ? 'Logged' : 'Update'],
    ['Commitments', latest?.commitments_declared ? 'Active' : 'None'],
    ['Progress', latest?.wins ? 'Tracked' : 'Start now']
  ];

  return (
    <Section label="Portal" title="Member Dashboard" description="Individual accounts with real operating tools.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <div className="text-sm font-semibold text-zinc-500">{label}</div>
            <div className="mt-2 text-2xl font-black text-white">{value}</div>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-lg font-bold text-white">Latest accountability entry</div>
          <p className="mt-2 text-sm text-zinc-400">
            {latest ? `${latest.entry_month}/${latest.entry_year} entry found.` : 'No accountability entry yet.'}
          </p>
        </Card>
        <Card>
          <div className="text-lg font-bold text-white">Upcoming meeting</div>
          <p className="mt-2 text-sm text-zinc-400">
            {upcoming ? `${upcoming.title} • ${new Date(upcoming.meeting_date).toLocaleString()}` : 'No published meeting found.'}
          </p>
        </Card>
      </div>
    </Section>
  );
}

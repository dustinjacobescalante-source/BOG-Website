import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function saveAccountability(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const user = await requireUser();

  const personal_goal = String(formData.get('personal_goal') ?? '');
  const weekly_notes = String(formData.get('weekly_notes') ?? '');
  const commitments_declared = String(formData.get('commitments_declared') ?? '');
  const wins = String(formData.get('wins') ?? '');

  const now = new Date();
  const entry_month = now.getMonth() + 1;
  const entry_year = now.getFullYear();

  const { data: existing } = await supabase
    .from('accountability_entries')
    .select('id')
    .eq('user_id', user.id)
    .eq('entry_month', entry_month)
    .eq('entry_year', entry_year)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from('accountability_entries')
      .update({
        personal_goal,
        weekly_notes,
        commitments_declared,
        wins,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('accountability_entries')
      .insert({
        user_id: user.id,
        entry_month,
        entry_year,
        personal_goal,
        weekly_notes,
        commitments_declared,
        wins,
      });
  }

  revalidatePath('/portal');
  revalidatePath('/portal/accountability');
}

export default async function AccountabilityPage() {
  const supabase = await createClient();
  const user = await requireUser();

  const now = new Date();
  const entry_month = now.getMonth() + 1;
  const entry_year = now.getFullYear();

  const { data: entry } = await supabase
    .from('accountability_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_month', entry_month)
    .eq('entry_year', entry_year)
    .maybeSingle();

  return (
    <Section
      label="Portal"
      title="Accountability Tracker"
      description="Log your current goals, commitments, wins, and progress."
    >
      <Card>
        <form action={saveAccountability} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Personal Goal</label>
            <input
              name="personal_goal"
              defaultValue={entry?.personal_goal ?? ''}
              placeholder="What is your main goal right now?"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Weekly Notes</label>
            <textarea
              name="weekly_notes"
              defaultValue={entry?.weekly_notes ?? ''}
              placeholder="What are you working on this week?"
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Commitments</label>
            <textarea
              name="commitments_declared"
              defaultValue={entry?.commitments_declared ?? ''}
              placeholder="What commitments are you making?"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Wins / Progress</label>
            <textarea
              name="wins"
              defaultValue={entry?.wins ?? ''}
              placeholder="What progress or wins have you had?"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            Save Accountability Entry
          </button>
        </form>
      </Card>
    </Section>
  );
}

import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import AccountabilitySubmitButton from '@/components/accountability/AccountabilitySubmitButton';

function isChecked(formData: FormData, key: string) {
  return formData.get(key) === 'on';
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

type GoalSectionProps = {
  title: string;
  prefix: 'spiritual' | 'personal' | 'professional' | 'physical' | 'emotional';
  entry: Record<string, any> | null;
};

function GoalSection({ title, prefix, entry }: GoalSectionProps) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="text-base font-semibold text-white">{title}</div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Goal / Focus
          </label>
          <textarea
            name={`${prefix}_focus`}
            defaultValue={entry?.[`${prefix}_focus`] ?? ''}
            rows={3}
            placeholder={`Enter your ${title.toLowerCase()} focus for this month`}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['week1', 'week2', 'week3', 'week4'].map((week) => (
            <div key={week}>
              <label className="mb-2 block text-sm font-medium text-white">
                {week.replace('week', 'Week ')} Notes
              </label>
              <textarea
                name={`${prefix}_${week}_notes`}
                defaultValue={entry?.[`${prefix}_${week}_notes`] ?? ''}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-3 text-sm text-white">
          <input
            type="checkbox"
            name={`${prefix}_goal_met`}
            defaultChecked={Boolean(entry?.[`${prefix}_goal_met`])}
            className="h-4 w-4 rounded border-white/20 bg-black/40"
          />
          Goal met this month
        </label>
      </div>
    </Card>
  );
}

async function saveAccountability(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const user = await requireUser();

  const now = new Date();
  const entry_month = now.getMonth() + 1;
  const entry_year = now.getFullYear();

  const payload = {
    user_id: user.id,
    entry_month,
    entry_year,

    notes_obstacles_wins: textValue(formData, 'notes_obstacles_wins'),

    attended_monthly_club_meeting: isChecked(formData, 'attended_monthly_club_meeting'),
    memorized_scripture: isChecked(formData, 'memorized_scripture'),
    monthly_book_finished: isChecked(formData, 'monthly_book_finished'),

    spiritual_focus: textValue(formData, 'spiritual_focus'),
    spiritual_week1_notes: textValue(formData, 'spiritual_week1_notes'),
    spiritual_week2_notes: textValue(formData, 'spiritual_week2_notes'),
    spiritual_week3_notes: textValue(formData, 'spiritual_week3_notes'),
    spiritual_week4_notes: textValue(formData, 'spiritual_week4_notes'),
    spiritual_goal_met: isChecked(formData, 'spiritual_goal_met'),

    personal_focus: textValue(formData, 'personal_focus'),
    personal_week1_notes: textValue(formData, 'personal_week1_notes'),
    personal_week2_notes: textValue(formData, 'personal_week2_notes'),
    personal_week3_notes: textValue(formData, 'personal_week3_notes'),
    personal_week4_notes: textValue(formData, 'personal_week4_notes'),
    personal_goal_met: isChecked(formData, 'personal_goal_met'),

    professional_focus: textValue(formData, 'professional_focus'),
    professional_week1_notes: textValue(formData, 'professional_week1_notes'),
    professional_week2_notes: textValue(formData, 'professional_week2_notes'),
    professional_week3_notes: textValue(formData, 'professional_week3_notes'),
    professional_week4_notes: textValue(formData, 'professional_week4_notes'),
    professional_goal_met: isChecked(formData, 'professional_goal_met'),

    physical_focus: textValue(formData, 'physical_focus'),
    physical_week1_notes: textValue(formData, 'physical_week1_notes'),
    physical_week2_notes: textValue(formData, 'physical_week2_notes'),
    physical_week3_notes: textValue(formData, 'physical_week3_notes'),
    physical_week4_notes: textValue(formData, 'physical_week4_notes'),
    physical_goal_met: isChecked(formData, 'physical_goal_met'),

    emotional_focus: textValue(formData, 'emotional_focus'),
    emotional_week1_notes: textValue(formData, 'emotional_week1_notes'),
    emotional_week2_notes: textValue(formData, 'emotional_week2_notes'),
    emotional_week3_notes: textValue(formData, 'emotional_week3_notes'),
    emotional_week4_notes: textValue(formData, 'emotional_week4_notes'),
    emotional_goal_met: isChecked(formData, 'emotional_goal_met'),

    helped_group_member: textValue(formData, 'helped_group_member'),

    updated_at: new Date().toISOString(),
  };

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
      .update(payload)
      .eq('id', existing.id);
  } else {
    await supabase.from('accountability_entries').insert(payload);
  }

  revalidatePath('/portal');
  revalidatePath('/portal/accountability');

  return { success: true };
}

export default async function AccountabilityPage() {
  const supabase = await createClient();
  const user = await requireUser();

  const now = new Date();
  const entry_month = now.getMonth() + 1;
  const entry_year = now.getFullYear();

  const monthLabel = now.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

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
      description="Track your monthly commitments and weekly progress."
    >
      <form action={saveAccountability} className="space-y-6">
        <Card>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-medium text-white">Name</div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
                  {user.user_metadata?.full_name || user.email}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-white">Month Of</div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">
                  {monthLabel}
                </div>
              </div>
            </div>

            <textarea
              name="notes_obstacles_wins"
              defaultValue={entry?.notes_obstacles_wins ?? ''}
              rows={4}
              placeholder="Notes / Obstacles / Wins"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>
        </Card>

        <GoalSection title="Spiritual Goals" prefix="spiritual" entry={entry} />
        <GoalSection title="Personal Goals" prefix="personal" entry={entry} />
        <GoalSection title="Professional Goals" prefix="professional" entry={entry} />
        <GoalSection title="Physical Goals" prefix="physical" entry={entry} />
        <GoalSection title="Emotional Goals" prefix="emotional" entry={entry} />

        <Card>
          <textarea
            name="helped_group_member"
            defaultValue={entry?.helped_group_member ?? ''}
            rows={4}
            placeholder="How did you help another member?"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
          />

          <div className="pt-4">
            <AccountabilitySubmitButton />
          </div>
        </Card>
      </form>
    </Section>
  );
}

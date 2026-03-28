import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import AccountabilitySubmitButton from '@/components/accountability/AccountabilitySubmitButton';
import SaveSuccessMessage from '@/components/accountability/SaveSuccessMessage';

function isChecked(formData: FormData, key: string) {
  return formData.get(key) === 'on';
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

type GoalPrefix =
  | 'spiritual'
  | 'personal'
  | 'professional'
  | 'physical'
  | 'emotional';

function getGoalProgress(entry: any, prefix: GoalPrefix) {
  const focus = entry?.[`${prefix}_focus`] || '';
  const notes = ['week1', 'week2', 'week3', 'week4'].map(
    (w) => entry?.[`${prefix}_${w}_notes`] || ''
  );

  const weeklyFilled = notes.filter(Boolean).length;
  const totalFilled = [focus, ...notes].filter(Boolean).length;
  const goalMet = Boolean(entry?.[`${prefix}_goal_met`]);

  const percent = goalMet ? 100 : Math.round((totalFilled / 5) * 100);

  return {
    weeklyFilled,
    percent,
    goalMet,
  };
}

async function saveAccountability(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const user = await requireUser();

  const now = new Date();
  const entry_month = now.getMonth() + 1;
  const entry_year = now.getFullYear();

  // 🔥 GET PREVIOUS MONTH ENTRY (REAL STREAK LOGIC)
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);

  const { data: previous } = await supabase
    .from('accountability_entries')
    .select('streak_count, best_streak')
    .eq('user_id', user.id)
    .eq('entry_month', lastMonthDate.getMonth() + 1)
    .eq('entry_year', lastMonthDate.getFullYear())
    .maybeSingle();

  let streak = 1;
  let bestStreak = 1;

  if (previous) {
    streak = (previous.streak_count ?? 0) + 1;
    bestStreak = Math.max(streak, previous.best_streak ?? 1);
  }

  const payload: any = {
    user_id: user.id,
    entry_month,
    entry_year,

    streak_count: streak,
    best_streak: bestStreak,

    notes_obstacles_wins: textValue(formData, 'notes_obstacles_wins'),

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

    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from('accountability_entries')
    .select('id')
    .eq('user_id', user.id)
    .eq('entry_month', entry_month)
    .eq('entry_year', entry_year)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('accountability_entries')
      .update(payload)
      .eq('id', existing.id);
  } else {
    await supabase.from('accountability_entries').insert(payload);
  }

  revalidatePath('/portal/accountability');
  redirect('/portal/accountability?saved=1');
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
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

  const spiritual = getGoalProgress(entry, 'spiritual');
  const personal = getGoalProgress(entry, 'personal');
  const professional = getGoalProgress(entry, 'professional');
  const physical = getGoalProgress(entry, 'physical');
  const emotional = getGoalProgress(entry, 'emotional');

  const overall = Math.round(
    (spiritual.percent +
      personal.percent +
      professional.percent +
      physical.percent +
      emotional.percent) /
      5
  );

  const resolved = searchParams ? await searchParams : undefined;
  const saved = resolved?.saved === '1';

  return (
    <Section label="Portal" title="Accountability Tracker">
      <div className="space-y-6">
        {saved && <SaveSuccessMessage />}

        <Card>
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              Monthly Progress Dashboard
            </div>

            {/* 🔥 STREAK DISPLAY */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
                <div className="text-xs text-orange-300">
                  Current Streak
                </div>
                <div className="text-3xl font-bold text-white">
                  🔥 {entry?.streak_count ?? 1} months
                </div>
              </div>

              <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-4">
                <div className="text-xs text-yellow-300">
                  Best Streak
                </div>
                <div className="text-3xl font-bold text-white">
                  🏆 {entry?.best_streak ?? 1} months
                </div>
              </div>
            </div>

            <div className="text-white">
              Overall Progress: {overall}%
            </div>
          </div>
        </Card>

        <form action={saveAccountability} className="space-y-6">
          <Card>
            <textarea
              name="notes_obstacles_wins"
              defaultValue={entry?.notes_obstacles_wins ?? ''}
              placeholder="Notes / Obstacles / Wins"
              className="w-full rounded-xl bg-black/30 p-3 text-white"
            />
          </Card>

          <AccountabilitySubmitButton />
        </form>
      </div>
    </Section>
  );
}
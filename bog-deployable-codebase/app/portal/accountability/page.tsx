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

type GoalSectionProps = {
  title: string;
  prefix: GoalPrefix;
  entry: Record<string, any> | null;
};

function GoalSection({ title, prefix, entry }: GoalSectionProps) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="text-base font-semibold text-white">{title}</div>

        <textarea
          name={`${prefix}_focus`}
          defaultValue={entry?.[`${prefix}_focus`] ?? ''}
          rows={3}
          placeholder={`Enter your ${title.toLowerCase()} focus`}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['week1', 'week2', 'week3', 'week4'].map((week) => (
            <textarea
              key={week}
              name={`${prefix}_${week}_notes`}
              defaultValue={entry?.[`${prefix}_${week}_notes`] ?? ''}
              rows={3}
              placeholder={week.replace('week', 'Week ')}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          ))}
        </div>

        <label className="flex items-center gap-3 text-sm text-white">
          <input
            type="checkbox"
            name={`${prefix}_goal_met`}
            defaultChecked={Boolean(entry?.[`${prefix}_goal_met`])}
            className="h-4 w-4"
          />
          Goal met
        </label>
      </div>
    </Card>
  );
}

function getGoalProgress(entry: Record<string, any> | null, prefix: GoalPrefix) {
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

function ProgressCard({
  title,
  progress,
}: {
  title: string;
  progress: ReturnType<typeof getGoalProgress>;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5">
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-lg font-bold text-white">{title}</div>
          <div className="text-sm text-zinc-400">{progress.percent}%</div>
        </div>

        <div className="h-2 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-red-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-zinc-400">
          <span>{progress.weeklyFilled}/4 weeks</span>
          <span>{progress.goalMet ? 'Completed' : 'In Progress'}</span>
        </div>
      </div>
    </div>
  );
}

async function saveAccountability(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const user = await requireUser();

  const now = new Date();

  const payload = {
    user_id: user.id,
    entry_month: now.getMonth() + 1,
    entry_year: now.getFullYear(),

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
  };

  const { data: existing } = await supabase
    .from('accountability_entries')
    .select('id')
    .eq('user_id', user.id)
    .eq('entry_month', payload.entry_month)
    .eq('entry_year', payload.entry_year)
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

  const { data: entry } = await supabase
    .from('accountability_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_month', now.getMonth() + 1)
    .eq('entry_year', now.getFullYear())
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

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const saved = resolvedSearchParams?.saved === '1';

  return (
    <Section
      label="Portal"
      title="Accountability Tracker"
      description="Track your monthly commitments and weekly progress."
    >
      <div className="space-y-6">
        {saved && <SaveSuccessMessage />}

        <Card>
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              Monthly Progress
            </div>
            <div className="text-4xl text-white">{overall}%</div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ProgressCard title="Spiritual" progress={spiritual} />
              <ProgressCard title="Personal" progress={personal} />
              <ProgressCard title="Professional" progress={professional} />
              <ProgressCard title="Physical" progress={physical} />
              <ProgressCard title="Emotional" progress={emotional} />
            </div>
          </div>
        </Card>

        <form action={saveAccountability} className="space-y-6">
          <GoalSection title="Spiritual" prefix="spiritual" entry={entry} />
          <GoalSection title="Personal" prefix="personal" entry={entry} />
          <GoalSection title="Professional" prefix="professional" entry={entry} />
          <GoalSection title="Physical" prefix="physical" entry={entry} />
          <GoalSection title="Emotional" prefix="emotional" entry={entry} />

          <AccountabilitySubmitButton />
        </form>
      </div>
    </Section>
  );
}

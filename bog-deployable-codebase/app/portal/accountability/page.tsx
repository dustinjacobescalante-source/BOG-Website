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

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Goal / Focus
          </label>
          <textarea
            name={`${prefix}_focus`}
            defaultValue={entry?.[`${prefix}_focus`] ?? ''}
            rows={3}
            placeholder={`Enter your ${title.toLowerCase()} focus`}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
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
                rows={3}
                placeholder={week.replace('week', 'Week ')}
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
            className="h-4 w-4"
          />
          Goal met
        </label>
      </div>
    </Card>
  );
}

function getGoalProgress(entry: Record<string, any> | null, prefix: GoalPrefix) {
  const focus = String(entry?.[`${prefix}_focus`] ?? '').trim();
  const notes = ['week1', 'week2', 'week3', 'week4'].map((w) =>
    String(entry?.[`${prefix}_${w}_notes`] ?? '').trim()
  );

  const weeklyFilled = notes.filter(Boolean).length;
  const totalFilled = [focus, ...notes].filter(Boolean).length;
  const goalMet = Boolean(entry?.[`${prefix}_goal_met`]);

  const percent = goalMet ? 100 : Math.round((totalFilled / 5) * 100);

  let status = 'Not Started';
  if (goalMet) {
    status = 'Completed';
  } else if (totalFilled > 0) {
    status = 'In Progress';
  }

  return {
    weeklyFilled,
    percent,
    goalMet,
    status,
  };
}

function ProgressCard({
  title,
  progress,
}: {
  title: string;
  progress: ReturnType<typeof getGoalProgress>;
}) {
  const statusClasses = progress.goalMet
    ? 'border-green-500/30 bg-green-500/10 text-green-300'
    : progress.percent > 0
    ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
    : 'border-white/10 bg-white/5 text-zinc-300';

  const barClass = progress.goalMet
    ? 'bg-green-400'
    : progress.percent > 0
    ? 'bg-red-400'
    : 'bg-zinc-500';

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-white">{title}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.15em] text-zinc-500">
              Monthly Category
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClasses}`}
          >
            {progress.status}
          </span>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span>Progress</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10">
            <div
              className={`h-2.5 rounded-full transition-all ${barClass}`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
              Weekly Notes
            </div>
            <div className="mt-2 text-3xl font-bold leading-none text-white">
              {progress.weeklyFilled}/4
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
              Goal Met
            </div>
            <div className="mt-2 text-3xl font-bold leading-none text-white">
              {progress.goalMet ? 'Yes' : 'No'}
            </div>
          </div>
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

  if (existing) {
    await supabase
      .from('accountability_entries')
      .update(payload)
      .eq('id', existing.id);
  } else {
    await supabase.from('accountability_entries').insert(payload);
  }

  revalidatePath('/portal');
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
          <div className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Progress Dashboard
                </div>
                <div className="mt-2 text-3xl font-bold text-white">
                  Monthly Progress Dashboard
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  Snapshot for {monthLabel}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-right">
                <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                  Overall Progress
                </div>
                <div className="mt-1 text-4xl font-bold leading-none text-white">
                  {overall}%
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
                <span>Overall Completion</span>
                <span>{overall}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-red-500 transition-all"
                  style={{ width: `${overall}%` }}
                />
              </div>
            </div>

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

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Notes / Obstacles / Wins
                </label>
                <textarea
                  name="notes_obstacles_wins"
                  defaultValue={entry?.notes_obstacles_wins ?? ''}
                  rows={4}
                  placeholder="Notes / Obstacles / Wins"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
                  <input
                    type="checkbox"
                    name="attended_monthly_club_meeting"
                    defaultChecked={Boolean(entry?.attended_monthly_club_meeting)}
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                  />
                  Attended Monthly Club Meeting
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
                  <input
                    type="checkbox"
                    name="memorized_scripture"
                    defaultChecked={Boolean(entry?.memorized_scripture)}
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                  />
                  Memorized the Scripture
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
                  <input
                    type="checkbox"
                    name="monthly_book_finished"
                    defaultChecked={Boolean(entry?.monthly_book_finished)}
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                  />
                  Monthly Book Finished
                </label>
              </div>
            </div>
          </Card>

          <GoalSection title="Spiritual Goals" prefix="spiritual" entry={entry} />
          <GoalSection title="Personal Goals" prefix="personal" entry={entry} />
          <GoalSection title="Professional Goals" prefix="professional" entry={entry} />
          <GoalSection title="Physical Goals" prefix="physical" entry={entry} />
          <GoalSection title="Emotional Goals" prefix="emotional" entry={entry} />

          <Card>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  How did you help another member?
                </label>
                <textarea
                  name="helped_group_member"
                  defaultValue={entry?.helped_group_member ?? ''}
                  rows={4}
                  placeholder="How did you help another member?"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                />
              </div>

              <div className="pt-4">
                <AccountabilitySubmitButton />
              </div>
            </div>
          </Card>
        </form>
      </div>
    </Section>
  );
}
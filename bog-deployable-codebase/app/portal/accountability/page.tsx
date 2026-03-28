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
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-white">{title}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              Monthly Goal Category
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Goal / Focus
          </label>
          <textarea
            name={`${prefix}_focus`}
            defaultValue={entry?.[`${prefix}_focus`] ?? ''}
            rows={3}
            placeholder={`Enter your ${title.toLowerCase()} focus`}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['week1', 'week2', 'week3', 'week4'].map((week, index) => (
            <div
              key={week}
              className="rounded-2xl border border-white/10 bg-black/20 p-3"
            >
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Week {index + 1}
              </label>
              <textarea
                name={`${prefix}_${week}_notes`}
                defaultValue={entry?.[`${prefix}_${week}_notes`] ?? ''}
                rows={4}
                placeholder={`Week ${index + 1} progress`}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />
            </div>
          ))}
        </div>

        <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
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

function getGoalProgress(entry: Record<string, any> | null, prefix: GoalPrefix) {
  const focus = String(entry?.[`${prefix}_focus`] ?? '').trim();
  const week1 = String(entry?.[`${prefix}_week1_notes`] ?? '').trim();
  const week2 = String(entry?.[`${prefix}_week2_notes`] ?? '').trim();
  const week3 = String(entry?.[`${prefix}_week3_notes`] ?? '').trim();
  const week4 = String(entry?.[`${prefix}_week4_notes`] ?? '').trim();
  const goalMet = Boolean(entry?.[`${prefix}_goal_met`]);

  const notes = [week1, week2, week3, week4];
  const weeklyFilled = notes.filter(Boolean).length;
  const totalFilled = [focus, ...notes].filter(Boolean).length;
  const percent = goalMet ? 100 : Math.round((totalFilled / 5) * 100);

  let status = 'Not Started';
  if (goalMet) {
    status = 'Completed';
  } else if (totalFilled > 0) {
    status = 'In Progress';
  }

  const missingWeeks = notes
    .map((value, index) => (!value ? `Week ${index + 1}` : null))
    .filter(Boolean) as string[];

  return {
    weeklyFilled,
    percent,
    goalMet,
    status,
    hasFocus: Boolean(focus),
    missingWeeks,
  };
}

function getCategoryStyle(progress: ReturnType<typeof getGoalProgress>) {
  if (progress.goalMet) {
    return {
      pill: 'border-green-500/30 bg-green-500/10 text-green-300',
      bar: 'bg-green-400',
      glow:
        'shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_12px_40px_rgba(34,197,94,0.08)]',
    };
  }

  if (progress.percent > 0) {
    return {
      pill: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
      bar: 'bg-red-400',
      glow:
        'shadow-[0_0_0_1px_rgba(239,68,68,0.08),0_12px_40px_rgba(239,68,68,0.08)]',
    };
  }

  return {
    pill: 'border-white/10 bg-white/5 text-zinc-300',
    bar: 'bg-zinc-500',
    glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.03)]',
  };
}

function getCategoryAccent(title: string) {
  switch (title) {
    case 'Spiritual':
      return 'from-violet-500/20 to-fuchsia-500/5';
    case 'Personal':
      return 'from-sky-500/20 to-cyan-500/5';
    case 'Professional':
      return 'from-amber-500/20 to-orange-500/5';
    case 'Physical':
      return 'from-red-500/20 to-rose-500/5';
    case 'Emotional':
      return 'from-emerald-500/20 to-teal-500/5';
    default:
      return 'from-white/10 to-white/5';
  }
}

function getCategoryIcon(title: string) {
  switch (title) {
    case 'Spiritual':
      return '✝️';
    case 'Personal':
      return '🧠';
    case 'Professional':
      return '💼';
    case 'Physical':
      return '💪';
    case 'Emotional':
      return '🫀';
    default:
      return '•';
  }
}

function ProgressCard({
  title,
  progress,
}: {
  title: string;
  progress: ReturnType<typeof getGoalProgress>;
}) {
  const styles = getCategoryStyle(progress);
  const accent = getCategoryAccent(title);

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1220]/85 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 ${styles.glow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-100`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-lg">
              {getCategoryIcon(title)}
            </div>

            <div>
              <div className="text-xl font-bold text-white">{title}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Monthly category
              </div>
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles.pill}`}
          >
            {progress.status}
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
              Progress
            </div>
            <div className="mt-1 text-4xl font-bold leading-none text-white">
              {progress.percent}%
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Goal Met
            </div>
            <div className="mt-1 text-lg font-bold text-white">
              {progress.goalMet ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span>Completion</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/10">
            <div
              className={`h-2.5 rounded-full transition-all ${styles.bar}`}
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
              Status
            </div>
            <div className="mt-2 text-lg font-bold leading-none text-white">
              {progress.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardNudges({
  overall,
  streakCount,
  completedCount,
  inProgressCount,
  notStartedCount,
  missingWeekThreeCount,
}: {
  overall: number;
  streakCount: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  missingWeekThreeCount: number;
}) {
  let headline = '⚠️ Falling behind';
  let headlineClass =
    'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
  let body =
    'You have unfinished categories this month. Keep your streak alive by filling in your next steps.';

  if (completedCount === 5) {
    headline = '🏆 Monthly tracker completed';
    headlineClass = 'border-green-500/30 bg-green-500/10 text-green-300';
    body =
      'All five categories are complete. Strong work staying consistent this month.';
  } else if (overall >= 80) {
    headline = '🔥 You are on track';
    headlineClass = 'border-green-500/30 bg-green-500/10 text-green-300';
    body =
      'Your tracker is in a strong place. Finish the remaining items and lock in the month.';
  } else if (inProgressCount > 0 && notStartedCount === 0) {
    headline = '📈 Good momentum';
    headlineClass = 'border-sky-500/30 bg-sky-500/10 text-sky-300';
    body =
      'Every category has been started. Keep stacking weekly progress notes.';
  }

  const nudges: string[] = [];

  if (streakCount > 1 && completedCount < 5) {
    nudges.push(`You are protecting a ${streakCount}-month streak.`);
  }

  if (notStartedCount > 0) {
    nudges.push(
      `${notStartedCount} categor${notStartedCount === 1 ? 'y is' : 'ies are'} still not started.`
    );
  }

  if (missingWeekThreeCount > 0) {
    nudges.push(
      `Week 3 is still blank in ${missingWeekThreeCount} categor${
        missingWeekThreeCount === 1 ? 'y' : 'ies'
      }.`
    );
  }

  if (completedCount < 5 && completedCount > 0) {
    nudges.push(`${completedCount}/5 categories are fully completed.`);
  }

  if (nudges.length === 0) {
    nudges.push('Keep updating your weekly notes to maintain momentum.');
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className={`rounded-2xl border px-4 py-3 ${headlineClass}`}>
          <div className="text-sm font-semibold">{headline}</div>
          <div className="mt-1 text-sm opacity-90">{body}</div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {nudges.map((nudge) => (
            <div
              key={nudge}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300"
            >
              {nudge}
            </div>
          ))}
        </div>
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

  const payload = {
    user_id: user.id,
    entry_month,
    entry_year,

    streak_count: streak,
    best_streak: bestStreak,

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
    .select('id, streak_count, best_streak')
    .eq('user_id', user.id)
    .eq('entry_month', entry_month)
    .eq('entry_year', entry_year)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('accountability_entries')
      .update({
        ...payload,
        streak_count: existing.streak_count ?? streak,
        best_streak: existing.best_streak ?? bestStreak,
      })
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

  const progressList = [spiritual, personal, professional, physical, emotional];

  const overall = Math.round(
    (
      spiritual.percent +
      personal.percent +
      professional.percent +
      physical.percent +
      emotional.percent
    ) / 5
  );

  const completedCount = progressList.filter((item) => item.goalMet).length;
  const inProgressCount = progressList.filter(
    (item) => item.status === 'In Progress'
  ).length;
  const notStartedCount = progressList.filter(
    (item) => item.status === 'Not Started'
  ).length;
  const missingWeekThreeCount = progressList.filter((item) =>
    item.missingWeeks.includes('Week 3')
  ).length;

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

        <DashboardNudges
          overall={overall}
          streakCount={entry?.streak_count ?? 1}
          completedCount={completedCount}
          inProgressCount={inProgressCount}
          notStartedCount={notStartedCount}
          missingWeekThreeCount={missingWeekThreeCount}
        />

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

              <div className="rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-right shadow-[0_12px_40px_rgba(239,68,68,0.08)]">
                <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                  Overall Progress
                </div>
                <div className="mt-1 text-4xl font-bold leading-none text-white">
                  {overall}%
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-orange-300">
                  Current Streak
                </div>
                <div className="mt-1 text-3xl font-bold text-white">
                  🔥 {entry?.streak_count ?? 1} months
                </div>
              </div>

              <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-yellow-300">
                  Best Streak
                </div>
                <div className="mt-1 text-3xl font-bold text-white">
                  🏆 {entry?.best_streak ?? 1} months
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
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
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
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
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
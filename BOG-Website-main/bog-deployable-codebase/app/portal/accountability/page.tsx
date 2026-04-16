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

function intValue(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? '').trim();
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed);
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
  disabled?: boolean;
};

type HabitEntry = {
  id: string;
  user_id: string;
  entry_month: number;
  entry_year: number;
  display_order: number;
  action: string;
  goal_days: number | null;
  habit_time: string | null;
  location: string | null;
  checked_days: number[] | null;
  created_at: string;
  updated_at: string;
};

const HABIT_ROW_COUNT = 8;
const DAYS_IN_TRACKER = 31;

function GoalSection({ title, prefix, entry, disabled = false }: GoalSectionProps) {
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
            disabled={disabled}
            placeholder={`Enter your ${title.toLowerCase()} focus`}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
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
                disabled={disabled}
                placeholder={`Week ${index + 1} progress`}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
              />
            </div>
          ))}
        </div>

        <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
          <input
            type="checkbox"
            name={`${prefix}_goal_met`}
            defaultChecked={Boolean(entry?.[`${prefix}_goal_met`])}
            disabled={disabled}
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

  let percent = 0;

  if (focus) percent += 20;
  if (week1) percent += 15;
  if (week2) percent += 15;
  if (week3) percent += 15;
  if (week4) percent += 15;
  if (goalMet) percent += 20;

  let status = 'Not Started';
  if (goalMet) {
    status = 'Completed';
  } else if (focus || week1 || week2 || week3 || week4) {
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
      return '❤️';
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
      className={`group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1220]/85 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 ${styles.glow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-100`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative flex h-full flex-col space-y-5">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-lg">
              {getCategoryIcon(title)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[1.5rem] font-bold leading-tight text-white sm:text-[1.7rem]">
                {title}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Monthly Category
              </div>
            </div>
          </div>

          <div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles.pill}`}
            >
              {progress.status}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              Progress
            </div>
            <div className="mt-2 text-5xl font-bold leading-none text-white">
              {progress.percent}%
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Goal Met
            </div>
            <div className="mt-1 text-xl font-bold text-white">
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

        <div className="mt-auto">
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
            <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              Weekly Notes
            </div>
            <div className="mt-2 text-3xl font-bold leading-none text-white">
              {progress.weeklyFilled}/4
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
  streakBroken,
  lastSubmittedLabel,
}: {
  overall: number;
  streakCount: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  missingWeekThreeCount: number;
  streakBroken: boolean;
  lastSubmittedLabel: string | null;
}) {
  let headline = '⚠️ Falling behind';
  let headlineClass =
    'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
  let body =
    'You have unfinished categories this month. Keep your streak alive by filling in your next steps.';

  if (streakBroken) {
    headline = '💥 Your streak was broken';
    headlineClass = 'border-red-500/30 bg-red-500/10 text-red-300';
    body = lastSubmittedLabel
      ? `You missed a month. Your last completed submission was ${lastSubmittedLabel}.`
      : 'You missed a month and your streak has reset.';
  } else if (completedCount === 5) {
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

  if (!streakBroken && streakCount > 1 && completedCount < 5) {
    nudges.push(`You are protecting a ${streakCount}-month streak.`);
  }

  if (streakBroken) {
    nudges.push('Start strong this month to begin a new streak.');
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

function isMonthComplete(progressList: ReturnType<typeof getGoalProgress>[]) {
  return progressList.every((item) => item.goalMet);
}

function CompletionBanner({
  isComplete,
}: {
  isComplete: boolean;
}) {
  if (!isComplete) return null;

  return (
    <Card>
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <div className="text-xs uppercase tracking-widest text-green-300">
          Month Complete
        </div>
        <div className="mt-2 text-3xl font-bold text-white">
          🏆 5 / 5 Categories Completed
        </div>
        <div className="mt-2 text-sm text-green-200">
          Strong discipline. You finished the month.
        </div>
      </div>
    </Card>
  );
}

function getHabitMetrics(habits: HabitEntry[]) {
  const activeHabits = habits.filter((habit) => {
    const action = String(habit.action ?? '').trim();
    const days = Array.isArray(habit.checked_days) ? habit.checked_days : [];
    const goal = Number(habit.goal_days ?? 0);
    return action || days.length > 0 || goal > 0;
  });

  const totalCompleted = activeHabits.reduce((sum, habit) => {
    const days = Array.isArray(habit.checked_days) ? habit.checked_days.length : 0;
    return sum + days;
  }, 0);

  const totalGoal = activeHabits.reduce((sum, habit) => {
    return sum + Math.max(0, Number(habit.goal_days ?? 0));
  }, 0);

  const habitsAtGoal = activeHabits.filter((habit) => {
    const goal = Math.max(0, Number(habit.goal_days ?? 0));
    const completed = Array.isArray(habit.checked_days) ? habit.checked_days.length : 0;
    return goal > 0 && completed >= goal;
  }).length;

  const percent =
    totalGoal > 0 ? Math.min(100, Math.round((totalCompleted / totalGoal) * 100)) : 0;

  return {
    activeHabits: activeHabits.length,
    totalCompleted,
    totalGoal,
    habitsAtGoal,
    percent,
  };
}

function getHabitRowStyle(goalDays: number, completedDays: number) {
  if (goalDays <= 0) {
    return {
      row: 'bg-[#111827]',
      pill: 'border-white/10 bg-black/30 text-zinc-300',
      progress: 'bg-zinc-500',
      label: 'No Goal',
      labelClass: 'border-white/10 bg-white/5 text-zinc-300',
    };
  }

  if (completedDays >= goalDays) {
    return {
      row: 'bg-green-500/5',
      pill: 'border-green-500/30 bg-green-500/10 text-green-300',
      progress: 'bg-green-400',
      label: 'Goal Met',
      labelClass: 'border-green-500/30 bg-green-500/10 text-green-300',
    };
  }

  const percent = Math.round((completedDays / goalDays) * 100);

  if (percent >= 50) {
    return {
      row: 'bg-yellow-500/5',
      pill: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
      progress: 'bg-yellow-400',
      label: 'In Progress',
      labelClass: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    };
  }

  return {
    row: 'bg-red-500/5',
    pill: 'border-red-500/30 bg-red-500/10 text-red-300',
    progress: 'bg-red-400',
    label: 'Behind',
    labelClass: 'border-red-500/30 bg-red-500/10 text-red-300',
  };
}

function HabitSummaryCard({ habits }: { habits: HabitEntry[] }) {
  const metrics = getHabitMetrics(habits);

  let statusText = 'No goals set yet';
  let statusClass = 'border-white/10 bg-white/5 text-zinc-300';

  if (metrics.totalGoal > 0 && metrics.percent >= 100) {
    statusText = 'All habit goals met';
    statusClass = 'border-green-500/30 bg-green-500/10 text-green-300';
  } else if (metrics.totalGoal > 0 && metrics.percent >= 75) {
    statusText = 'Strong consistency';
    statusClass = 'border-green-500/30 bg-green-500/10 text-green-300';
  } else if (metrics.totalGoal > 0 && metrics.percent >= 40) {
    statusText = 'Building momentum';
    statusClass = 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
  } else if (metrics.totalGoal > 0) {
    statusText = 'Needs attention';
    statusClass = 'border-red-500/30 bg-red-500/10 text-red-300';
  }

  return (
    <Card>
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1220]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_45%)]" />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Habit Summary
              </div>
              <div className="mt-2 text-3xl font-bold tracking-[-0.03em] text-white">
                Monthly Consistency
              </div>
              <div className="mt-1 text-sm text-zinc-400">
                Executive snapshot of your habit performance for this month.
              </div>
            </div>

            <div
              className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusClass}`}
            >
              {statusText}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[26px] border border-white/10 bg-black/30 px-5 py-5">
              <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                Overall Habit Completion
              </div>

              <div className="mt-4 text-5xl font-bold leading-none text-white">
                {metrics.percent}%
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
                  <span>Completion Rate</span>
                  <span>{metrics.percent}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-red-500 transition-all"
                    style={{ width: `${metrics.percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[26px] border border-white/10 bg-black/30 px-5 py-5">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  Active Habits
                </div>
                <div className="mt-2 text-3xl font-bold text-white">
                  {metrics.activeHabits}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  Habits currently being tracked
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-black/30 px-5 py-5">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  Habits At Goal
                </div>
                <div className="mt-2 text-3xl font-bold text-white">
                  {metrics.habitsAtGoal}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  Habits that hit target days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function HabitTrackerSection({
  habits,
  disabled,
}: {
  habits: HabitEntry[];
  disabled: boolean;
}) {
  const rows = Array.from({ length: HABIT_ROW_COUNT }, (_, index) => {
    return habits.find((habit) => habit.display_order === index) ?? null;
  });

  const metrics = getHabitMetrics(habits);

  return (
    <Card>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Habit Tracker
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              Consistency Sheet
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              Set a monthly target for each habit, mark completed days, and track your pace against the goal.
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                Active Habits
              </div>
              <div className="mt-1 text-2xl font-bold text-white">
                {metrics.activeHabits}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                Goal Progress
              </div>
              <div className="mt-1 text-2xl font-bold text-white">
                {metrics.percent}%
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                Habits At Goal
              </div>
              <div className="mt-1 text-2xl font-bold text-white">
                {metrics.habitsAtGoal}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
            <span>Overall Habit Goal Completion</span>
            <span>{metrics.percent}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-red-500 transition-all"
              style={{ width: `${metrics.percent}%` }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1760px] rounded-[30px] border border-white/10 bg-[#0b0f16] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_40px_rgba(0,0,0,0.30)]">
            <table className="w-full border-separate border-spacing-0 text-left text-sm text-zinc-300">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 min-w-[280px] border-b border-white/10 bg-[#0b0f16] px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Action / Habit
                  </th>
                  <th className="min-w-[140px] border-b border-white/10 bg-[#111827] px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Goal Days / Month
                  </th>
                  {Array.from({ length: DAYS_IN_TRACKER }, (_, dayIndex) => (
                    <th
                      key={dayIndex + 1}
                      className="w-[42px] border-b border-white/10 bg-[#111827] px-2 py-4 text-center text-[11px] font-semibold text-zinc-400"
                    >
                      {dayIndex + 1}
                    </th>
                  ))}
                  <th className="min-w-[95px] border-b border-white/10 bg-[#111827] px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Done
                  </th>
                  <th className="min-w-[150px] border-b border-white/10 bg-[#111827] px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    % of Goal Completed
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((habit, rowIndex) => {
                  const checkedDays = Array.isArray(habit?.checked_days)
                    ? habit.checked_days
                    : [];
                  const goalDays = Math.max(0, Number(habit?.goal_days ?? 0));
                  const completedDays = checkedDays.length;
                  const percentToGoal =
                    goalDays > 0 ? Math.min(100, Math.round((completedDays / goalDays) * 100)) : 0;
                  const rowStyles = getHabitRowStyle(goalDays, completedDays);

                  return (
                    <tr key={rowIndex} className={rowStyles.row}>
                      <td className="sticky left-0 z-10 border-b border-white/5 bg-[#0b0f16] px-4 py-3 align-middle">
                        <input
                          type="text"
                          name={`habit_${rowIndex}_action`}
                          defaultValue={habit?.action ?? ''}
                          disabled={disabled}
                          placeholder={`Habit ${rowIndex + 1}`}
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
                        />
                      </td>

                      <td className="border-b border-white/5 bg-[#111827] px-3 py-3 text-center align-middle">
                        <div className="space-y-1">
                          <input
                            type="number"
                            min={0}
                            name={`habit_${rowIndex}_goal_days`}
                            defaultValue={goalDays}
                            disabled={disabled}
                            placeholder="0"
                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-center text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
                          />
                          <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                            days / month
                          </div>
                        </div>
                      </td>

                      {Array.from({ length: DAYS_IN_TRACKER }, (_, dayIndex) => {
                        const day = dayIndex + 1;
                        const checked = checkedDays.includes(day);

                        return (
                          <td
                            key={day}
                            className="border-b border-white/5 bg-[#111827] px-2 py-3 text-center align-middle"
                          >
                            <input
                              type="checkbox"
                              name={`habit_${rowIndex}_day_${day}`}
                              defaultChecked={checked}
                              disabled={disabled}
                              className="h-4 w-4 rounded border-white/20 bg-black/40"
                            />
                          </td>
                        );
                      })}

                      <td className="border-b border-white/5 bg-[#111827] px-3 py-3 text-center align-middle">
                        <div className={`rounded-2xl border px-3 py-2 text-sm font-bold ${rowStyles.pill}`}>
                          {completedDays}
                        </div>
                      </td>

                      <td className="border-b border-white/5 bg-[#111827] px-3 py-3 text-center align-middle">
                        <div className="space-y-2">
                          <div className={`rounded-2xl border px-3 py-2 text-sm font-bold ${rowStyles.pill}`}>
                            {goalDays > 0 ? `${percentToGoal}%` : '0%'}
                          </div>

                          <div className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${rowStyles.labelClass}`}>
                            {rowStyles.label}
                          </div>

                          <div className="h-2 rounded-full bg-white/10">
                            <div
                              className={`h-2 rounded-full transition-all ${rowStyles.progress}`}
                              style={{ width: `${goalDays > 0 ? percentToGoal : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

  await supabase
    .from('accountability_habits')
    .delete()
    .eq('user_id', user.id)
    .eq('entry_month', entry_month)
    .eq('entry_year', entry_year);

  const habitRows = [];

  for (let rowIndex = 0; rowIndex < HABIT_ROW_COUNT; rowIndex++) {
    const action = textValue(formData, `habit_${rowIndex}_action`);
    const goal_days = intValue(formData, `habit_${rowIndex}_goal_days`);
    const checked_days = Array.from({ length: DAYS_IN_TRACKER }, (_, dayIndex) => dayIndex + 1)
      .filter((day) => isChecked(formData, `habit_${rowIndex}_day_${day}`));

    if (action || checked_days.length > 0 || goal_days > 0) {
      habitRows.push({
        user_id: user.id,
        entry_month,
        entry_year,
        display_order: rowIndex,
        action: action || '',
        goal_days,
        habit_time: null,
        location: null,
        checked_days,
        updated_at: new Date().toISOString(),
      });
    }
  }

  if (habitRows.length > 0) {
    await supabase.from('accountability_habits').insert(habitRows);
  }

  revalidatePath('/portal');
  revalidatePath('/portal/accountability');
  redirect('/portal/accountability?saved=1');
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; month?: string; year?: string }>;
}) {
  const supabase = await createClient();
  const user = await requireUser();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedMonth = Number(resolvedSearchParams?.month);
  const requestedYear = Number(resolvedSearchParams?.year);

  const entry_month =
    Number.isFinite(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12
      ? requestedMonth
      : currentMonth;

  const entry_year =
    Number.isFinite(requestedYear) && requestedYear >= 2000
      ? requestedYear
      : currentYear;

  const isCurrentMonthView =
    entry_month === currentMonth && entry_year === currentYear;

  const monthLabel = new Date(entry_year, entry_month - 1, 1).toLocaleString('en-US', {
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

  const { data: habits } = await supabase
    .from('accountability_habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_month', entry_month)
    .eq('entry_year', entry_year)
    .order('display_order', { ascending: true });

  const typedHabits = (habits as HabitEntry[] | null) ?? [];

  const { data: allEntries } = await supabase
    .from('accountability_entries')
    .select('entry_month, entry_year')
    .eq('user_id', user.id)
    .order('entry_year', { ascending: false })
    .order('entry_month', { ascending: false });

  const { data: lastEntry } = await supabase
    .from('accountability_entries')
    .select('entry_month, entry_year, streak_count, best_streak')
    .eq('user_id', user.id)
    .order('entry_year', { ascending: false })
    .order('entry_month', { ascending: false })
    .limit(1)
    .maybeSingle();

  let streakBroken = false;
  let displayStreak = entry?.streak_count ?? 1;
  let displayBestStreak = entry?.best_streak ?? 1;
  let lastSubmittedLabel: string | null = null;

  if (lastEntry) {
    const thisMonthIndex = currentYear * 12 + currentMonth;
    const lastEntryIndex = lastEntry.entry_year * 12 + lastEntry.entry_month;
    const monthsSinceLastEntry = thisMonthIndex - lastEntryIndex;

    lastSubmittedLabel = new Date(
      lastEntry.entry_year,
      lastEntry.entry_month - 1,
      1
    ).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    if (!isCurrentMonthView || !entry) {
      if (monthsSinceLastEntry > 1) {
        streakBroken = true;
        displayStreak = 0;
      } else if (monthsSinceLastEntry === 1) {
        displayStreak = lastEntry.streak_count ?? 1;
      } else {
        displayStreak = lastEntry.streak_count ?? 1;
      }

      displayBestStreak = lastEntry.best_streak ?? lastEntry.streak_count ?? 1;
    }
  }

  const spiritual = getGoalProgress(entry, 'spiritual');
  const personal = getGoalProgress(entry, 'personal');
  const professional = getGoalProgress(entry, 'professional');
  const physical = getGoalProgress(entry, 'physical');
  const emotional = getGoalProgress(entry, 'emotional');

  const progressList = [spiritual, personal, professional, physical, emotional];
  const isComplete = isMonthComplete(progressList);
  const isArchivedView = !isCurrentMonthView;
  const formLocked = isArchivedView || isComplete;

  const habitMetrics = getHabitMetrics(typedHabits);

  const accountabilityOverall = Math.round(
    (
      spiritual.percent +
      personal.percent +
      professional.percent +
      physical.percent +
      emotional.percent
    ) / 5
  );

  const overall = Math.round((accountabilityOverall + habitMetrics.percent) / 2);

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

  const saved = resolvedSearchParams?.saved === '1';

  return (
    <Section
      label="Portal"
      title="Accountability Tracker"
      description="Track your monthly commitments and weekly progress."
    >
      <div className="space-y-6">
        {saved && isCurrentMonthView && <SaveSuccessMessage />}

        <Card>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Archive
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  Review Previous Months
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  Switch between the current month and past tracker entries.
                </div>
              </div>

              <form method="GET" className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Month
                  </label>
                  <select
                    name="month"
                    defaultValue={String(entry_month)}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                      <option key={month} value={month} className="bg-zinc-900">
                        {new Date(2026, month - 1, 1).toLocaleString('en-US', {
                          month: 'long',
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Year
                  </label>
                  <select
                    name="year"
                    defaultValue={String(entry_year)}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    {Array.from(
                      new Set([
                        currentYear,
                        ...(allEntries ?? []).map((item) => item.entry_year),
                      ])
                    )
                      .sort((a, b) => b - a)
                      .map((year) => (
                        <option key={year} value={year} className="bg-zinc-900">
                          {year}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white hover:bg-white/5"
                >
                  View Month
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
              Viewing: <span className="font-semibold text-white">{monthLabel}</span>
              {isArchivedView ? ' • Read-only archive view' : ' • Current active month'}
            </div>
          </div>
        </Card>

        <CompletionBanner isComplete={isComplete} />

        <DashboardNudges
          overall={overall}
          streakCount={displayStreak}
          completedCount={completedCount}
          inProgressCount={inProgressCount}
          notStartedCount={notStartedCount}
          missingWeekThreeCount={missingWeekThreeCount}
          streakBroken={streakBroken}
          lastSubmittedLabel={lastSubmittedLabel}
        />

        <HabitSummaryCard habits={typedHabits} />

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
                <div className="mt-2 text-xs text-zinc-500">
                  Accountability {accountabilityOverall}% • Habits {habitMetrics.percent}%
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-orange-300">
                  Current Streak
                </div>
                <div className="mt-1 text-3xl font-bold text-white">
                  🔥 {displayStreak} months
                </div>
              </div>

              <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-4">
                <div className="text-xs uppercase tracking-wide text-yellow-300">
                  Best Streak
                </div>
                <div className="mt-1 text-3xl font-bold text-white">
                  🏆 {displayBestStreak} months
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/20 px-6 py-6">
                <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                  Accountability Score
                </div>
                <div className="mt-2 text-4xl font-bold leading-none text-white">
                  {accountabilityOverall}%
                </div>
                <div className="mt-3 text-sm text-zinc-500">
                  Focus, weekly notes, and goal met
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 px-6 py-6">
                <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                  Habit Score
                </div>
                <div className="mt-2 text-4xl font-bold leading-none text-white">
                  {habitMetrics.percent}%
                </div>
                <div className="mt-3 text-sm text-zinc-500">
                  Based on monthly habit targets
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
              {[
                <ProgressCard key="spiritual" title="Spiritual" progress={spiritual} />,
                <ProgressCard key="personal" title="Personal" progress={personal} />,
                <ProgressCard key="professional" title="Professional" progress={professional} />,
              ]}
            </div>

            <div className="mx-auto grid max-w-[760px] gap-4 md:grid-cols-2">
              <ProgressCard title="Physical" progress={physical} />
              <ProgressCard title="Emotional" progress={emotional} />
            </div>
          </div>
        </Card>

        <form action={saveAccountability} className="space-y-6">
          {formLocked && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {isArchivedView
                ? 'This is a previous month. Archive entries are read-only.'
                : 'This month is complete. Editing is locked.'}
            </div>
          )}

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
                  disabled={formLocked}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
                  <input
                    type="checkbox"
                    name="attended_monthly_club_meeting"
                    defaultChecked={Boolean(entry?.attended_monthly_club_meeting)}
                    disabled={formLocked}
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                  />
                  Attended Monthly Club Meeting
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
                  <input
                    type="checkbox"
                    name="memorized_scripture"
                    defaultChecked={Boolean(entry?.memorized_scripture)}
                    disabled={formLocked}
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                  />
                  Memorized the Scripture
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
                  <input
                    type="checkbox"
                    name="monthly_book_finished"
                    defaultChecked={Boolean(entry?.monthly_book_finished)}
                    disabled={formLocked}
                    className="h-4 w-4 rounded border-white/20 bg-black/40"
                  />
                  Monthly Book Finished
                </label>
              </div>
            </div>
          </Card>

          <HabitTrackerSection habits={typedHabits} disabled={formLocked} />

          <GoalSection title="Spiritual Goals" prefix="spiritual" entry={entry} disabled={formLocked} />
          <GoalSection title="Personal Goals" prefix="personal" entry={entry} disabled={formLocked} />
          <GoalSection title="Professional Goals" prefix="professional" entry={entry} disabled={formLocked} />
          <GoalSection title="Physical Goals" prefix="physical" entry={entry} disabled={formLocked} />
          <GoalSection title="Emotional Goals" prefix="emotional" entry={entry} disabled={formLocked} />

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
                  disabled={formLocked}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
                />
              </div>

              <div className="pt-4">
                {!formLocked && <AccountabilitySubmitButton />}
              </div>
            </div>
          </Card>
        </form>
      </div>
    </Section>
  );
}

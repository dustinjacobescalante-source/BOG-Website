import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth';
import PrintTrackerActions from '@/components/accountability/PrintTrackerActions';

type GoalPrefix =
  | 'spiritual'
  | 'personal'
  | 'professional'
  | 'physical'
  | 'emotional';

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

function getGoalProgress(entry: Record<string, any> | null, prefix: GoalPrefix) {
  const focus = String(entry?.[`${prefix}_focus`] ?? '').trim();
  const week1 = String(entry?.[`${prefix}_week1_notes`] ?? '').trim();
  const week2 = String(entry?.[`${prefix}_week2_notes`] ?? '').trim();
  const week3 = String(entry?.[`${prefix}_week3_notes`] ?? '').trim();
  const week4 = String(entry?.[`${prefix}_week4_notes`] ?? '').trim();
  const goalMet = Boolean(entry?.[`${prefix}_goal_met`]);

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

  return {
    focus,
    week1,
    week2,
    week3,
    week4,
    percent,
    goalMet,
    status,
  };
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

  const percent =
    totalGoal > 0 ? Math.min(100, Math.round((totalCompleted / totalGoal) * 100)) : 0;

  return {
    activeHabits: activeHabits.length,
    totalCompleted,
    totalGoal,
    percent,
  };
}

function GoalPrintSection({
  title,
  progress,
}: {
  title: string;
  progress: ReturnType<typeof getGoalProgress>;
}) {
  return (
    <section className="break-inside-avoid rounded-2xl border border-zinc-300 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">
            Monthly Goal Category
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-black">{progress.status}</div>
          <div className="text-xs text-zinc-500">{progress.percent}% complete</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Goal / Focus
        </div>
        <div className="mt-2 min-h-[64px] whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-black">
          {progress.focus || '—'}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {[
          { label: 'Week 1', value: progress.week1 },
          { label: 'Week 2', value: progress.week2 },
          { label: 'Week 3', value: progress.week3 },
          { label: 'Week 4', value: progress.week4 },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              {item.label}
            </div>
            <div className="mt-2 min-h-[74px] whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-black">
              {item.value || '—'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
        <span className="font-medium text-black">Goal met this month</span>
        <span className="font-semibold text-black">{progress.goalMet ? 'Yes' : 'No'}</span>
      </div>
    </section>
  );
}

export default async function AccountabilityPrintPage({
  searchParams,
}: {
  searchParams?: Promise<{ month?: string; year?: string }>;
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

  if (!entry && (!habits || habits.length === 0)) {
    redirect('/portal/accountability');
  }

  const typedHabits = (habits as HabitEntry[] | null) ?? [];

  const spiritual = getGoalProgress(entry, 'spiritual');
  const personal = getGoalProgress(entry, 'personal');
  const professional = getGoalProgress(entry, 'professional');
  const physical = getGoalProgress(entry, 'physical');
  const emotional = getGoalProgress(entry, 'emotional');

  const accountabilityOverall = Math.round(
    (
      spiritual.percent +
      personal.percent +
      professional.percent +
      physical.percent +
      emotional.percent
    ) / 5
  );

  const habitMetrics = getHabitMetrics(typedHabits);
  const overall = Math.round((accountabilityOverall + habitMetrics.percent) / 2);

  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Member';

  const habitRows = Array.from({ length: HABIT_ROW_COUNT }, (_, index) => {
    return typedHabits.find((habit) => habit.display_order === index) ?? null;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 0.5in;
          }

          .no-print {
            display: none !important;
          }

          .print-break {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="no-print mx-auto max-w-5xl px-6 pb-0 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-black">Accountability Print View</div>
            <div className="text-sm text-zinc-600">
              Use your browser print button to print or save as PDF.
            </div>
          </div>

          <PrintTrackerActions
            backHref={`/portal/accountability?month=${entry_month}&year=${entry_year}`}
          />
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <header className="border-b border-zinc-300 pb-6">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Brotherhood of Growth
          </div>
          <h1 className="mt-3 text-3xl font-bold text-black">Accountability Tracker</h1>
          <p className="mt-2 text-sm text-zinc-700">
            Printed review sheet for meetings and personal follow-up.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-300 p-3">
              <div className="text-xs uppercase tracking-[0.12em] text-zinc-500">Member</div>
              <div className="mt-1 text-sm font-semibold text-black">{displayName}</div>
            </div>

            <div className="rounded-xl border border-zinc-300 p-3">
              <div className="text-xs uppercase tracking-[0.12em] text-zinc-500">Month</div>
              <div className="mt-1 text-sm font-semibold text-black">{monthLabel}</div>
            </div>

            <div className="rounded-xl border border-zinc-300 p-3">
              <div className="text-xs uppercase tracking-[0.12em] text-zinc-500">Accountability</div>
              <div className="mt-1 text-sm font-semibold text-black">{accountabilityOverall}%</div>
            </div>

            <div className="rounded-xl border border-zinc-300 p-3">
              <div className="text-xs uppercase tracking-[0.12em] text-zinc-500">Overall</div>
              <div className="mt-1 text-sm font-semibold text-black">{overall}%</div>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-300 p-5">
            <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              Notes / Obstacles / Wins
            </div>
            <div className="mt-3 min-h-[100px] whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-black">
              {entry?.notes_obstacles_wins || '—'}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-300 p-5">
            <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              Monthly Checklist
            </div>

            <div className="mt-3 space-y-3 text-sm text-black">
              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <span>Attended Monthly Club Meeting</span>
                <span className="font-semibold">
                  {entry?.attended_monthly_club_meeting ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <span>Memorized Scripture</span>
                <span className="font-semibold">
                  {entry?.memorized_scripture ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <span>Monthly Book Finished</span>
                <span className="font-semibold">
                  {entry?.monthly_book_finished ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Goal Categories
          </div>

          <div className="grid gap-5">
            <GoalPrintSection title="Spiritual Goals" progress={spiritual} />
            <GoalPrintSection title="Personal Goals" progress={personal} />
            <GoalPrintSection title="Professional Goals" progress={professional} />
            <GoalPrintSection title="Physical Goals" progress={physical} />
            <GoalPrintSection title="Emotional Goals" progress={emotional} />
          </div>
        </section>

        <section className="print-break mt-10">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Habit Tracker
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-300">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-100">
                  <th className="border border-zinc-300 px-3 py-2 text-left">Habit</th>
                  <th className="border border-zinc-300 px-3 py-2 text-center">Goal</th>
                  <th className="border border-zinc-300 px-3 py-2 text-center">Completed</th>
                  <th className="border border-zinc-300 px-3 py-2 text-center">Checked Days</th>
                </tr>
              </thead>
              <tbody>
                {habitRows.map((habit, index) => {
                  const checkedDays = Array.isArray(habit?.checked_days)
                    ? habit.checked_days.join(', ')
                    : '';
                  const completedDays = Array.isArray(habit?.checked_days)
                    ? habit.checked_days.length
                    : 0;

                  return (
                    <tr key={index}>
                      <td className="border border-zinc-300 px-3 py-2 align-top text-black">
                        {habit?.action?.trim() || `Habit ${index + 1}`}
                      </td>
                      <td className="border border-zinc-300 px-3 py-2 text-center align-top text-black">
                        {habit?.goal_days ?? 0}
                      </td>
                      <td className="border border-zinc-300 px-3 py-2 text-center align-top text-black">
                        {completedDays}
                      </td>
                      <td className="border border-zinc-300 px-3 py-2 align-top text-black">
                        {checkedDays || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-2xl border border-zinc-300 p-5">
            <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
              How did you help another member?
            </div>
            <div className="mt-3 min-h-[100px] whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-black">
              {entry?.helped_group_member || '—'}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

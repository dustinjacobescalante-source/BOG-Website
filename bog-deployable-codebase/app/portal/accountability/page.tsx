// ONLY showing NEW/UPDATED parts to keep this clean for you

// 👉 ADD THIS HELPER FUNCTION
function isMonthComplete(progressList: ReturnType<typeof getGoalProgress>[]) {
  return progressList.every((item) => item.goalMet);
}

// 👉 ADD THIS COMPONENT (put above export default Page)
function CompletionBanner({
  isComplete,
  completedCount,
}: {
  isComplete: boolean;
  completedCount: number;
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
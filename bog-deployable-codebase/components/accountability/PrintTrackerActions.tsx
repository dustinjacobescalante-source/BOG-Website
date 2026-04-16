'use client';

export default function PrintTrackerActions({
  backHref,
}: {
  backHref: string;
}) {
  return (
    <div className="flex gap-3">
      <a
        href={backHref}
        className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-black hover:bg-zinc-100"
      >
        Back to Tracker
      </a>

      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Print Tracker
      </button>
    </div>
  );
}

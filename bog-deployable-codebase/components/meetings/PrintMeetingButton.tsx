'use client';

export default function PrintMeetingButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:border-zinc-400 hover:bg-zinc-100 hover:text-black print:hidden"
    >
      Print
    </button>
  );
}

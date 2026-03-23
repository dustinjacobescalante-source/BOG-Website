'use client';

export default function PrintMeetingButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 print:hidden"
    >
      Print
    </button>
  );
}

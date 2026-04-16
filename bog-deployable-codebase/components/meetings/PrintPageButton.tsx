'use client';

export default function PrintPageButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-100"
    >
      Print
    </button>
  );
}

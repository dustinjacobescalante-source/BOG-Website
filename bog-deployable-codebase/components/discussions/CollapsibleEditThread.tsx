'use client';

import { useState } from 'react';
import EditThreadForm from '@/components/discussions/EditThreadForm';

export default function CollapsibleEditThread({
  threadId,
  initialTitle,
}: {
  threadId: string;
  initialTitle: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
          open
            ? 'border border-white/10 bg-black/40 text-white hover:bg-black/50'
            : 'border border-white/10 bg-black/25 text-zinc-300 hover:border-red-500/30 hover:bg-black/35 hover:text-white'
        }`}
      >
        {open ? 'Close Thread Editor' : 'Edit Thread'}
      </button>

      {open ? (
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_12px_30px_rgba(0,0,0,0.25)]">
          <EditThreadForm threadId={threadId} initialTitle={initialTitle} />
        </div>
      ) : null}
    </div>
  );
}
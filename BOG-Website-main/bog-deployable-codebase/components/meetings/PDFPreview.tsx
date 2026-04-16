'use client';

import { useState } from 'react';

export default function PDFPreview({
  url,
}: {
  url: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white hover:bg-white/5"
      >
        {open ? 'Hide' : 'Preview'}
      </button>

      {open && (
        <div className="border-t border-white/10 bg-black">
          <iframe
            src={url}
            className="w-full"
            style={{ height: '500px' }}
          />
        </div>
      )}
    </>
  );
}

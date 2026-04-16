'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function EditThreadForm({
  threadId,
  initialTitle,
}: {
  threadId: string;
  initialTitle: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setMessage('Title cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      const { error } = await supabase
        .from('discussion_threads')
        .update({
          title: title.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', threadId);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage('Thread updated.');

      setTimeout(() => {
        router.refresh();
      }, 300);
    } catch {
      setMessage('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <div className="text-sm font-semibold text-white">Edit Thread Title</div>
        <div className="text-xs text-zinc-500">
          Update the title without changing the discussion history.
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-[20px] border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/40 focus:bg-black/45"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Title'}
        </button>

        {message ? (
          <div className="text-sm text-zinc-400">{message}</div>
        ) : null}
      </div>
    </form>
  );
}
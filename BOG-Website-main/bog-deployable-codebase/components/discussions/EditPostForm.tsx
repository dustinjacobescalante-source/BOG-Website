'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function EditPostForm({
  postId,
  initialBody,
}: {
  postId: string;
  initialBody: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!body.trim()) {
      setMessage('Reply cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      const { error } = await supabase
        .from('discussion_posts')
        .update({
          body: body.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage('Reply updated.');

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
        <div className="text-sm font-semibold text-white">Edit Reply</div>
        <div className="text-xs text-zinc-500">
          Update your reply while keeping the thread intact.
        </div>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        className="w-full rounded-[20px] border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-red-500/40 focus:bg-black/45"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Reply'}
        </button>

        {message ? (
          <div className="text-sm text-zinc-400">{message}</div>
        ) : null}
      </div>
    </form>
  );
}
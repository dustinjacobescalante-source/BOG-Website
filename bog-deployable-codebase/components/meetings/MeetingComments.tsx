'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MeetingComments({
  meetingId,
}: {
  meetingId: string;
}) {
  const [commentText, setCommentText] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!commentText.trim()) return;

    setSaving(true);
    setMessage('');

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage('You must be signed in to comment.');
        setSaving(false);
        return;
      }

      const { error } = await supabase.from('meeting_comments').insert({
        meeting_id: meetingId,
        user_id: user.id,
        comment_text: commentText.trim(),
      });

      if (error) {
        setMessage(`Comment failed: ${error.message}`);
        setSaving(false);
        return;
      }

      setCommentText('');
      setMessage('Comment added.');
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 text-sm font-medium text-white">Comments</div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={4}
          placeholder="Leave a comment for this meeting..."
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm text-zinc-300">{message}</p>
      )}
    </div>
  );
}

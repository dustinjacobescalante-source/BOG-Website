'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CommentItem = {
  id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
  } | null;
};

export default function MeetingComments({
  meetingId,
}: {
  meetingId: string;
}) {
  const [commentText, setCommentText] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(true);

  async function loadCurrentUser() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id ?? null);

    if (user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setCurrentUserRole(profile?.role ?? null);
    }
  }

  async function loadComments() {
    setLoadingComments(true);

    const supabase = createClient();

    const { data, error } = await supabase
      .from('meeting_comments')
      .select(
        `
          id,
          comment_text,
          created_at,
          user_id,
          profiles (
            full_name
          )
        `
      )
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('loadComments error:', error);
      setLoadingComments(false);
      return;
    }

    setComments((data as CommentItem[]) ?? []);
    setLoadingComments(false);
  }

  useEffect(() => {
    loadCurrentUser();
    loadComments();
  }, [meetingId]);

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
      await loadComments();
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(commentId: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('meeting_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      setMessage(`Delete failed: ${error.message}`);
      return;
    }

    setMessage('Comment deleted.');
    await loadComments();
  }

  return (
    <div className="space-y-6">
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

        {message && <p className="mt-3 text-sm text-zinc-300">{message}</p>}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 text-sm font-medium text-white">Recent Comments</div>

        <div className="space-y-3">
          {loadingComments ? (
            <p className="text-sm text-zinc-500">Loading comments...</p>
          ) : comments.length ? (
            comments.map((comment) => {
              const canDelete =
                currentUserRole === 'admin' || currentUserId === comment.user_id;

              return (
                <div
                  key={comment.id}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-xs text-zinc-500">
                      {comment.profiles?.full_name || 'Unknown'} •{' '}
                      {new Date(comment.created_at).toLocaleString()}
                    </div>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">
                    {comment.comment_text}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-zinc-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

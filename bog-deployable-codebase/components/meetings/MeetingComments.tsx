'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CommentItem = {
  id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  is_pinned?: boolean | null;
  meeting_id?: string;
};

export default function MeetingComments({
  meetingId,
}: {
  meetingId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [commentText, setCommentText] = useState('');
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [debug, setDebug] = useState<string>('');

  async function loadComments() {
    setLoading(true);
    setMessage('');
    setDebug(`Loading comments for meetingId: ${meetingId}`);

    const { data, error } = await supabase
      .from('meeting_comments')
      .select('id, meeting_id, comment_text, created_at, user_id, is_pinned')
      .eq('meeting_id', meetingId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('COMMENTS LOAD ERROR:', error);
      setMessage(`Could not load comments: ${error.message}`);
      setComments([]);
      setLoading(false);
      return;
    }

    setComments(data ?? []);
    setDebug(
      `Loaded ${data?.length ?? 0} comment(s) for meetingId: ${meetingId}`
    );
    setLoading(false);
  }

  useEffect(() => {
    if (meetingId) {
      void loadComments();
    }
  }, [meetingId]);

  async function handlePostComment() {
    if (!commentText.trim()) {
      setMessage('Please enter a comment.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      setDebug(`Posting comment to meetingId: ${meetingId}`);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setMessage(`Auth error: ${userError.message}`);
        return;
      }

      if (!user) {
        setMessage('You must be signed in to comment.');
        return;
      }

      const { data: inserted, error } = await supabase
        .from('meeting_comments')
        .insert({
          meeting_id: meetingId,
          user_id: user.id,
          comment_text: commentText.trim(),
        })
        .select();

      if (error) {
        console.error('POST COMMENT ERROR:', error);
        setMessage(`Could not post comment: ${error.message}`);
        return;
      }

      setCommentText('');
      setMessage('Comment posted.');
      setDebug(
        `Posted comment successfully to meetingId: ${meetingId}. Inserted rows: ${inserted?.length ?? 0}`
      );
      await loadComments();
    } catch (error) {
      console.error('POST COMMENT UNEXPECTED ERROR:', error);
      setMessage('Something went wrong while posting your comment.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="mb-2 text-sm font-semibold text-white">Comments</div>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Leave a comment for this meeting..."
          className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-zinc-500"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handlePostComment}
            disabled={saving}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50"
          >
            {saving ? 'Posting...' : 'Post Comment'}
          </button>

          <button
            type="button"
            onClick={loadComments}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
          >
            Refresh Comments
          </button>
        </div>

        {message && <p className="mt-3 text-sm text-zinc-300">{message}</p>}
        {debug && <p className="mt-2 text-xs text-zinc-500">{debug}</p>}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 text-sm font-semibold text-white">
          Recent Comments
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="text-sm text-white">{comment.comment_text}</div>
                <div className="mt-2 text-xs text-zinc-500">
                  {new Date(comment.created_at).toLocaleString()}
                  {comment.is_pinned ? ' • pinned' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

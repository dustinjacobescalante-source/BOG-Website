'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CommentItem = {
  id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  is_pinned?: boolean | null;
};

const supabase = createClient();

export default function MeetingComments({
  meetingId,
}: {
  meetingId: string;
}) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [debugUser, setDebugUser] = useState('');
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const loadComments = useCallback(async () => {
    if (!meetingId) return;
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('meeting_comments')
        .select('id, comment_text, created_at, user_id, is_pinned')
        .eq('meeting_id', meetingId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('COMMENTS LOAD ERROR:', error);
        setMessage(`Load failed: ${error.message}`);
        setComments([]);
        return;
      }

      setComments(data ?? []);
    } catch (error) {
      console.error('COMMENTS LOAD UNEXPECTED ERROR:', error);
      setMessage('Load failed.');
      setComments([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [meetingId]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void loadComments();
  }, [loadComments]);

  async function handlePostComment() {
    if (!commentText.trim()) {
      setMessage('Please enter a comment.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('AUTH ERROR:', userError);
        setMessage(`Auth error: ${userError.message}`);
        return;
      }

      if (!user) {
        setMessage('You must be signed in to comment.');
        return;
      }

      setDebugUser(user.id);

      const { error } = await supabase.from('meeting_comments').insert({
        meeting_id: meetingId,
        user_id: user.id,
        comment_text: commentText.trim(),
      });

      if (error) {
        console.error('POST COMMENT ERROR:', error);
        setMessage(`Post failed: ${error.message}`);
        return;
      }

      setCommentText('');
      setMessage('Comment added.');
      await loadComments();
    } catch (error) {
      console.error('POST COMMENT UNEXPECTED ERROR:', error);
      setMessage('Something went wrong.');
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
          rows={4}
          placeholder="Leave a comment for this meeting..."
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handlePostComment}
            disabled={saving}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? 'Posting...' : 'Post Comment'}
          </button>

          <button
            type="button"
            onClick={() => void loadComments()}
            disabled={loading}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-60"
          >
            Refresh Comments
          </button>
        </div>

        <div className="mt-3 space-y-1 text-xs text-zinc-400">
          <p>Meeting ID: {meetingId}</p>
          <p>User ID: {debugUser || 'not loaded yet'}</p>
          {message && <p>{message}</p>}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 text-sm font-semibold text-white">Recent Comments</div>

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

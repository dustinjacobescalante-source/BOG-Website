'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CommentItem = {
  id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  is_pinned?: boolean | null;
  profiles?: {
    full_name: string | null;
  } | null;
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
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const showMessage = useCallback(
    (text: string, type: 'success' | 'error') => {
      setMessage(text);
      setMessageType(type);

      if (type === 'success') {
        window.setTimeout(() => {
          setMessage((current) => (current === text ? '' : current));
          setMessageType((current) => (current === 'success' ? '' : current));
        }, 3000);
      }
    },
    []
  );

  const loadComments = useCallback(async () => {
    if (!meetingId || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('meeting_comments')
        .select(`
          id,
          comment_text,
          created_at,
          user_id,
          is_pinned,
          profiles ( full_name )
        `)
        .eq('meeting_id', meetingId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('COMMENTS LOAD ERROR:', error);
        setComments([]);
        showMessage(`Could not load comments: ${error.message}`, 'error');
        return;
      }

      setComments((data as CommentItem[]) ?? []);
    } catch (error) {
      console.error('COMMENTS LOAD UNEXPECTED ERROR:', error);
      setComments([]);
      showMessage('Could not load comments.', 'error');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [meetingId, showMessage]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void loadComments();
  }, [loadComments]);

  async function handlePostComment() {
    if (!commentText.trim()) {
      showMessage('Please enter a comment.', 'error');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      setMessageType('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('AUTH ERROR:', userError);
        showMessage(`Authentication error: ${userError.message}`, 'error');
        return;
      }

      if (!user) {
        showMessage('You must be signed in to post a comment.', 'error');
        return;
      }

      const { error } = await supabase.from('meeting_comments').insert({
        meeting_id: meetingId,
        user_id: user.id,
        comment_text: commentText.trim(),
      });

      if (error) {
        console.error('POST COMMENT ERROR:', error);
        showMessage(`Could not post comment: ${error.message}`, 'error');
        return;
      }

      setCommentText('');
      showMessage('Comment added.', 'success');
      await loadComments();
    } catch (error) {
      console.error('POST COMMENT UNEXPECTED ERROR:', error);
      showMessage('Something went wrong while posting your comment.', 'error');
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
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handlePostComment}
            disabled={saving || loading}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? 'Posting...' : 'Post Comment'}
          </button>

          <button
            type="button"
            onClick={() => void loadComments()}
            disabled={loading || saving}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-60"
          >
            {loading ? 'Refreshing...' : 'Refresh Comments'}
          </button>
        </div>

        {message && (
          <div
            className={`mt-3 text-sm ${
              messageType === 'error' ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {message}
          </div>
        )}
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
                <div className="flex items-center gap-2">
                  {comment.is_pinned ? (
                    <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-300">
                      Pinned
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 text-sm text-white">{comment.comment_text}</div>

                <div className="mt-2 text-xs text-zinc-400">
                  {comment.profiles?.full_name || 'Member'} •{' '}
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

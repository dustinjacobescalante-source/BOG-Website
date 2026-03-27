'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CommentItem = {
  id: string;
  comment_text: string;
  created_at: string;
  user_id: string;
  is_pinned?: boolean | null;
};

export default function MeetingComments({
  meetingId,
}: {
  meetingId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [commentText, setCommentText] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  async function loadCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('getUser error:', error);
        setMessage(`Auth error: ${error.message}`);
        setUserId(null);
        return;
      }

      if (!user) {
        console.warn('No signed-in user found');
        setMessage('No signed-in user found.');
        setUserId(null);
        return;
      }

      setUserId(user.id);
    } catch (err) {
      console.error('Unexpected loadCurrentUser error:', err);
      setMessage('Failed to load current user.');
      setUserId(null);
    }
  }

  async function loadComments() {
    try {
      setStatus('loading');

      const { data, error } = await supabase
        .from('meeting_comments')
        .select('id, comment_text, created_at, user_id, is_pinned')
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('loadComments error:', error);
        setMessage(`Load comments error: ${error.message}`);
        setComments([]);
        setStatus('error');
        return;
      }

      setComments(data || []);
      setStatus('loaded');
    } catch (err) {
      console.error('Unexpected loadComments error:', err);
      setMessage('Unexpected error loading comments.');
      setComments([]);
      setStatus('error');
    }
  }

  async function handlePostComment() {
    if (!commentText.trim()) {
      setMessage('Please enter a comment first.');
      return;
    }

    if (!userId) {
      setMessage('User not loaded yet. Please refresh and try again.');
      return;
    }

    try {
      setStatus('posting');
      setMessage('');

      const { error } = await supabase.from('meeting_comments').insert({
        meeting_id: meetingId,
        user_id: userId,
        comment_text: commentText.trim(),
      });

      if (error) {
        console.error('insert comment error:', error);
        setMessage(`Post error: ${error.message}`);
        setStatus('error');
        return;
      }

      setCommentText('');
      setMessage('Comment posted successfully.');
      await loadComments();
      setStatus('loaded');
    } catch (err) {
      console.error('Unexpected handlePostComment error:', err);
      setMessage('Unexpected error posting comment.');
      setStatus('error');
    }
  }

  useEffect(() => {
    async function init() {
      await loadCurrentUser();
      await loadComments();
    }

    init();
  }, [meetingId]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Comments</h3>

      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Leave a comment for this meeting..."
        className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white outline-none"
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={handlePostComment}
          className="rounded-full bg-red-600 px-5 py-2 font-semibold text-white"
        >
          Post Comment
        </button>

        <button
          onClick={loadComments}
          className="rounded-full border border-white/20 px-5 py-2 font-semibold text-white"
        >
          Refresh Comments
        </button>
      </div>

      <div className="mt-3 text-sm text-white/80">
        <div>Status: {status}</div>
        <div>Meeting ID: {meetingId}</div>
        <div>User ID: {userId ?? 'not loaded yet'}</div>
      </div>

      {message ? (
        <div className="mt-3 text-sm text-red-300">{message}</div>
      ) : null}

      <div className="mt-6">
        <h4 className="mb-3 text-md font-semibold text-white">Recent Comments</h4>

        {comments.length === 0 ? (
          <p className="text-white/70">No comments yet.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="text-white">{comment.comment_text}</div>
                <div className="mt-2 text-xs text-white/50">
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

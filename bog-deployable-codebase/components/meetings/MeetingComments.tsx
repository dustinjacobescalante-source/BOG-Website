'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CommentItem = {
  id: string;
  comment_text: string;
  created_at: string;
};

export default function MeetingComments({
  meetingId,
}: {
  meetingId: string;
}) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState('');
  const [debugUser, setDebugUser] = useState('');

  async function loadComments() {
    setLoading(true);
    setStatus(`Loading comments for meeting: ${meetingId}`);

    const supabase = createClient();

    const { data, error } = await supabase
      .from('meeting_comments')
      .select('id, comment_text, created_at')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('LOAD COMMENTS ERROR:', error);
      setStatus(`Load failed: ${error.message}`);
      setComments([]);
      setLoading(false);
      return;
    }

    setComments(data ?? []);
    setStatus(`Loaded ${data?.length ?? 0} comment(s)`);
    setLoading(false);
  }

  useEffect(() => {
    void loadComments();
  }, [meetingId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!commentText.trim()) {
      setStatus('Please enter a comment.');
      return;
    }

    setPosting(true);
    setStatus('Checking signed-in user...');

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('AUTH ERROR:', userError);
        setStatus(`Auth error: ${userError.message}`);
        setPosting(false);
        return;
      }

      if (!user) {
        setStatus('You must be signed in to comment.');
        setPosting(false);
        return;
      }

      setDebugUser(user.id);
      setStatus(`Posting comment as user: ${user.id}`);

      const { error } = await supabase.from('meeting_comments').insert({
        meeting_id: meetingId,
        user_id: user.id,
        comment_text: commentText.trim(),
      });

      if (error) {
        console.error('INSERT ERROR:', error);
        setStatus(`Insert failed: ${error.message}`);
        setPosting(false);
        return;
      }

      setCommentText('');
      setStatus('Comment added.');
      await loadComments();
    } catch (error) {
      console.error('UNEXPECTED COMMENT ERROR:', error);
      setStatus('Something went wrong.');
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="mb-2 text-sm font-semibold text-white">Comments</div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            placeholder="Leave a comment for this meeting..."
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={posting}
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {posting ? 'Posting...' : 'Post Comment'}
            </button>

            <button
              type="button"
              onClick={() => void loadComments()}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
            >
              Refresh Comments
            </button>
          </div>
        </form>

        <div className="mt-3 space-y-1 text-xs text-zinc-400">
          <p>Status: {status || 'idle'}</p>
          <p>Meeting ID: {meetingId}</p>
          <p>User ID: {debugUser || 'not loaded yet'}</p>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

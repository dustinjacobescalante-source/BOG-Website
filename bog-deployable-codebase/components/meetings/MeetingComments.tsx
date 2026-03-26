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
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      setMessage('');

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(user?.id ?? null);

      const { data, error } = await supabase
        .from('meeting_comments')
        .select('id, comment_text, created_at, user_id, is_pinned')
        .eq('meeting_id', meetingId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('loadComments error:', error);
        setMessage(`Could not load comments: ${error.message}`);
        setComments([]);
        return;
      }

      setComments(data ?? []);
    } catch (error) {
      console.error('loadComments unexpected error:', error);
      setMessage('Could not load comments.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadComments();
  }, [meetingId]);

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

      if (userError || !user) {
        setMessage('You must be signed in to comment.');
        return;
      }

      const { error } = await supabase.from('meeting_comments').insert({
        meeting_id: meetingId,
        user_id: user.id,
        comment_text: commentText.trim(),
      });

      if (error) {
        console.error('post comment error:', error);
        setMessage(`Could not post comment: ${error.message}`);
        return;
      }

      setCommentText('');
      setMessage('Comment posted.');
      await loadComments();
    } catch (error) {
      console.error('post comment unexpected error:', error);
      setMessage('Something went wrong while posting your comment.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      setMessage('');

      const { error } = await supabase
        .from('meeting_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('delete comment error:', error);
        setMessage(`Could not delete comment: ${error.message}`);
        return;
      }

      await loadComments();
    } catch (error) {
      console.error('delete comment unexpected error:', error);
      setMessage('Something went wrong while deleting the comment.');
    }
  }

  async function handleEdit(commentId: string, currentText: string) {
    const nextText = window.prompt('Edit comment:', currentText);
    if (nextText === null) return;
    if (!nextText.trim()) {
      setMessage('Comment cannot be empty.');
      return;
    }

    try {
      setMessage('');

      const { error } = await supabase
        .from('meeting_comments')
        .update({ comment_text: nextText.trim() })
        .eq('id', commentId);

      if (error) {
        console.error('edit comment error:', error);
        setMessage(`Could not update comment: ${error.message}`);
        return;
      }

      await loadComments();
    } catch (error) {
      console.error('edit comment unexpected error:', error);
      setMessage('Something went wrong while editing the comment.');
    }
  }

  async function handleTogglePin(commentId: string, currentPinned: boolean | null | undefined) {
    try {
      setMessage('');

      const { error } = await supabase
        .from('meeting_comments')
        .update({ is_pinned: !currentPinned })
        .eq('id', commentId);

      if (error) {
        console.error('pin comment error:', error);
        setMessage(`Could not update pin: ${error.message}`);
        return;
      }

      await loadComments();
    } catch (error) {
      console.error('pin comment unexpected error:', error);
      setMessage('Something went wrong while updating the pin.');
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

        <div className="mt-3">
          <button
            type="button"
            onClick={handlePostComment}
            disabled={saving}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50"
          >
            {saving ? 'Posting...' : 'Post Comment'}
          </button>
        </div>

        {message && <p className="mt-3 text-sm text-zinc-300">{message}</p>}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 text-sm font-semibold text-white">Recent Comments</div>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => {
              const isOwner = currentUserId === comment.user_id;

              return (
                <div
                  key={comment.id}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-white">
                        {comment.comment_text}
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">
                        {new Date(comment.created_at).toLocaleString()}
                        {comment.is_pinned ? ' • pinned' : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePin(comment.id, comment.is_pinned)
                        }
                        className="text-xs text-yellow-400 hover:text-yellow-300"
                      >
                        {comment.is_pinned ? 'Unpin' : 'Pin'}
                      </button>

                      {isOwner && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(comment.id, comment.comment_text)
                            }
                            className="text-xs text-zinc-300 hover:text-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

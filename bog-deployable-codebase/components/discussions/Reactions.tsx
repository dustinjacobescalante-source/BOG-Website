'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const REACTIONS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💪', label: 'Strong' },
];

type ReactionRow = {
  reaction: string;
  user_id: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
};

export default function Reactions({ postId }: { postId: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [reactionNames, setReactionNames] = useState<Record<string, string[]>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadReactions() {
    setErrorMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('loadReactions auth error:', userError);
      }

      const { data, error } = await supabase
        .from('discussion_reactions')
        .select('reaction, user_id')
        .eq('post_id', postId);

      if (error) {
        console.error('loadReactions query error:', error);
        setErrorMessage('Could not load reactions.');
        return;
      }

      const rows = (data ?? []) as ReactionRow[];

      const countsMap: Record<string, number> = {};
      const currentUserReactionList: string[] = [];
      const userIds = Array.from(new Set(rows.map((row) => row.user_id)));

      rows.forEach((row) => {
        countsMap[row.reaction] = (countsMap[row.reaction] || 0) + 1;

        if (user?.id && row.user_id === user.id) {
          currentUserReactionList.push(row.reaction);
        }
      });

      let profileMap: Record<string, string> = {};

      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('loadReactions profiles error:', profilesError);
        } else {
          (profilesData as ProfileRow[] | null)?.forEach((profile) => {
            profileMap[profile.id] = profile.full_name || 'Member';
          });
        }
      }

      const namesMap: Record<string, string[]> = {};

      rows.forEach((row) => {
        if (!namesMap[row.reaction]) {
          namesMap[row.reaction] = [];
        }

        namesMap[row.reaction].push(profileMap[row.user_id] || 'Member');
      });

      setCounts(countsMap);
      setUserReactions(currentUserReactionList);
      setReactionNames(namesMap);
    } catch (error) {
      console.error('loadReactions unexpected error:', error);
      setErrorMessage('Something went wrong loading reactions.');
    }
  }

  async function toggleReaction(reaction: string) {
    if (loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('toggleReaction auth error:', userError);
        setErrorMessage('Could not verify your account.');
        return;
      }

      if (!user) {
        setErrorMessage('You must be signed in to react.');
        return;
      }

      const alreadyReacted = userReactions.includes(reaction);

      if (alreadyReacted) {
        const { error } = await supabase
          .from('discussion_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('reaction', reaction);

        if (error) {
          console.error('delete reaction error:', error);
          setErrorMessage(error.message || 'Could not remove reaction.');
          return;
        }
      } else {
        const { error } = await supabase.from('discussion_reactions').insert({
          post_id: postId,
          user_id: user.id,
          reaction,
        });

        if (error) {
          console.error('insert reaction error:', error);
          setErrorMessage(error.message || 'Could not add reaction.');
          return;
        }
      }

      await loadReactions();
    } catch (error) {
      console.error('toggleReaction unexpected error:', error);
      setErrorMessage('Something went wrong updating reactions.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReactions();
  }, [postId]);

  return (
    <div className="pt-4">
      <div className="flex flex-wrap items-center gap-2">
        {REACTIONS.map(({ emoji, label }) => {
          const isActive = userReactions.includes(emoji);
          const count = counts[emoji] || 0;
          const names = reactionNames[emoji] || [];
          const tooltip =
            names.length > 0
              ? `${label}: ${names.join(', ')}`
              : `${label}: no reactions yet`;

          return (
            <button
              key={emoji}
              type="button"
              onClick={() => toggleReaction(emoji)}
              disabled={loading}
              title={tooltip}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition hover:scale-105 active:scale-95 ${
                isActive
                  ? 'border-red-500/50 bg-red-500/20 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                  : 'border-white/10 bg-black/30 text-zinc-300 hover:border-white/20 hover:bg-white/5 hover:text-white'
              } ${loading ? 'opacity-70' : ''}`}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span className="text-xs font-bold text-zinc-400">{count}</span>
            </button>
          );
        })}
      </div>

      {errorMessage ? (
        <div className="mt-2 text-xs text-red-400">{errorMessage}</div>
      ) : null}
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/cards';
import CreateThreadForm from '@/components/discussions/CreateThreadForm';

type Thread = {
  id: string;
  title: string;
  category: string | null;
  created_at: string;
  is_pinned?: boolean | null;
  author_name?: string | null;
  reply_count: number;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitials(name?: string | null) {
  return (
    name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'BD'
  );
}

export default function DiscussionsBoard({
  threads,
}: {
  threads: Thread[];
}) {
  const [search, setSearch] = useState('');

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      return (
        thread.title.toLowerCase().includes(search.toLowerCase()) ||
        (thread.author_name || '').toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [threads, search]);

  return (
    <div className="space-y-6">
      <CreateThreadForm />

      {/* Search */}
      <Card>
        <input
          type="text"
          placeholder="Search discussions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500/40"
        />
      </Card>

      {/* Threads */}
      <div className="space-y-4">
        {filteredThreads.length ? (
          filteredThreads.map((thread) => {
            const author = thread.author_name || 'Brother';
            const isHot = thread.reply_count >= 5;
            const isActive =
              new Date(thread.created_at).getTime() >
              Date.now() - 1000 * 60 * 60 * 24; // last 24h

            return (
              <Link
                key={thread.id}
                href={`/portal/discussions/${thread.id}`}
                className={`group block rounded-[28px] border p-5 transition duration-300 hover:-translate-y-1 ${
                  thread.is_pinned
                    ? 'border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 to-black/40 shadow-[0_0_0_1px_rgba(234,179,8,0.05),0_16px_40px_rgba(234,179,8,0.08)] hover:border-yellow-400/40'
                    : isHot
                    ? 'border-red-500/25 bg-gradient-to-br from-red-500/10 to-black/40 shadow-[0_0_0_1px_rgba(239,68,68,0.05),0_16px_40px_rgba(239,68,68,0.08)] hover:border-red-400/40'
                    : 'border-white/10 bg-black/25 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_rgba(0,0,0,0.30)] hover:border-red-500/30 hover:bg-black/35'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-800 to-black text-sm font-bold text-white">
                    {getInitials(author)}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Title + badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-bold tracking-tight text-white transition group-hover:text-red-400">
                        {thread.title}
                      </div>

                      {thread.is_pinned && (
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-300">
                          Pinned
                        </span>
                      )}

                      {isHot && (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-300">
                          🔥 Hot
                        </span>
                      )}

                      {isActive && (
                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-300">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                      <span className="text-zinc-300">{author}</span>
                      <span>•</span>
                      <span>{formatDate(thread.created_at)}</span>
                    </div>
                  </div>

                  {/* Reply Count */}
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                      Replies
                    </div>
                    <div
                      className={`mt-1 text-2xl font-bold ${
                        isHot ? 'text-red-400' : 'text-white'
                      }`}
                    >
                      {thread.reply_count}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <Card>
            <div className="text-sm text-zinc-300">
              No discussion threads found.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

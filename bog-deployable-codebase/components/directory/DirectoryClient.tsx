'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Users,
  ShieldCheck,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/cards';

type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  rank: string | null;
  role: string | null;
};

export default function DirectoryClient({ members }: { members: Member[] }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === 'all' ? true : m.role === roleFilter;
      const matchesRank = rankFilter === 'all' ? true : m.rank === rankFilter;

      return matchesSearch && matchesRole && matchesRank;
    });
  }, [members, search, roleFilter, rankFilter]);

  const adminCount = members.filter((member) => member.role === 'admin').length;
  const memberCount = members.filter((member) => member.role !== 'admin').length;

  function getInitials(name?: string | null) {
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'BD'
    );
  }

  function getRoleLabel(role?: string | null) {
    return role === 'admin' ? 'Administrator' : 'Member';
  }

  function getRankLabel(rank?: string | null) {
    if (!rank) return 'Omega';
    return rank.charAt(0).toUpperCase() + rank.slice(1);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,14,24,0.96),rgba(6,8,14,1))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-7 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_24%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_22%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                <Users className="h-3 w-3" />
                Brotherhood Directory
              </div>

              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
                Know the men.
                <br />
                Know the ranks.
                <br />
                <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  Move with the right circle.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Use the directory to find approved members, understand roles,
                and stay connected to the brotherhood structure.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Active Profiles
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {members.length}
                </div>
                <div className="mt-2 text-xs leading-5 text-zinc-500">
                  Approved members inside the portal.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Administrators
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {adminCount}
                </div>
                <div className="mt-2 text-xs leading-5 text-zinc-500">
                  Members with elevated platform control.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Search Results
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {filtered.length}
                </div>
                <div className="mt-2 text-xs leading-5 text-zinc-500">
                  Members matching your current filters.
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-black/25 px-5 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Search Directory
              </div>

              <div className="mt-4 grid gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500/40"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>

                  <select
                    value={rankFilter}
                    onChange={(e) => setRankFilter(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="all">All Ranks</option>
                    <option value="omega">Omega</option>
                    <option value="alpha">Alpha</option>
                    <option value="beta">Beta</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-red-500/20 bg-gradient-to-br from-red-600/14 to-red-950/10 px-5 py-5 shadow-[0_12px_40px_rgba(239,68,68,0.10)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                Brotherhood Standard
              </div>

              <div className="mt-3 text-xl font-bold text-white">
                Stay connected to the right men for the right reasons.
              </div>

              <div className="mt-3 text-sm leading-6 text-zinc-300">
                The directory is for structure, connection, and clarity — not noise.
                Know who is in the room, who leads, and who stands beside you.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => {
          const initials = getInitials(member.full_name);

          return (
            <div
              key={member.id}
              className="group relative rounded-[30px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.045] hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]" />

              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-black text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1 pr-5">
                    <div className="text-xl font-bold leading-tight text-white transition group-hover:text-red-400">
                      {member.full_name || 'Unnamed Member'}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {getRoleLabel(member.role)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300">
                  {member.email || 'No email listed'}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-zinc-300">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Rank {getRankLabel(member.rank)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                      member.role === 'admin'
                        ? 'border border-red-500/30 bg-red-500/10 text-red-300'
                        : 'border border-white/10 bg-black/25 text-zinc-300'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {member.role || 'member'}
                  </span>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Active Member
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!filtered.length && (
        <Card>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
            <div className="text-lg font-semibold text-white">No members found</div>
            <p className="mt-2 text-sm text-zinc-500">
              Try a different search or adjust your role and rank filters.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

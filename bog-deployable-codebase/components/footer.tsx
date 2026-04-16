import { site } from '@/lib/site';
export function Footer() {
  return <footer className="border-t border-white/10 py-10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-zinc-400 sm:px-6 lg:px-8"><div>{site.name}</div><div>{site.clubEmail} • {site.leaderEmail}</div><div>{site.domain}</div></div></footer>;
}

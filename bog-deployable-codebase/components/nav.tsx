import Link from 'next/link';
import { site } from '@/lib/site';
const links = [['About','/about'],['Code','/code'],['Ranks','/ranks'],['Scholarship','/scholarship'],['Merch','/merch'],['Portal','/portal'],['Contact','/contact']];
export function Nav() {
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 text-sm font-black tracking-widest text-white">BOG</div><div><div className="text-sm font-extrabold tracking-wide text-white sm:text-base lg:text-lg">{site.name}</div><div className="text-xs text-zinc-400">Ownership • Brotherhood • Discipline • Growth</div></div></Link><nav className="hidden items-center gap-5 md:flex">{links.map(([label, href]) => <Link key={href} href={href} className="text-sm text-zinc-300 transition hover:text-red-400">{label}</Link>)}</nav></div></header>;
}

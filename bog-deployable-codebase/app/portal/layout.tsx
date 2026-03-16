import Link from 'next/link';
import { requireUser, getProfile } from '@/lib/auth';
import { redirect } from 'next/navigation';

const links = [
  ['/portal', 'Dashboard'],
  ['/portal/accountability', 'Accountability'],
  ['/portal/meetings', 'Meetings'],
  ['/portal/documents', 'Documents'],
  ['/portal/directory', 'Directory'],
  ['/portal/discussions', 'Discussions'],
] as const;

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const profile = await getProfile();

  if (!profile) redirect('/auth/sign-in');

  if (!profile.is_active) {
   redirect('/pending');
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="card h-fit p-5">
        <div className="text-sm font-bold text-white">{profile.full_name ?? 'Member'}</div>
        <div className="mt-1 text-sm text-zinc-400">
          {profile.rank ?? 'omega'} • {profile.role ?? 'member'}
        </div>
        <nav className="mt-5 flex flex-col gap-2">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}

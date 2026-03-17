import Link from "next/link";
import { requireUser, getProfile } from "@/lib/auth";

const links = [
  ["/admin", "Overview"],
  ["/admin/members", "Members"],
  ["/admin/meetings", "Meetings"],
  <a href="/admin/attendance">Attendance</a>
  ["/admin/documents", "Documents"],
  ["/admin/scholarship", "Scholarship"],
  ["/admin/merch", "Merch"],
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  const profile = await getProfile();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="card h-fit p-5">
        <div className="text-sm font-bold text-white">ADMIN PANEL</div>
        <div className="mt-1 text-sm text-zinc-400">{profile?.full_name}</div>
        <div className="mt-1 text-xs text-zinc-500">
          role: {profile?.role} • rank: {profile?.rank}
        </div>

        <nav className="mt-5 flex flex-col gap-2">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
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


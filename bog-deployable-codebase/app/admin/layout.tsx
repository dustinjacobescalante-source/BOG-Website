import Link from "next/link";
import { requireAdmin, getProfile } from "@/lib/auth";

const links = [
  ["/admin", "Overview"],
  ["/admin/members", "Members"],
  ["/admin/meetings", "Meetings"],
  ["/admin/attendance", "Attendance"],
  ["/admin/documents", "Documents"],
  ["/admin/scholarship", "Scholarship"],
  ["/admin/merch", "Merch"],
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative">
              <div className="border-b border-white/8 pb-5">
                <div className="text-xl font-bold text-white">
                  {profile?.full_name ?? "Admin"}
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  {profile?.rank ?? "omega"} • {profile?.role ?? "admin"}
                </div>
              </div>

              <nav className="mt-5 flex flex-col gap-2">
                {links.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <form action="/auth/sign-out" method="post" className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

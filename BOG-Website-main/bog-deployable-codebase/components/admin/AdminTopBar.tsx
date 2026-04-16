type AdminTopBarProps = {
  title?: string;
  subtitle?: string;
  role?: string;
  userName?: string;
};

export default function AdminTopBar({
  title = "Control Center",
  subtitle = "Manage members, reviews, content, and platform activity.",
  role = "Administrator",
  userName = "Dustin",
}: AdminTopBarProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 px-6 pt-6">
      <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.92),rgba(9,11,18,0.96))] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">
              Brotherhood Operations
            </p>

            <h1 className="mt-2 truncate text-2xl font-black tracking-tight text-white xl:text-[2rem]">
              {title}
            </h1>

            <p className="mt-2 hidden max-w-2xl text-sm text-slate-300 sm:block">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200 sm:inline-flex">
              {role}
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(96,165,250,0.2),rgba(255,255,255,0.04))] text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              {initial}
            </div>

            <a
              href="/auth/sign-out"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.1] hover:text-white"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

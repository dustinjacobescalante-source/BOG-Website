type AdminTopBarProps = {
  title?: string;
  subtitle?: string;
  role?: string;
  userName?: string;
};

export default function AdminTopBar({
  title = "Control Center",
  subtitle = "Manage members, reviews, content, and platform activity.",
  role = "Admin",
  userName = "Dustin",
}: AdminTopBarProps) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06070a]/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
            Brotherhood Operations
          </p>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
            {title}
          </h1>
          <p className="mt-1 hidden text-sm text-zinc-400 sm:block">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300 sm:inline-flex">
            {role}
          </span>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
            {initial}
          </div>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

import { Shield, Sparkles, LogOut, Activity } from "lucide-react";

type AdminTopBarProps = {
  title?: string;
  subtitle?: string;
  role?: string;
};

export default function AdminTopBar({
  title = "Control Center",
  subtitle = "Manage members, reviews, content, and platform activity.",
  role = "Administrator",
}: AdminTopBarProps) {
  const displayRole = role?.trim() || "Administrator";

  return (
    <header className="sticky top-0 z-30 px-6 pt-6">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.9),rgba(9,11,18,0.97))] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl">
        
        {/* BACKGROUND LAYERS */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(96,165,250,0.12),transparent_26%),radial-gradient(circle_at_right_top,rgba(239,68,68,0.08),transparent_20%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className="relative flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          
          {/* LEFT SIDE */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                <Shield className="h-3.5 w-3.5" />
                Brotherhood Operations
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                <Activity className="h-3.5 w-3.5" />
                System Active
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                {displayRole}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-white xl:text-[2rem]">
              {title}
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              {subtitle}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 lg:justify-end">
            
            <form action="/auth/sign-out" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/15 hover:bg-white/[0.1] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>

          </div>
        </div>
      </div>
    </header>
  );
}

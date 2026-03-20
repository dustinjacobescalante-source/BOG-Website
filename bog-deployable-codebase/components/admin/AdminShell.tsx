"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["/admin", "Overview"],
  ["/admin/members", "Members"],
  ["/admin/meetings", "Meetings"],
  ["/admin/attendance", "Attendance"],
  ["/admin/documents", "Documents"],
  ["/admin/scholarship", "Scholarship"],
  ["/admin/merch", "Merch"],
] as const;

type AdminShellProps = {
  children: React.ReactNode;
  fullName?: string | null;
  rank?: string | null;
  role?: string | null;
};

export default function AdminShell({
  children,
  fullName,
  rank,
  role,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = fullName?.trim() || "Admin";
  const displayMeta = [rank, role].filter(Boolean).join(" • ");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* MOBILE TOP BAR */}
      <div className="border-b border-white/10 bg-black/85 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md">
              <span className="text-sm font-black tracking-[0.24em] text-white">
                BOG
              </span>
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                Admin Panel
              </div>
              <div className="truncate text-base font-medium text-zinc-100">
                {displayName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
            aria-label="Open admin menu"
          >
            <span className="text-2xl leading-none">≡</span>
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-10">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative">
              <div className="border-b border-white/8 pb-5">
                <div className="text-xl font-bold text-white">{displayName}</div>
                {displayMeta ? (
                  <div className="mt-1 text-sm text-zinc-400">{displayMeta}</div>
                ) : null}
              </div>

              <nav className="mt-5 flex flex-col gap-2">
                {links.map(([href, label]) => {
                  const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "border border-white/10 bg-white/[0.08] text-white"
                          : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
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

        {/* MAIN CONTENT */}
        <main className="min-w-0">{children}</main>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed left-0 top-0 z-50 h-dvh w-[88%] max-w-sm border-r border-white/10 bg-[#050505]/95 backdrop-blur-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <span className="text-sm font-black tracking-[0.24em] text-white">
                  BOG
                </span>
              </div>

              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-zinc-500">
                  Admin Menu
                </div>
                <div className="truncate text-base font-medium text-zinc-100">
                  {displayName}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
              aria-label="Close admin menu"
            >
              <span className="text-xl leading-none">✕</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {displayMeta ? (
              <div className="mb-6 text-sm text-zinc-400">{displayMeta}</div>
            ) : null}

            <nav className="flex flex-col gap-2">
              {links.map(([href, label]) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-2xl px-4 py-4 text-base font-medium transition-all duration-300 ${
                      isActive
                        ? "border border-white/10 bg-white/[0.08] text-white"
                        : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/8 p-6">
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-base font-medium text-zinc-300 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
}

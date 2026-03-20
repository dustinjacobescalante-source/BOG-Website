"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type PortalShellProps = {
  children: React.ReactNode;
  fullName?: string | null;
  rank?: string | null;
  role?: string | null;
};

export default function PortalShell({
  children,
  fullName,
  rank,
  role,
}: PortalShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = useMemo(() => {
    const items = [
      { label: "Dashboard", href: "/portal" },
      { label: "Accountability", href: "/portal/accountability" },
      { label: "Meetings", href: "/portal/meetings" },
      { label: "Documents", href: "/portal/documents" },
      { label: "Directory", href: "/portal/directory" },
      { label: "Discussions", href: "/portal/discussions" },
    ];

    if (role === "admin") {
      items.unshift({ label: "Admin", href: "/admin" });
    }

    return items;
  }, [role]);

  const displayName = fullName?.trim() || "Member";
  const displayMeta = [rank, role].filter(Boolean).join(" • ");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md">
              <span className="text-sm font-black tracking-[0.24em] text-white">
                BOG
              </span>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-400">
                Portal
              </div>
              <div className="text-sm font-medium text-zinc-200">
                {displayName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
            aria-label="Open portal menu"
          >
            <span className="text-2xl leading-none">≡</span>
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <span className="text-sm font-black tracking-[0.24em] text-white">
                    BOG
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-400">
                    Brotherhood
                  </div>
                  <div className="text-sm text-zinc-200">
                    Discipline • Brotherhood • Leadership
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/8 pt-5">
                <div className="text-lg font-bold text-white">{displayName}</div>
                {displayMeta ? (
                  <div className="mt-1 text-sm text-zinc-400">{displayMeta}</div>
                ) : null}
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                {links.map((link) => {
                  const isActive =
                    pathname === link.href || pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "border border-white/10 bg-white/[0.08] text-white"
                          : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {link.label}
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

        <main className="min-w-0">{children}</main>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-all duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-dvh w-[88%] max-w-sm border-r border-white/10 bg-[#050505]/95 p-6 backdrop-blur-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <span className="text-sm font-black tracking-[0.24em] text-white">
                BOG
              </span>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-400">
                Portal
              </div>
              <div className="text-sm font-medium text-zinc-200">{displayName}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
            aria-label="Close portal menu"
          >
            <span className="text-xl leading-none">✕</span>
          </button>
        </div>

        <div className="mt-6 border-t border-white/8 pt-5">
          <div className="text-2xl font-bold text-white">{displayName}</div>
          {displayMeta ? (
            <div className="mt-2 text-base text-zinc-400">{displayMeta}</div>
          ) : null}
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-4 py-4 text-base font-medium transition-all duration-300 ${
                  isActive
                    ? "border border-white/10 bg-white/[0.08] text-white"
                    : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form action="/auth/sign-out" method="post" className="mt-8">
          <button
            type="submit"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-base font-medium text-zinc-300 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
          >
            Sign Out
          </button>
        </form>
      </aside>
    </div>
  );
}

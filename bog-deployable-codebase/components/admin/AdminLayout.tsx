"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  GraduationCap,
  Shirt,
  Menu,
  X,
  ChevronRight,
  Shield,
  Settings,
  LogOut,
  Sparkles,
  PanelLeft,
} from "lucide-react";

import AdminTopBar from "@/components/admin/AdminTopBar";

type AdminLayoutProps = {
  children: ReactNode;
  fullName?: string | null;
  rank?: string | null;
  role?: string | null;
};

const nav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Meetings", href: "/admin/meetings", icon: CalendarDays },
  { name: "Documents", href: "/admin/documents", icon: FileText },
  { name: "Scholarship", href: "/admin/scholarship", icon: GraduationCap },
  { name: "Merch", href: "/admin/merch", icon: Shirt },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function getInitials(name?: string | null) {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  return initials || "A";
}

function getDisplayName(name?: string | null) {
  if (!name || !name.trim()) return "Admin";
  return name.trim();
}

function getDisplayRank(rank?: string | null) {
  if (!rank || !rank.trim()) return "admin";
  return rank.trim().toLowerCase();
}

function getDisplayRole(role?: string | null) {
  if (!role || !role.trim()) return "admin";
  return role.trim().toLowerCase();
}

export default function AdminLayout({
  children,
  fullName,
  rank,
  role,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initials = getInitials(fullName);
  const displayName = getDisplayName(fullName);
  const displayRank = getDisplayRank(rank);
  const displayRole = getDisplayRole(role);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#05060a]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.035),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025),transparent_18%,transparent_82%,rgba(255,255,255,0.015))]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* MOBILE TOP BAR */}
        <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[rgba(9,11,17,0.84)] px-4 py-3 backdrop-blur-xl xl:hidden">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-white/15 hover:bg-white/[0.08]"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">
              BOG Admin
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              Brotherhood Operations
            </div>
          </div>

          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(96,165,250,0.18),rgba(255,255,255,0.04))] text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            {initials}
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        {open && (
          <div className="fixed inset-0 z-[60] xl:hidden">
            <div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <aside className="absolute left-0 top-0 flex h-full w-[88vw] max-w-[360px] flex-col border-r border-white/10 bg-[rgba(7,9,15,0.98)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
              <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.98),rgba(8,10,16,0.99))]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(239,68,68,0.08),transparent_26%)]" />

                <div className="relative flex min-h-0 flex-1 flex-col p-4">
                  <div className="shrink-0 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                          <PanelLeft className="h-3.5 w-3.5" />
                          BOG Admin
                        </div>
                        <div className="mt-2 text-lg font-black leading-tight text-white">
                          Brotherhood Operations
                        </div>
                      </div>

                      <button
                        onClick={() => setOpen(false)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:border-white/15 hover:bg-white/[0.1]"
                        aria-label="Close admin menu"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(96,165,250,0.24),rgba(255,255,255,0.04))] text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                        {initials}
                      </span>

                      <div className="min-w-0">
                        <div className="text-sm font-bold leading-tight text-white">
                          {displayName}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                            {displayRank}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                            {displayRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                        <Shield className="h-3.5 w-3.5" />
                        Administrative Command
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Manage structure, approvals, meetings, documents, and
                        system discipline from one controlled space.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 shrink-0">
                    <div className="flex items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                      <Sparkles className="h-3.5 w-3.5" />
                      Navigation
                    </div>
                  </div>

                  <nav className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                    {nav.map((item) => {
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-medium transition duration-200 ${
                            active
                              ? "border-white/15 bg-[linear-gradient(135deg,rgba(96,165,250,0.22),rgba(255,255,255,0.08))] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_45px_rgba(0,0,0,0.28)]"
                              : "border-white/6 bg-white/[0.02] text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-full bg-gradient-to-b from-blue-400/80 via-white/70 to-red-400/80 opacity-0 transition duration-200 group-hover:opacity-60" />
                          <span
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                              active
                                ? "border-white/15 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                : "border-white/8 bg-white/[0.03] text-slate-300 group-hover:border-white/12 group-hover:bg-white/[0.06] group-hover:text-white"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </span>

                          <span className="flex-1">{item.name}</span>

                          <ChevronRight
                            className={`h-4 w-4 transition ${
                              active
                                ? "translate-x-0 text-white/80"
                                : "translate-x-0 text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="mt-4 shrink-0 space-y-3">
                    <form action="/auth/sign-out" method="POST">
                      <button
                        type="submit"
                        className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-white"
                      >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-slate-300 transition group-hover:border-white/12 group-hover:bg-white/[0.06] group-hover:text-white">
                          <LogOut className="h-4 w-4" />
                        </span>
                        <span className="flex-1 text-left">Logout</span>
                        <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:text-slate-300" />
                      </button>
                    </form>

                    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Brotherhood Standard
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        Admin pages should feel like platform control — clean,
                        deliberate, and built for oversight.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-[360px] shrink-0 xl:block">
          <div className="sticky top-0 h-screen p-6 pr-4">
            <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.98),rgba(8,10,16,0.99))] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_34px_100px_rgba(0,0,0,0.58)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.11),transparent_30%),radial-gradient(circle_at_bottom,rgba(239,68,68,0.08),transparent_24%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

              <div className="relative flex min-h-0 flex-1 flex-col p-5">
                <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(96,165,250,0.28),rgba(255,255,255,0.04))] text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                      {initials}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="text-[1rem] font-black leading-tight text-white">
                        {displayName}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                          {displayRank}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                          {displayRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                      <Shield className="h-3.5 w-3.5" />
                      Admin Portal
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Structured control for members, meetings, documents, and
                      platform operations.
                    </p>
                  </div>
                </div>

                <div className="mt-5 shrink-0">
                  <div className="flex items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Navigation
                  </div>
                </div>

                <nav className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {nav.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-medium transition duration-200 ${
                          active
                            ? "border-white/15 bg-[linear-gradient(135deg,rgba(96,165,250,0.22),rgba(255,255,255,0.08))] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_45px_rgba(0,0,0,0.28)]"
                            : "border-white/6 bg-white/[0.02] text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <span
                          className={`pointer-events-none absolute inset-y-2 left-2 w-[3px] rounded-full transition ${
                            active
                              ? "bg-gradient-to-b from-blue-400/90 via-white/70 to-red-400/90 opacity-100"
                              : "bg-gradient-to-b from-blue-400/70 via-white/50 to-red-400/70 opacity-0 group-hover:opacity-60"
                          }`}
                        />

                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                            active
                              ? "border-white/15 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                              : "border-white/8 bg-white/[0.03] text-slate-300 group-hover:border-white/12 group-hover:bg-white/[0.06] group-hover:text-white"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </span>

                        <span className="flex-1">{item.name}</span>

                        <ChevronRight
                          className={`h-4 w-4 transition ${
                            active
                              ? "text-white/80"
                              : "text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-5 shrink-0 space-y-3">
                  <form action="/auth/sign-out" method="POST">
                    <button
                      type="submit"
                      className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-white"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-slate-300 transition group-hover:border-white/12 group-hover:bg-white/[0.06] group-hover:text-white">
                        <LogOut className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-left">Logout</span>
                      <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:text-slate-300" />
                    </button>
                  </form>

                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Buffalo Dogs
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      You&apos;re in charge. Show us what leadership is about.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-16 shrink-0 xl:hidden" />

          <div className="hidden xl:block">
            <AdminTopBar
  title="Admin Dashboard"
  subtitle="Manage members, reviews, content, and platform activity."
  role={displayRole}
/>
          </div>

          <main className="min-w-0 flex-1 px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8 xl:px-0 xl:pr-6 xl:pt-6">
            <div className="mx-auto w-full max-w-[1440px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
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
} from "lucide-react";

import AdminTopBar from "@/components/admin/AdminTopBar";

type AdminLayoutProps = {
  children: ReactNode;
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_22%)]" />

      <div className="relative flex min-h-screen">
        {/* MOBILE TOP BAR */}
        <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[rgba(10,12,18,0.9)] px-4 py-3 backdrop-blur xl:hidden">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              BOG Admin
            </div>
            <div className="text-sm font-semibold text-white">
              Brotherhood Operations
            </div>
          </div>

          <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
        </div>

        {/* MOBILE SIDEBAR */}
        {open && (
          <div className="fixed inset-0 z-[60] xl:hidden">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <aside className="absolute left-0 top-0 flex h-full w-[86vw] max-w-[340px] flex-col border-r border-white/10 bg-[rgba(8,10,16,0.98)] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(9,11,18,0.98))] p-4">
                <div className="shrink-0 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                        BOG Admin
                      </div>
                      <div className="mt-2 text-lg font-black text-white">
                        Brotherhood Operations
                      </div>
                    </div>

                    <button
                      onClick={() => setOpen(false)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold text-slate-200">
                      Administrator
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/8 text-xs font-bold text-white">
                      D
                    </span>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                      <Shield className="h-3.5 w-3.5" />
                      Admin Portal
                    </div>
                  </div>
                </div>

                <nav className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {nav.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          active
                            ? "border-white/15 bg-[linear-gradient(135deg,rgba(96,165,250,0.22),rgba(255,255,255,0.08))] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_16px_40px_rgba(0,0,0,0.25)]"
                            : "border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${
                            active
                              ? "border-white/15 bg-white/10 text-white"
                              : "border-white/8 bg-white/[0.03] text-slate-300 group-hover:text-white"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>

                        <span className="flex-1">{item.name}</span>

                        <ChevronRight
                          className={`h-4 w-4 transition ${
                            active
                              ? "text-white/80"
                              : "text-slate-500 group-hover:text-slate-300"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-4 shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Brotherhood Standard
                  </div>
                  <p className="mt-3 break-words text-sm leading-6 text-slate-300">
                    Admin pages should feel like platform control — clean,
                    deliberate, and built for oversight.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-[320px] shrink-0 xl:block">
          <div className="sticky top-0 h-screen p-6 pr-4">
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(9,11,18,0.98))] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_28px_90px_rgba(0,0,0,0.5)]">
              <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(96,165,250,0.28),rgba(255,255,255,0.04))] text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    D
                  </span>

                  <div className="min-w-0">
                    <div className="truncate text-lg font-black text-white">
                      Dustin
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                        omega
                      </span>
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                        admin
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                    <Shield className="h-3.5 w-3.5" />
                    Admin Portal
                  </div>
                </div>
              </div>

              <nav className="mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {nav.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "border-white/15 bg-[linear-gradient(135deg,rgba(96,165,250,0.22),rgba(255,255,255,0.08))] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_16px_40px_rgba(0,0,0,0.25)]"
                          : "border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${
                          active
                            ? "border-white/15 bg-white/10 text-white"
                            : "border-white/8 bg-white/[0.03] text-slate-300 group-hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                      </span>

                      <span className="flex-1">{item.name}</span>

                      <ChevronRight
                        className={`h-4 w-4 transition ${
                          active
                            ? "text-white/80"
                            : "text-slate-500 group-hover:text-slate-300"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-5 shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Brotherhood Standard
                </div>
                <p className="mt-3 break-words text-sm leading-6 text-slate-300">
                  Admin pages should feel like platform control — clean,
                  deliberate, and built for oversight.
                </p>
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
              role="Administrator"
              userName="Dustin"
            />
          </div>

          <main className="min-w-0 flex-1 px-4 pb-6 sm:px-6 lg:px-8 xl:px-0 xl:pr-6">
            <div className="mx-auto w-full max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PortalShellProps = {
  children: ReactNode;
  fullName?: string | null;
  rank?: string | null;
  role?: string | null;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/portal",
    icon: LayoutDashboard,
  },
  {
    label: "Accountability",
    href: "/portal/accountability",
    icon: CheckSquare,
  },
  {
    label: "Meetings",
    href: "/portal/meetings",
    icon: CalendarDays,
  },
  {
    label: "Documents",
    href: "/portal/documents",
    icon: FileText,
  },
  {
    label: "Directory",
    href: "/portal/directory",
    icon: Users,
  },
  {
    label: "Discussions",
    href: "/portal/discussions",
    icon: MessageSquare,
  },
];

function getInitials(name?: string | null) {
  if (!name) return "B";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");

  return initials || "B";
}

function getDisplayRank(rank?: string | null) {
  return rank ? String(rank).toLowerCase() : "omega";
}

function isActivePath(pathname: string, href: string) {
  if (href === "/portal") return pathname === "/portal";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function PortalSidebarContent({
  pathname,
  initials,
  displayRank,
  displayRole,
  isSigningOut,
  onSignOut,
}: {
  pathname: string;
  initials: string;
  displayRank: string;
  displayRole: string;
  isSigningOut: boolean;
  onSignOut: () => Promise<void>;
}) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,15,23,0.96),rgba(7,10,16,0.98))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.36)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_38%)]" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative">
        <div className="mb-5 rounded-[24px] border border-white/10 bg-black/25 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,255,255,0.06)]">
              {initials}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                {displayRank}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                {displayRole}
              </span>
            </div>
          </div>

          <div className="mt-4 h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <Shield className="h-3.5 w-3.5" />
            Member Portal
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center justify-between rounded-2xl border px-3.5 py-3 text-sm transition-all duration-200 ${
                  active
                    ? "border-white/20 bg-white/[0.10] text-white scale-[1.02] shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                    : "border-transparent bg-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {active && (
                  <>
                    <div className="absolute inset-y-2 left-1 w-1 rounded-full bg-gradient-to-b from-red-500 via-red-400 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.55)]" />
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_left,rgba(239,68,68,0.10),transparent_35%)]" />
                  </>
                )}

                <div className="relative flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                      active
                        ? "border-white/15 bg-black/30 text-white"
                        : "border-white/5 bg-black/15 text-zinc-400 group-hover:border-white/10 group-hover:bg-black/25 group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="truncate font-medium">{item.label}</span>
                </div>

                <ChevronRight
                  className={`relative h-4 w-4 shrink-0 transition-all ${
                    active
                      ? "translate-x-0 text-white/70"
                      : "text-zinc-600 group-hover:translate-x-0.5 group-hover:text-zinc-300"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-5">
          <button
            type="button"
            onClick={onSignOut}
            disabled={isSigningOut}
            className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3.5 py-3 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-zinc-400 transition group-hover:text-white">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </span>
            </div>

            <ChevronRight className="h-4 w-4 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortalShell({
  children,
  fullName,
  rank,
  role,
}: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayRank = getDisplayRank(rank);
  const displayRole = role?.trim() || "member";
  const initials = getInitials(fullName);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.push("/auth/sign-in");
      router.refresh();
    } finally {
      setIsSigningOut(false);
      setMobileMenuOpen(false);
    }
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[linear-gradient(180deg,rgba(11,15,23,0.96),rgba(7,10,16,0.98))] backdrop-blur-xl xl:hidden">
        <div className="mx-auto w-full max-w-[1760px] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.06]"
              aria-label="Open member portal menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Member Portal
              </div>
              <div className="mt-1 truncate text-lg font-bold text-white">
                BOG Operations
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white">
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition xl:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile slide-out menu */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[88%] max-w-sm p-4 transition-transform duration-300 xl:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Member Navigation
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:border-white/20 hover:bg-white/[0.06]"
            aria-label="Close member portal menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <PortalSidebarContent
          pathname={pathname}
          initials={initials}
          displayRank={displayRank}
          displayRole={displayRole}
          isSigningOut={isSigningOut}
          onSignOut={handleSignOut}
        />
      </aside>

      <div className="mx-auto w-full max-w-[1760px] px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pb-14 lg:pt-5 xl:px-8 2xl:px-10">
        <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-6">
          {/* Desktop sidebar only */}
          <aside className="hidden xl:sticky xl:top-6 xl:block xl:self-start">
            <PortalSidebarContent
              pathname={pathname}
              initials={initials}
              displayRank={displayRank}
              displayRole={displayRole}
              isSigningOut={isSigningOut}
              onSignOut={handleSignOut}
            />
          </aside>

          <section className="min-w-0 w-full">{children}</section>
        </div>
      </div>
    </>
  );
}

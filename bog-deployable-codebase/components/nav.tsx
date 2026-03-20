"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const baseLinks = [
  ["About", "/about"],
  ["Code", "/code"],
  ["Ranks", "/ranks"],
  ["Scholarship", "/scholarship"],
  ["Merch", "/merch"],
  ["Portal", "/portal"],
  ["Contact", "/contact"],
] as const;

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (active) {
        setIsAdmin(profile?.role === "admin");
      }
    }

    loadRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadRole();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const links = isAdmin
    ? ([["Admin", "/admin"], ...baseLinks] as const)
    : baseLinks;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "border-b border-white/10 bg-black/60 backdrop-blur-xl"
            : "bg-black/0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md">
                <span className="text-sm font-black tracking-[0.24em] text-white">
                  BOG
                </span>
              </div>

              <div className="hidden sm:block">
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-400">
                  Brotherhood
                </div>
                <div className="mt-0.5 text-sm text-zinc-200">
                  Discipline • Brotherhood • Leadership
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {links.map(([label, href]) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative inline-flex h-11 items-center rounded-2xl px-4 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-zinc-300 hover:-translate-y-[1px] hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{label}</span>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]" />
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`absolute h-[2px] w-5 bg-white transition ${
                  mobileOpen ? "rotate-45" : "-translate-y-[6px]"
                }`}
              />
              <span
                className={`absolute h-[2px] w-5 bg-white transition ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute h-[2px] w-5 bg-white transition ${
                  mobileOpen ? "-rotate-45" : "translate-y-[6px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        } md:hidden`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm border-l border-white/10 bg-black/95 p-6 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-white">Menu</div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-3">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-4 py-3 text-zinc-300 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

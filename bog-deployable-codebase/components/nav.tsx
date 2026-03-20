"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const links = [
  ["About", "/about"],
  ["Code", "/code"],
  ["Ranks", "/ranks"],
  ["Scholarship", "/scholarship"],
  ["Merch", "/merch"],
  ["Portal", "/portal"],
  ["Contact", "/contact"],
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08]">
                <span className="text-sm font-black tracking-[0.24em] text-white">
                  BOG
                </span>
              </div>

              <div className="hidden sm:block">
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-zinc-400">
                  {site.name}
                </div>
                <div className="mt-0.5 text-sm text-zinc-200">
                  Discipline • Brotherhood • Leadership
                </div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
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
                    className={`relative inline-flex h-11 items-center rounded-2xl px-4 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-zinc-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {label}

                    {isActive && (
                      <span className="absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE CTA */}
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                Log In
              </Link>

              <Link
                href="/portal"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-600 to-red-700 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(185,28,28,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400 hover:shadow-[0_16px_40px_rgba(185,28,28,0.34)]"
              >
                Enter
              </Link>
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white md:hidden"
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

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* MOBILE MENU */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm border-l border-white/10 bg-black/95 p-6 transition-transform ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-white">Menu</div>
          <button onClick={() => setMobileOpen(false)}>✕</button>
        </div>

        <nav className="mt-8 flex flex-col gap-3">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-4 py-3 text-zinc-300 hover:bg-white/[0.05] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-white/10 px-4 py-3 text-center text-zinc-200"
          >
            Log In
          </Link>

          <Link
            href="/portal"
            className="rounded-xl bg-red-600 px-4 py-3 text-center font-semibold text-white"
          >
            Enter Brotherhood
          </Link>
        </div>
      </aside>
    </>
  );
}

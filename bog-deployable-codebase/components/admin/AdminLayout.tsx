"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

const nav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: Shield },
  { name: "Events", href: "/admin/events", icon: Calendar },
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
    <div className="flex min-h-screen bg-[#06070a] text-white">
      {/* MOBILE TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0b0d11]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-white/10 p-2"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-sm font-semibold tracking-wide">
          BOG Admin
        </span>

        <div className="w-8" /> {/* spacer */}
      </div>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-white/10 bg-[#0b0d11] p-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
                BOG Admin
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {nav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#0b0d11] p-4 lg:flex">
        <div className="mb-6 px-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            BOG Admin
          </h2>
        </div>

        <nav className="flex flex-col gap-2">
          {nav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive(item.href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 pt-14 lg:pt-0">{children}</div>
    </div>
  );
}

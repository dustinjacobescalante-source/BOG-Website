"use client";

import Link from "next/link";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  Calendar,
  Settings,
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
  return (
    <div className="flex min-h-screen bg-[#06070a] text-white">
      {/* Sidebar */}
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
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

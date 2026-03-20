import Link from "next/link";
import {
  Users,
  Shield,
  Wallet,
  Activity,
  BadgeCheck,
  Sparkles,
  CalendarRange,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Members",
    value: "248",
    subtext: "Active accounts with current portal access.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Pending Reviews",
    value: "17",
    subtext: "Items waiting for admin action.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    label: "Monthly Revenue",
    value: "$18.2K",
    subtext: "Gross processed this month.",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    label: "System Health",
    value: "99.9%",
    subtext: "Core systems operational.",
    icon: <Activity className="h-5 w-5" />,
  },
];

const actions = [
  {
    title: "Manage Members",
    description: "Review profiles, update status, and manage access.",
    href: "/admin/members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Review Applications",
    description: "Handle approvals, denials, and pending submissions.",
    href: "/admin/reviews",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "Content Control",
    description: "Edit announcements, featured content, and notices.",
    href: "/admin/content",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Events & Scheduling",
    description: "Create events and manage visibility for members.",
    href: "/admin/events",
    icon: <CalendarRange className="h-5 w-5" />,
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#11141a_0%,#0b0d11_100%)] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_30%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                  Admin Command
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Admin Overview
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                  A cleaner, sharper control center for managing your platform
                  with a more premium, elite feel.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/members"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Manage Members
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Portal
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Stat Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-[#0e1014] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                      {stat.label}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {stat.subtext}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Quick Actions */}
          <section className="rounded-[2rem] border border-white/10 bg-[#0b0d11] p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Fast Actions
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Quick Admin Actions
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Jump straight into the most important admin workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {actions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-3xl border border-white/10 bg-[#0e1014] p-5 transition hover:border-white/20 hover:bg-[#11151b]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200">
                    {action.icon}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {action.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-zinc-300 transition group-hover:text-white">
                    <span>Open</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

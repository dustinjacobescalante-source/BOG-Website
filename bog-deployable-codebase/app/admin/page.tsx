import Link from "next/link";
import {
  Users,
  Shield,
  Wallet,
  Activity,
  BadgeCheck,
  Sparkles,
  CalendarRange,
  ArrowUpRight,
} from "lucide-react";
import AdminSection from "@/components/admin/AdminSection";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminActionCard from "@/components/admin/AdminActionCard";

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

const activityFeed = [
  {
    title: "New member approved",
    detail: "A new account was granted portal access.",
    time: "12 min ago",
  },
  {
    title: "Application submitted",
    detail: "A new review item entered the approval queue.",
    time: "34 min ago",
  },
  {
    title: "Content updated",
    detail: "Homepage announcement was edited by admin.",
    time: "1 hr ago",
  },
  {
    title: "Billing sync complete",
    detail: "Monthly payment records finished syncing.",
    time: "Today",
  },
];

export default function AdminPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
      <div className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
        <div className="space-y-6 lg:space-y-8">
          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#11141a_0%,#0b0d11_100%)] px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_30%)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500">
                  Admin Command
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[3.25rem] lg:leading-[1]">
                  Admin Overview
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-[15px]">
                  Take Control and Run This Shit Brother
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/members"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Manage Members
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Portal
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <AdminStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                subtext={stat.subtext}
                icon={stat.icon}
              />
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <AdminSection
              eyebrow="Fast Actions"
              title="Quick Admin Actions"
              description="Jump straight into the most important admin workflows."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {actions.map((action) => (
                  <AdminActionCard
                    key={action.title}
                    title={action.title}
                    description={action.description}
                    href={action.href}
                    icon={action.icon}
                  />
                ))}
              </div>
            </AdminSection>

            <AdminSection
              eyebrow="Live Feed"
              title="Recent Activity"
              description="A quick stream of what is happening across the platform."
            >
              <div className="space-y-3">
                {activityFeed.map((item) => (
                  <div
                    key={`${item.title}-${item.time}`}
                    className="rounded-2xl border border-white/10 bg-[#0e1014]/95 p-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-[#11151b]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          {item.detail}
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>
          </section>
        </div>
      </div>
    </main>
  );
}

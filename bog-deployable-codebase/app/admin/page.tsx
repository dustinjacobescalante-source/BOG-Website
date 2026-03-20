import {
  Users,
  Shield,
  Wallet,
  Activity,
  BadgeCheck,
  Sparkles,
  CalendarRange,
} from "lucide-react";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminActionCard from "@/components/admin/AdminActionCard";
import AdminActivityItem from "@/components/admin/AdminActivityItem";

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
          <AdminHero
            eyebrow="Admin Command"
            title="Admin Overview"
            description="A cleaner, sharper control center for managing your platform with a more premium, elite feel."
          />

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
                  <AdminActivityItem
                    key={`${item.title}-${item.time}`}
                    title={item.title}
                    detail={item.detail}
                    time={item.time}
                  />
                ))}
              </div>
            </AdminSection>
          </section>
        </div>
      </div>
    </main>
  );
}

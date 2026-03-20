import { createClient } from "@/lib/supabase/server";
import {
  Users,
  Shield,
  Wallet,
  Activity,
  BadgeCheck,
  Sparkles,
  CalendarRange,
} from "lucide-react";
import AdminPageShell from "@/components/admin/AdminPageShell";
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

export default async function AdminPage() {
const supabase = await createClient();
  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  return (
  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="Admin Command"
        title="Admin Overview"
        description="Take Control and Run This Shit Brother"
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
    </AdminPageShell>
  );
}

import {
  Activity,
  Calendar,
  Trophy,
  User,
} from "lucide-react";

import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import AdminStatCard from "@/components/admin/AdminStatCard";

// CHANGE THIS IMPORT ONLY IF YOUR SUPABASE SERVER HELPER LIVES SOMEWHERE ELSE
import { createClient } from "@/lib/supabase/server";

export default async function PortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Member";

  const email = user?.email || "No email found";

  const stats = [
    {
      label: "Workouts Completed",
      value: "42",
      subtext: "Total sessions logged this month.",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      label: "Upcoming Events",
      value: "3",
      subtext: "Events you are registered for.",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Rank",
      value: "#12",
      subtext: "Current leaderboard position.",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      label: "Profile Status",
      value: user ? "Active" : "Offline",
      subtext: user
        ? "Your account is in good standing."
        : "User session not found.",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <AdminPageShell>
      <AdminHero
  eyebrow="Member Portal"
  title="Welcome back"
description={`Good to see you — you're signed in as ${email}`}
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminSection
          eyebrow="Progress"
          title="Your Activity"
          description="Overview of your recent performance and engagement."
        >
          <div className="space-y-3 text-sm text-zinc-400">
            <p>• 5 workouts completed this week</p>
            <p>• 12% improvement in performance</p>
            <p>• 3-day active streak</p>
          </div>
        </AdminSection>

        <AdminSection
          eyebrow="Next Steps"
          title="Recommended Actions"
          description="Stay consistent and keep progressing."
        >
          <div className="space-y-3 text-sm text-zinc-400">
            <p>• Complete your next scheduled workout</p>
            <p>• Review upcoming event details</p>
            <p>• Update your profile goals</p>
          </div>
        </AdminSection>
      </section>
    </AdminPageShell>
  );
}

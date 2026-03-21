import { redirect } from "next/navigation";
import {
  Activity,
  Calendar,
  Trophy,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import AdminStatCard from "@/components/admin/AdminStatCard";

export default async function PortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email, is_active, role, rank")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/auth/sign-in");
  }

  if (!profile.is_active) {
    redirect("/pending");
  }

  const displayName =
    profile.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Member";

  const email = profile.email || user.email || "No email found";

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
      value: profile.rank ? String(profile.rank).toUpperCase() : "OMEGA",
      subtext: "Current brotherhood rank.",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      label: "Profile Status",
      value: "Active",
      subtext: "Your account is approved and active.",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="Member Portal"
        title="Your Dashboard"
        description={`Welcome back, ${displayName} • ${email}`}
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

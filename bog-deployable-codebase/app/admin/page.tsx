import AdminCommandNotes from "@/components/admin/AdminCommandNotes";
import AdminAnnouncementComposer from "@/components/admin/AdminAnnouncementComposer";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ScrollText,
  CalendarRange,
  UserCog,
  FileText,
  Camera,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Activity,
  Sparkles,
  Layers3,
} from "lucide-react";

import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminActionCard from "@/components/admin/AdminActionCard";
import AdminActivityItem from "@/components/admin/AdminActivityItem";
import { createClient } from "@/lib/supabase/server";

function formatTimestamp(value?: string | null) {
  if (!value) return "Unknown";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active, rank")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "member");

  const { count: pendingReviewsCount } = await supabase
    .from("scholarship_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: publishedMeetingsCount } = await supabase
    .from("meetings")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { data: recentMembers } = await supabase
    .from("profiles")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: recentMeetings } = await supabase
    .from("meetings")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: recentComments } = await supabase
    .from("meeting_comments")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  const approvedMembers = memberCount ?? 0;
  const pendingReviews = pendingReviewsCount ?? 0;
  const publishedMeetings = publishedMeetingsCount ?? 0;

  const adminRank =
    typeof profile.rank === "string" && profile.rank.trim().length > 0
      ? profile.rank.toUpperCase()
      : "ADMIN";

  const stats = [
    {
      label: "Approved Members",
      value: approvedMembers.toString(),
      subtext: "Members currently approved and active inside the platform.",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Pending Reviews",
      value: pendingReviews.toString(),
      subtext: "Scholarship applications waiting on admin action.",
      icon: <ScrollText className="h-5 w-5" />,
    },
    {
      label: "Published Meetings",
      value: publishedMeetings.toString(),
      subtext: "Meeting agendas visible to the brotherhood.",
      icon: <CalendarRange className="h-5 w-5" />,
    },
    {
      label: "Access Level",
      value: adminRank,
      subtext: "Your current administrative authority.",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  const actions = [
    {
      title: "Manage Members",
      description:
        "Approve users, review profiles, adjust access, and keep the roster clean.",
      href: "/admin/members",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      title: "Manage Meetings",
      description:
        "Create, edit, publish, and maintain meeting agendas and attachments.",
      href: "/admin/meetings",
      icon: <CalendarRange className="h-5 w-5" />,
    },
    {
      title: "Brotherhood Feed",
      description:
        "Moderate member photo/video posts and manage feed activity.",
      href: "/admin/feed",
      icon: <Camera className="h-5 w-5" />,
    },
    {
      title: "Manage Documents",
      description:
        "Upload, organize, pin, and maintain key files members rely on.",
      href: "/admin/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Scholarship Control",
      description:
        "Review scholarship submissions and keep the process moving.",
      href: "/admin/scholarship",
      icon: <BadgeCheck className="h-5 w-5" />,
    },
  ];

  const activityFeed = [
    ...(recentMembers || []).map((item) => ({
      title: "New member joined",
      detail: "A new user account was created.",
      time: formatTimestamp(item.created_at),
    })),
    ...(recentMeetings || []).map((item) => ({
      title: "Meeting created",
      detail: item.title || "New meeting scheduled.",
      time: formatTimestamp(item.created_at),
    })),
    ...(recentComments || []).map((item) => ({
      title: "New comment posted",
      detail: "A member added a comment to a meeting.",
      time: formatTimestamp(item.created_at),
    })),
    {
      title: "Admin access confirmed",
      detail: `Signed in with active ${adminRank.toLowerCase()} access.`,
      time: "Current",
    },
  ].slice(0, 6);

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Lead the platform. Control the standard."
        description="Manage approvals, meetings, documents, notifications, and member-facing structure from one command center."
        actions={[
          { href: "/admin/members", label: "Manage Members" },
          { href: "/portal", label: "View Member Portal" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2),transparent_36%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_28%),linear-gradient(180deg,rgba(13,16,27,0.96),rgba(9,11,18,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:p-8">
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-200">
              <Layers3 className="h-3.5 w-3.5" />
              Brotherhood Operations
            </div>

            <h2 className="text-4xl font-black leading-none tracking-tight text-white sm:text-5xl xl:text-6xl">
              Run approvals.
              <br />
              Publish clearly.
              <br />
              Keep structure tight.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              Oversee the roster, move key actions forward, and keep the portal
              aligned with the standard.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  <Activity className="h-3.5 w-3.5" />
                  Command Status
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  Active
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Pending Queue
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {pendingReviews}
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Live Meetings
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  {publishedMeetings}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-[30px] border border-red-400/20 bg-[linear-gradient(180deg,rgba(17,19,29,0.96),rgba(11,12,20,0.98))] p-6">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-red-200">
              <Sparkles className="h-3.5 w-3.5" />
              Priority Action
            </div>

            <h3 className="mt-3 text-2xl font-black text-white">
              {pendingReviews > 0
                ? "Clear the review queue."
                : "Review queue is clear."}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {pendingReviews > 0
                ? `You have ${pendingReviews} pending scholarship application(s).`
                : "No scholarship applications currently need review."}
            </p>

            <Link
              href="/admin/scholarship"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white"
            >
              Open scholarship control
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <AdminCommandNotes />
        </div>
      </section>

      <AdminAnnouncementComposer />

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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <AdminSection
          eyebrow="Admin Workflows"
          title="Primary Admin Actions"
          description="Move straight into the operational areas that matter most."
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
          eyebrow="Live Platform Read"
          title="Command Feed"
          description="A quick snapshot of what needs attention right now."
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

          <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
              <div>
                <div className="text-sm font-semibold text-white">
                  Admin access verified
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Your account is active and authorized to manage the admin
                  portal.
                </p>
              </div>
            </div>
          </div>
        </AdminSection>
      </section>
    </AdminPageShell>
  );
}
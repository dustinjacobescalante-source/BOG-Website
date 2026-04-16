import { redirect } from "next/navigation";
import {
  FileText,
  MessageSquare,
  Trophy,
  Calendar,
  CheckSquare,
  ChevronRight,
  Shield,
  Flame,
  ScrollText,
  Sparkles,
  Settings,
  BookOpen,
  Mic2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import AdminStatCard from "@/components/admin/AdminStatCard";

function formatDate(date?: string | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getRankLabel(rank?: string | null) {
  if (!rank) return "OMEGA";
  return String(rank).toUpperCase();
}

function ActivityRow({
  label,
  title,
  subtext,
}: {
  label: string;
  title: string;
  subtext: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/30">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-zinc-500">{subtext}</div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-black/30 hover:shadow-[0_16px_40px_rgba(239,68,68,0.08)]"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-zinc-300 transition group-hover:border-red-500/25 group-hover:text-white">
          {icon}
        </div>

        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-xs leading-5 text-zinc-500">{description}</div>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
    </a>
  );
}

function FocusMiniCard({
  label,
  value,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 transition duration-300 hover:border-white/20 hover:bg-black/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {label}
          </div>
          <div className="mt-2 text-lg font-bold text-white">{value}</div>
          <div className="mt-2 text-xs leading-5 text-zinc-500">{subtext}</div>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-zinc-300">
          {icon}
        </div>
      </div>
    </div>
  );
}

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
  const greeting = getGreeting();
  const isAdmin = profile.role === "admin";

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [
    { count: documentCount },
    { count: discussionCount },
    { data: latestDocument },
    { data: latestDiscussion },
    { data: latestMeeting },
    { data: accountabilityEntry },
    { count: publishedMeetingCount },
    { data: settings },
  ] = await Promise.all([
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase
      .from("discussion_threads")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("documents")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("discussion_threads")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("meetings")
      .select("id, title, meeting_date, status")
      .eq("status", "published")
      .order("meeting_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("accountability_entries")
      .select("id, entry_month, entry_year, updated_at")
      .eq("user_id", user.id)
      .eq("entry_month", currentMonth)
      .eq("entry_year", currentYear)
      .maybeSingle(),
    supabase
      .from("meetings")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("portal_settings")
      .select("*")
      .eq("key", "monthly_focus")
      .maybeSingle(),
  ]);

  const stats = [
    {
      label: "Rank",
      value: getRankLabel(profile.rank),
      subtext: "Your current brotherhood standing.",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      label: "Profile Status",
      value: "Active",
      subtext: "Approved and cleared for portal access.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      label: "Documents",
      value: String(documentCount ?? 0),
      subtext: "Resources currently available.",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Discussions",
      value: String(discussionCount ?? 0),
      subtext: "Threads active on the board.",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  const accountabilityStatus = accountabilityEntry ? "Updated" : "Not Started";
  const accountabilitySubtext = accountabilityEntry?.updated_at
    ? `Last updated ${formatDate(accountabilityEntry.updated_at)}`
    : "No accountability entry for this month yet.";

  const heroActions = isAdmin
    ? [
        {
          href: "/admin",
          label: "Admin Portal",
          icon: <Settings className="h-4 w-4" />,
        },
        { href: "/", label: "Back to Home" },
      ]
    : [{ href: "/", label: "Back to Home" }];

  const bookTitle = settings?.book_title || "The Daily Stoic";
  const bookAuthor = settings?.book_author || "Ryan Holiday & Stephen Hanselman";
  const bookCoverUrl = settings?.book_cover_url || "";
  const bookDescription =
    settings?.book_description ||
    "A practical daily reading focused on discipline, perspective, resilience, and self-command. The goal is to keep the monthly focus rooted in mindset and action, not just motivation.";
  const bookWhyItMatters =
    settings?.book_why_it_matters ||
    "Reinforces steadiness, responsibility, and internal discipline.";
  const bookMonthlyEmphasis =
    settings?.book_monthly_emphasis ||
    "Small daily standards create long-term strength.";

  const sermonTitle = settings?.sermon_title || "Kingdom Men Rising";
  const sermonSpeaker = settings?.sermon_speaker || "Monthly Leadership Focus";
  const sermonDescription =
    settings?.sermon_description ||
    "This month’s sermon focus centers on leadership, responsibility, spiritual steadiness, and becoming the kind of man whose habits match his words. The goal is not just inspiration, but alignment.";
  const sermonKeyTakeaway =
    settings?.sermon_key_takeaway ||
    "Leadership starts with ownership before influence.";
  const sermonMemberReminder =
    settings?.sermon_member_reminder ||
    "Let the month’s focus shape your accountability and action.";

  return (
    <AdminPageShell>
      <AdminHero
        eyebrow="Member Portal"
        title="Your Dashboard"
        description={`${greeting}, ${displayName} • ${email}`}
        actions={heroActions}
      />

      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,14,24,0.96),rgba(6,8,14,1))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-7 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_24%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative grid gap-6 xl:grid-cols-[1.35fr_0.92fr]">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                <Sparkles className="h-3 w-3" />
                Brotherhood Command
              </div>

              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
                Hold the line.
                <br />
                Stay accountable.
                <br />
                <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  Keep moving forward.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                This is your member command center. Review recent activity, stay
                current on meetings and discussions, and keep your accountability
                rhythm tight. Take control and run this shit
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FocusMiniCard
                label="Accountability"
                value={accountabilityStatus}
                subtext={accountabilitySubtext}
                icon={<CheckSquare className="h-4 w-4 text-red-400" />}
              />

              <FocusMiniCard
                label="Published Meetings"
                value={String(publishedMeetingCount ?? 0)}
                subtext="Current published agenda items available."
                icon={<Calendar className="h-4 w-4 text-red-400" />}
              />

              <FocusMiniCard
                label="The System"
                value="Don't Drift"
                subtext="Standards first. Action over excuses."
                icon={<Flame className="h-4 w-4 text-red-400" />}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <a
              href="/portal/accountability"
              className="group relative overflow-hidden rounded-[28px] border border-red-500/30 bg-gradient-to-br from-red-600/22 to-red-950/10 px-5 py-5 shadow-[0_12px_40px_rgba(239,68,68,0.12)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-red-400/40 hover:shadow-[0_20px_50px_rgba(239,68,68,0.16)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
              <div className="relative">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300">
                  Priority Action
                </div>
                <div className="mt-3 text-2xl font-bold text-white">
                  Open Accountability
                </div>
                <div className="mt-2 text-sm leading-6 text-zinc-200">
                  Review this month, update progress, and stay on track.
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Enter now
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>

            <div className="rounded-[28px] border border-white/10 bg-black/25 px-5 py-5 transition duration-300 hover:border-white/20 hover:bg-black/30">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Member Identity
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{displayName}</div>
              <div className="mt-2 text-sm text-zinc-400">
                Rank: {getRankLabel(profile.rank)} • Role:{" "}
                {profile.role ? String(profile.role) : "member"}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-zinc-300">
                Fear God. Everyone else bleeds the same. If your enemy is hungry, feed him; if he is thirsty, give him a drink; for in so doing you will heap burning coals on his head.
              </div>
            </div>
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <AdminSection
          eyebrow="Live Activity"
          title="What’s New"
          description="Recent updates across your member platform."
        >
          <div className="space-y-4">
            <ActivityRow
              label="Latest Document"
              title={latestDocument?.title || "No documents yet"}
              subtext={
                latestDocument?.created_at
                  ? formatDate(latestDocument.created_at)
                  : "Not available"
              }
            />

            <ActivityRow
              label="Latest Discussion"
              title={latestDiscussion?.title || "No discussion threads yet"}
              subtext={
                latestDiscussion?.created_at
                  ? formatDate(latestDiscussion.created_at)
                  : "Not available"
              }
            />

            <ActivityRow
              label="Latest Published Meeting"
              title={latestMeeting?.title || "No published meetings yet"}
              subtext={
                latestMeeting?.meeting_date
                  ? formatDate(latestMeeting.meeting_date)
                  : "Not available"
              }
            />
          </div>
        </AdminSection>

        <AdminSection
          eyebrow="Quick Actions"
          title="Recommended Actions"
          description="Move straight into the areas that matter most."
        >
          <div className="space-y-3">
            <QuickLink
              href="/portal/accountability"
              icon={<CheckSquare className="h-4 w-4" />}
              title="Open accountability"
              description="Review and update your monthly check-in."
            />

            <QuickLink
              href="/portal/meetings"
              icon={<Calendar className="h-4 w-4" />}
              title="Review meetings"
              description="Read published agendas and prepare ahead."
            />

            <QuickLink
              href="/portal/discussions"
              icon={<MessageSquare className="h-4 w-4" />}
              title="Check discussions"
              description="Stay current on private brotherhood threads."
            />

            <QuickLink
              href="/portal/documents"
              icon={<ScrollText className="h-4 w-4" />}
              title="Open documents"
              description="Access forms, resources, and shared material."
            />
          </div>
        </AdminSection>
      </section>

      <section className="space-y-6">
        <AdminSection
          eyebrow="Current Standing"
          title="Monthly Check-In"
          description="Your current accountability position for this month."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-300">
                <CheckSquare className="h-4 w-4" />
              </div>

              <div>
                <div className="text-base font-semibold text-white">
                  {accountabilityStatus}
                </div>
                <div className="text-sm text-zinc-500">{accountabilitySubtext}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-zinc-300">
              Keep your month current. Small updates made consistently are more
              powerful than a rushed review at the end.
            </div>

            <a
              href="/portal/accountability"
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Open Accountability
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </AdminSection>

        <AdminSection
          eyebrow="Member Focus"
          title="Book + Sermon of the Month"
          description="A cleaner monthly focus area for growth, discipline, and alignment."
        >
          <div className="space-y-5">
            <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(14,20,34,0.98),rgba(8,10,18,0.98))] p-5 sm:p-6">
              <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)] md:items-start">
                <div className="flex flex-col items-center">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                    <BookOpen className="h-3.5 w-3.5" />
                    Book Cover
                  </div>

                  {bookCoverUrl ? (
                    <img
                      src={bookCoverUrl}
                      alt={bookTitle}
                      className="h-56 w-36 rounded-[18px] object-cover shadow-[0_22px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-56 w-36 items-center justify-center rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(127,29,29,0.95),rgba(69,10,10,0.98))] shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
                      <div className="flex h-full w-full flex-col justify-between rounded-[18px] border-l border-white/10 p-4">
                        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-red-200/80">
                          Brotherhood Read
                        </div>
                        <div className="text-lg font-black leading-tight text-white">
                          {bookTitle}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                          {bookAuthor}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    {bookCoverUrl ? "Live cover image" : "No cover image added yet"}
                  </div>
                </div>

                <div className="space-y-4 min-w-0">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Book of the Month
                    </div>
                    <h3 className="mt-2 text-3xl font-black leading-tight text-white">
                      {bookTitle}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-zinc-400">
                      {bookAuthor}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <p className="text-sm leading-7 text-zinc-300">
                      {bookDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Why it matters
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-300 break-words">
                    {bookWhyItMatters}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Monthly emphasis
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-300 break-words">
                    {bookMonthlyEmphasis}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(16,22,36,0.96),rgba(8,10,18,0.98))] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200">
                    <Mic2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Sermon of the Month
                    </div>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
                      {sermonTitle}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Speaker: {sermonSpeaker}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
                  Monthly Sermon
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <p className="text-sm leading-7 text-zinc-300">
                  {sermonDescription}
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Key takeaway
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-300 break-words">
                    {sermonKeyTakeaway}
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Member reminder
                  </div>
                  <div className="mt-3 text-sm leading-7 text-zinc-300 break-words">
                    {sermonMemberReminder}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </section>
    </AdminPageShell>
  );
}

import Link from "next/link";
import { Section } from "@/components/section";
import { Card } from "@/components/cards";
import { createClient } from "@/lib/supabase/server";
import { requireUser, getProfile } from "@/lib/auth";

export default async function Page() {
  const user = await requireUser();
  const profile = await getProfile();
  const supabase = await createClient();

  const [{ data: latest }, { data: upcoming }] = await Promise.all([
    supabase
      .from("accountability_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_year", { ascending: false })
      .order("entry_month", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("meetings")
      .select("title, meeting_date, status")
      .eq("status", "published")
      .gte("meeting_date", new Date().toISOString())
      .order("meeting_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const stats = [
    ["Personal Goals", latest?.personal_goal ? "Set" : "Add one"],
    ["Habits", latest?.weekly_notes ? "Logged" : "Update"],
    ["Commitments", latest?.commitments_declared ? "Active" : "None"],
    ["Progress", latest?.wins ? "Tracked" : "Start now"],
  ];

  const isAdmin = profile?.role === "admin";

  return (
    <Section
      label="Portal"
      title="Member Dashboard"
      description="Individual accounts with real operating tools."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <div className="text-sm font-semibold text-zinc-500">{label}</div>
            <div className="mt-2 text-2xl font-black text-white">{value}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-lg font-bold text-white">
            Latest accountability entry
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            {latest
              ? `${latest.entry_month}/${latest.entry_year} entry found.`
              : "No accountability entry yet."}
          </p>
        </Card>

        <Card>
          <div className="text-lg font-bold text-white">Upcoming meeting</div>
          <p className="mt-2 text-sm text-zinc-400">
            {upcoming
              ? `${upcoming.title} • ${new Date(
                  upcoming.meeting_date
                ).toLocaleString()}`
              : "No published meeting found."}
          </p>
        </Card>
      </div>

      {isAdmin && (
        <div className="mt-6">
          <Card>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
                  Admin Access
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  Admin Tools Available
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                  Your account has admin privileges. Use the admin area to manage
                  members, meetings, scholarship submissions, merch, and other
                  platform operations.
                </p>
              </div>

              <Link
                href="/admin"
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(185,28,28,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400 hover:shadow-[0_16px_48px_rgba(185,28,28,0.32)]"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          </Card>
        </div>
      )}
    </Section>
  );
}

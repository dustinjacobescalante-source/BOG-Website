import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Bell, Mail, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";

type NotificationPreferences = {
  user_id: string;
  feed_posts: boolean;
  meetings: boolean;
  documents: boolean;
  discussions: boolean;
  discussion_replies: boolean;
};

async function updateNotificationPreferences(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active) {
    redirect("/pending");
  }

  const preferences = {
    user_id: user.id,
    feed_posts: formData.get("feed_posts") === "on",
    meetings: formData.get("meetings") === "on",
    documents: formData.get("documents") === "on",
    discussions: formData.get("discussions") === "on",
    discussion_replies: formData.get("discussion_replies") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("member_notification_preferences")
    .upsert(preferences, { onConflict: "user_id" });

  if (error) {
    console.error("notification preferences update error:", error);
    return;
  }

  revalidatePath("/portal/notifications");
}

function ToggleRow({
  name,
  title,
  description,
  defaultChecked,
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-start justify-between gap-4 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 transition hover:border-white/20 hover:bg-black/30">
      <div className="min-w-0">
        <div className="text-sm font-bold text-white">{title}</div>
        <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
      </div>

      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-5 w-5 shrink-0 accent-red-600"
      />
    </label>
  );
}

export default async function PortalNotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active, email")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active) {
    redirect("/pending");
  }

  const { data: existingPreferences } = await supabase
    .from("member_notification_preferences")
    .select(
      "user_id, feed_posts, meetings, documents, discussions, discussion_replies"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const preferences = (existingPreferences ?? {
    user_id: user.id,
    feed_posts: true,
    meetings: true,
    documents: true,
    discussions: true,
    discussion_replies: true,
  }) as NotificationPreferences;

  return (
    <div className="w-full space-y-6">
      <AdminHero
        eyebrow="Member Portal"
        title="Notification Settings"
        description="Choose which BOG updates should be sent to your email."
        actions={[
          { href: "/portal", label: "Back to Dashboard" },
          { href: "/portal/feed", label: "Brotherhood Feed" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_34%),linear-gradient(180deg,rgba(15,18,28,0.96),rgba(8,10,18,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
            <Bell className="h-3.5 w-3.5" />
            Stay in the Loop
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Control the noise.
            <br />
            Keep the signal.
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-300">
            Notifications are meant to keep you connected to important BOG
            movement without turning the portal into another noisy app.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-red-300" />
              <div>
                <div className="text-sm font-semibold text-white">
                  Delivery Email
                </div>
                <p className="mt-1 break-words text-sm leading-6 text-zinc-400">
                  {profile.email || user.email || "No email found"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
              <div>
                <div className="text-sm font-semibold text-white">
                  Active member preferences
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  These settings only control email alerts. Portal access and
                  member visibility are not affected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AdminSection
          eyebrow="Email Preferences"
          title="Choose Your Alerts"
          description="Turn alerts on or off for the updates you care about."
        >
          <form action={updateNotificationPreferences} className="space-y-4">
            <ToggleRow
              name="feed_posts"
              title="Brotherhood Feed Posts"
              description="Email me when a member posts a new photo or video in the Brotherhood Feed."
              defaultChecked={preferences.feed_posts}
            />

            <ToggleRow
              name="meetings"
              title="New Meetings Posted"
              description="Email me when a new meeting is published for members."
              defaultChecked={preferences.meetings}
            />

            <ToggleRow
              name="documents"
              title="New Documents Added"
              description="Email me when a new member document or resource is added."
              defaultChecked={preferences.documents}
            />

            <ToggleRow
              name="discussions"
              title="New Discussion Threads"
              description="Email me when a member starts a new discussion thread."
              defaultChecked={preferences.discussions}
            />

            <ToggleRow
              name="discussion_replies"
              title="Discussion Replies"
              description="Email me when members respond to discussion threads."
              defaultChecked={preferences.discussion_replies}
            />

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <Bell className="h-4 w-4" />
              Save Notification Settings
            </button>
          </form>
        </AdminSection>
      </section>
    </div>
  );
}

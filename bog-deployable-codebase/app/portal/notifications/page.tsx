import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  Bell,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Trash2,
} from "lucide-react";

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

  if (!user) redirect("/auth/sign-in");

  await supabase.from("member_notification_preferences").upsert(
    {
      user_id: user.id,
      feed_posts: formData.get("feed_posts") === "on",
      meetings: formData.get("meetings") === "on",
      documents: formData.get("documents") === "on",
      discussions: formData.get("discussions") === "on",
      discussion_replies: formData.get("discussion_replies") === "on",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  revalidatePath("/portal/notifications");
}

async function markRead(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  if (!id) return;

  await supabase
    .from("member_notifications")
    .update({ is_read: true })
    .eq("id", id);

  revalidatePath("/portal/notifications");
}

async function deleteNotification(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  if (!id) return;

  await supabase.from("member_notifications").delete().eq("id", id);

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

  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active, email")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active) redirect("/pending");

  const { data: existingPreferences } = await supabase
    .from("member_notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: notifications } = await supabase
    .from("member_notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(25);

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
        title="Notification Center"
        description="Alerts, updates, and your BOG email preferences."
        actions={[
          { href: "/portal", label: "Back to Dashboard" },
          { href: "/portal/feed", label: "Brotherhood Feed" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/10 bg-[rgba(10,14,24,0.94)] p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">
                Recent Notifications
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {notifications?.length ? (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white">
                          {item.title}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          {item.message}
                        </p>

                        <div className="mt-2 text-xs text-zinc-500">
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2">
                        {item.link_url ? (
                          <a
                            href={item.link_url}
                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white"
                          >
                            Open
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}

                        {!item.is_read ? (
                          <form action={markRead}>
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              className="w-full rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300"
                            >
                              Mark Read
                            </button>
                          </form>
                        ) : (
                          <div className="inline-flex items-center justify-center gap-1 text-xs text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" />
                            Read
                          </div>
                        )}

                        <form action={deleteNotification}>
                          <input type="hidden" name="id" value={item.id} />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/15"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_34%),linear-gradient(180deg,rgba(15,18,28,0.96),rgba(8,10,18,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
              <Mail className="h-3.5 w-3.5" />
              Email Delivery
            </div>

            <p className="mt-4 text-sm text-zinc-300">
              {profile.email || user.email}
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
                <p className="text-sm leading-6 text-zinc-400">
                  These settings control email alerts only. Your portal access
                  is not affected.
                </p>
              </div>
            </div>
          </div>

          <AdminSection
            eyebrow="Email Preferences"
            title="Choose Your Alerts"
            description="Turn alerts on or off anytime."
          >
            <form action={updateNotificationPreferences} className="space-y-4">
              <ToggleRow
                name="feed_posts"
                title="Brotherhood Feed Posts"
                description="New member photo/video posts."
                defaultChecked={preferences.feed_posts}
              />

              <ToggleRow
                name="meetings"
                title="Meetings"
                description="When new meetings are published."
                defaultChecked={preferences.meetings}
              />

              <ToggleRow
                name="documents"
                title="Documents"
                description="When new resources are uploaded."
                defaultChecked={preferences.documents}
              />

              <ToggleRow
                name="discussions"
                title="Discussion Threads"
                description="When members start new threads."
                defaultChecked={preferences.discussions}
              />

              <ToggleRow
                name="discussion_replies"
                title="Replies"
                description="When members reply in discussions."
                defaultChecked={preferences.discussion_replies}
              />

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                <Bell className="h-4 w-4" />
                Save Preferences
              </button>
            </form>
          </AdminSection>
        </div>
      </section>
    </div>
  );
}
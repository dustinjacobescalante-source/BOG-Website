import { Resend } from "resend";

type NotificationType = "feed_posts" | "meetings" | "documents" | "discussions";

type NotifyMembersInput = {
  type: NotificationType;
  subject: string;
  heading: string;
  message: string;
  buttonLabel?: string;
  buttonUrl?: string;
  excludeUserId?: string;
};

export async function notifyActiveMembers({
  type,
  subject,
  heading,
  message,
  buttonLabel,
  buttonUrl,
  excludeUserId,
}: NotifyMembersInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thebuffalodogs.com";

  if (!apiKey) {
    console.error("notifyActiveMembers: Missing RESEND_API_KEY");
    return;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        email,
        is_active,
        member_notification_preferences (
          feed_posts,
          meetings,
          documents,
          discussions
        )
      `
    )
    .eq("is_active", true)
    .not("email", "is", null);

  if (error) {
    console.error("notifyActiveMembers: profile query failed", error);
    return;
  }

  const recipients =
    members?.filter((member) => {
      if (!member.email) return false;
      if (excludeUserId && member.id === excludeUserId) return false;

      const preferences = Array.isArray(member.member_notification_preferences)
        ? member.member_notification_preferences[0]
        : member.member_notification_preferences;

      if (!preferences) return true;

      return preferences[type] !== false;
    }) ?? [];

  if (recipients.length === 0) return;

  const resend = new Resend(apiKey);
  const finalButtonUrl = buttonUrl
    ? buttonUrl.startsWith("http")
      ? buttonUrl
      : `${siteUrl}${buttonUrl}`
    : siteUrl;

  await Promise.allSettled(
    recipients.map((member) =>
      resend.emails.send({
        from: "BOG <onboarding@resend.dev>",
        to: member.email,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; background:#07080d; color:#ffffff; padding:28px;">
            <div style="max-width:640px; margin:0 auto; border:1px solid rgba(255,255,255,0.12); border-radius:22px; padding:24px; background:#0d111c;">
              <div style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#f87171; font-weight:700;">
                Brotherhood of Growth
              </div>

              <h1 style="margin:16px 0 10px; font-size:28px; line-height:1.1;">
                ${heading}
              </h1>

              <p style="font-size:15px; line-height:1.7; color:#d4d4d8;">
                ${message}
              </p>

              ${
                buttonLabel
                  ? `<a href="${finalButtonUrl}" style="display:inline-block; margin-top:18px; background:#dc2626; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:14px; font-weight:700;">
                      ${buttonLabel}
                    </a>`
                  : ""
              }

              <p style="margin-top:24px; font-size:12px; line-height:1.6; color:#71717a;">
                You are receiving this because you are an active BOG member.
              </p>
            </div>
          </div>
        `,
      })
    )
  );
}

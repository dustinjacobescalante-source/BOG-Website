import { Resend } from "resend";

type NotificationType =
  | "feed_posts"
  | "meetings"
  | "documents"
  | "discussions"
  | "discussion_replies";

type NotifyMembersInput = {
  type: NotificationType;
  subject: string;
  heading: string;
  message: string;
  buttonLabel?: string;
  buttonUrl?: string;
  excludeUserId?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildEmailHtml({
  heading,
  message,
  buttonLabel,
  finalButtonUrl,
}: {
  heading: string;
  message: string;
  buttonLabel?: string;
  finalButtonUrl: string;
}) {
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  const safeButtonLabel = buttonLabel ? escapeHtml(buttonLabel) : "";
  const safeButtonUrl = escapeHtml(finalButtonUrl);

  return `
    <div style="margin:0;padding:0;background:#05060a;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#05060a;padding:32px 14px;font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;border:1px solid rgba(255,255,255,0.12);border-radius:26px;overflow:hidden;background:#0b0f19;">
              <tr>
                <td style="padding:0;background:linear-gradient(135deg,#151a27,#090b11);">
                  <div style="height:6px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#f97316);"></div>

                  <div style="padding:34px 30px 26px;">
                    <div style="display:inline-block;border:1px solid rgba(248,113,113,0.35);background:rgba(127,29,29,0.22);border-radius:999px;padding:7px 12px;color:#fecaca;font-size:10px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;">
                      Brotherhood of Growth
                    </div>

                    <h1 style="margin:22px 0 12px;color:#ffffff;font-size:32px;line-height:1.05;font-weight:900;letter-spacing:-0.03em;">
                      ${safeHeading}
                    </h1>

                    <p style="margin:0;color:#d4d4d8;font-size:15px;line-height:1.75;">
                      ${safeMessage}
                    </p>

                    ${
                      safeButtonLabel
                        ? `
                          <div style="margin-top:26px;">
                            <a href="${safeButtonUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;border-radius:16px;padding:14px 20px;font-size:14px;font-weight:800;">
                              ${safeButtonLabel}
                            </a>
                          </div>
                        `
                        : ""
                    }
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:22px 30px;border-top:1px solid rgba(255,255,255,0.08);background:#080b12;">
                  <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;line-height:1.6;">
                    You are receiving this because you are an active BOG member and this alert is enabled in your notification settings.
                  </p>
                  <p style="margin:0;color:#52525b;font-size:11px;line-height:1.6;">
                    Brotherhood of Growth • Discipline • Brotherhood • Leadership
                  </p>
                </td>
              </tr>
            </table>

            <p style="max-width:680px;margin:16px auto 0;color:#52525b;font-size:11px;line-height:1.6;text-align:center;">
              Manage your notification preferences inside the BOG Member Portal.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

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
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.thebuffalodogs.com";

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
          discussions,
          discussion_replies
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

  const finalButtonUrl = buttonUrl
    ? buttonUrl.startsWith("http")
      ? buttonUrl
      : `${siteUrl}${buttonUrl}`
    : siteUrl;

  const notificationRows = recipients.map((member) => ({
    user_id: member.id,
    type,
    title: heading,
    message,
    link_url: buttonUrl || null,
    is_read: false,
  }));

  const { error: notificationError } = await supabase
    .from("member_notifications")
    .insert(notificationRows);

  if (notificationError) {
    console.error(
      "notifyActiveMembers: member_notifications insert failed",
      notificationError
    );
  }

  const resend = new Resend(apiKey);

  const html = buildEmailHtml({
    heading,
    message,
    buttonLabel,
    finalButtonUrl,
  });

  await Promise.allSettled(
    recipients.map((member) =>
      resend.emails.send({
        from: "BOG <onboarding@resend.dev>",
        to: member.email,
        subject,
        html,
      })
    )
  );
}
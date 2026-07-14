import "server-only";

import { Resend } from "resend";
import webpush from "web-push";

import { createAdminClient } from "@/lib/supabase/admin";

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

type MemberRow = {
  id: string;
  email: string | null;
  is_active: boolean;
};

type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
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
  buttonLabel: string;
  finalButtonUrl: string;
}) {
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  const safeButtonLabel = escapeHtml(buttonLabel);
  const safeButtonUrl = escapeHtml(finalButtonUrl);

  return `
    <div style="margin:0;padding:0;background:#05060a;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#05060a;padding:32px 14px;font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;border:1px solid rgba(255,255,255,0.12);border-radius:26px;overflow:hidden;background:#0b0f19;">
              <tr>
                <td style="padding:0;background:linear-gradient(135deg,#171b28,#090b11);">
                  <div style="height:6px;background:linear-gradient(90deg,#7f1d1d,#dc2626,#f97316);"></div>

                  <div style="padding:34px 30px 28px;">
                    <div style="display:inline-block;border:1px solid rgba(248,113,113,0.35);background:rgba(127,29,29,0.24);border-radius:999px;padding:8px 12px;color:#fecaca;font-size:10px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;">
                      BOG
                    </div>

                    <h1 style="margin:22px 0 12px;color:#ffffff;font-size:32px;line-height:1.08;font-weight:900;letter-spacing:-0.03em;">
                      ${safeHeading}
                    </h1>

                    <p style="margin:0;color:#d4d4d8;font-size:15px;line-height:1.75;">
                      ${safeMessage}
                    </p>

                    <div style="margin-top:28px;">
                      <a href="${safeButtonUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;border-radius:16px;padding:14px 20px;font-size:14px;font-weight:800;">
                        ${safeButtonLabel}
                      </a>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:22px 30px;border-top:1px solid rgba(255,255,255,0.08);background:#080b12;">
                  <p style="margin:0 0 8px;color:#a1a1aa;font-size:12px;line-height:1.6;">
                    You are receiving this because you are an active BOG member and this alert is enabled in your notification settings.
                  </p>

                  <p style="margin:0;color:#52525b;font-size:11px;line-height:1.6;">
                    BOG • Discipline • Growth • Accountability • Leadership
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
  buttonLabel = "Open Portal",
  buttonUrl = "/portal/feed",
  excludeUserId,
}: NotifyMembersInput) {
  const supabase = createAdminClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.thebuffalodogs.com";

  const { data: members, error: memberError } = await supabase
    .from("profiles")
    .select("id, email, is_active")
    .eq("is_active", true);

  if (memberError) {
    console.error("Unable to load active BOG members:", memberError);
    throw new Error("Unable to load notification recipients.");
  }

  if (!members?.length) {
    return {
      recipientCount: 0,
      portalNotificationCount: 0,
      pushSentCount: 0,
      pushFailedCount: 0,
      emailSentCount: 0,
    };
  }

  const recipients = (members as MemberRow[]).filter(
    (member) => member.id !== excludeUserId
  );

  if (!recipients.length) {
    return {
      recipientCount: 0,
      portalNotificationCount: 0,
      pushSentCount: 0,
      pushFailedCount: 0,
      emailSentCount: 0,
    };
  }

  /*
   * Create the in-app bell notification using the existing
   * Supabase function already used by the BOG portal.
   */
  const portalResults = await Promise.allSettled(
    recipients.map(async (member) => {
      const { error } = await supabase.rpc("create_member_notification", {
        target_user_id: member.id,
        notification_type: type,
        notification_title: heading,
        notification_message: message,
        notification_link_url: buttonUrl,
      });

      if (error) {
        throw error;
      }

      return member.id;
    })
  );

  const portalNotificationCount = portalResults.filter(
    (result) => result.status === "fulfilled"
  ).length;

  const failedPortalCount =
    portalResults.length - portalNotificationCount;

  if (failedPortalCount > 0) {
    console.error(
      `${failedPortalCount} portal notification(s) failed to create.`
    );
  }

  /*
   * Send push notifications to every subscribed device belonging
   * to the selected active members.
   */
  let pushSentCount = 0;
  let pushFailedCount = 0;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;

  if (publicKey && privateKey && vapidSubject) {
    webpush.setVapidDetails(vapidSubject, publicKey, privateKey);

    const recipientIds = recipients.map((member) => member.id);

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("member_push_subscriptions")
      .select("id, user_id, endpoint, p256dh, auth")
      .in("user_id", recipientIds);

    if (subscriptionError) {
      console.error(
        "Unable to load BOG push subscriptions:",
        subscriptionError
      );
    } else if (subscriptions?.length) {
      const payload = JSON.stringify({
        title: `BOG — ${heading}`,
        body: message,
        url: buttonUrl || "/portal/notifications",
      });

      const pushResults = await Promise.allSettled(
        (subscriptions as PushSubscriptionRow[]).map(
          async (subscription) => {
            try {
              await webpush.sendNotification(
                {
                  endpoint: subscription.endpoint,
                  keys: {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth,
                  },
                },
                payload
              );

              return subscription.id;
            } catch (error: unknown) {
              const pushError = error as {
                statusCode?: number;
                message?: string;
              };

              /*
               * Remove expired subscriptions so future sends
               * do not repeatedly fail.
               */
              if (
                pushError.statusCode === 404 ||
                pushError.statusCode === 410
              ) {
                const { error: deleteError } = await supabase
                  .from("member_push_subscriptions")
                  .delete()
                  .eq("id", subscription.id);

                if (deleteError) {
                  console.error(
                    "Unable to remove expired push subscription:",
                    deleteError
                  );
                }
              }

              throw new Error(
                pushError.message ||
                  "BOG push notification delivery failed."
              );
            }
          }
        )
      );

      pushSentCount = pushResults.filter(
        (result) => result.status === "fulfilled"
      ).length;

      pushFailedCount = pushResults.length - pushSentCount;
    }
  } else {
    console.warn(
      "BOG push delivery skipped because VAPID variables are missing."
    );
  }

  /*
   * Send email notifications when Resend is configured.
   */
  let emailSentCount = 0;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const finalButtonUrl = buttonUrl.startsWith("http")
      ? buttonUrl
      : `${siteUrl}${buttonUrl}`;

    const html = buildEmailHtml({
      heading,
      message,
      buttonLabel,
      finalButtonUrl,
    });

    const emailResults = await Promise.allSettled(
      recipients
        .filter((member) => Boolean(member.email))
        .map(async (member) => {
          await resend.emails.send({
            from: "BOG <onboarding@resend.dev>",
            to: member.email!,
            subject,
            html,
          });

          return member.id;
        })
    );

    emailSentCount = emailResults.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const failedEmailCount =
      emailResults.length - emailSentCount;

    if (failedEmailCount > 0) {
      console.error(
        `${failedEmailCount} BOG email notification(s) failed.`
      );
    }
  }

  console.log("BOG notification delivery completed:", {
    recipientCount: recipients.length,
    portalNotificationCount,
    pushSentCount,
    pushFailedCount,
    emailSentCount,
  });

  return {
    recipientCount: recipients.length,
    portalNotificationCount,
    pushSentCount,
    pushFailedCount,
    emailSentCount,
  };
}

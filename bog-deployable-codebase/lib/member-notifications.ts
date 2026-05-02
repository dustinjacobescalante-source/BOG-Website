import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

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

export async function notifyActiveMembers({
  type,
  subject,
  heading,
  message,
  buttonLabel,
  buttonUrl,
  excludeUserId,
}: NotifyMembersInput) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: members } = await supabase
    .from("profiles")
    .select("id,email,is_active")
    .eq("is_active", true);

  if (!members) return;

  const recipients = members.filter((m) => m.id !== excludeUserId);

  for (const member of recipients) {
    await supabase.rpc("create_member_notification", {
      target_user_id: member.id,
      notification_type: type,
      notification_title: heading,
      notification_message: message,
      notification_link_url: buttonUrl || "/portal/feed",
    });
  }

  console.log("Portal notifications created:", recipients.length);

  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);

  for (const member of recipients) {
    if (!member.email) continue;

    await resend.emails.send({
      from: "BOG <onboarding@resend.dev>",
      to: member.email,
      subject,
      html: `
        <h2>${heading}</h2>
        <p>${message}</p>
        <p><a href="https://www.thebuffalodogs.com${buttonUrl}">Open Portal</a></p>
      `,
    });
  }

  console.log("Emails sent");
}
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
  heading,
  message,
  buttonUrl,
  excludeUserId,
}: NotifyMembersInput) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
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
    .eq("is_active", true);

  if (error) {
    console.error("notifyActiveMembers: profile query failed", error);
    return;
  }

  const recipients =
    members?.filter((member) => {
      if (excludeUserId && member.id === excludeUserId) return false;

      const preferences = Array.isArray(member.member_notification_preferences)
        ? member.member_notification_preferences[0]
        : member.member_notification_preferences;

      if (!preferences) return true;

      return preferences[type] !== false;
    }) ?? [];

  if (recipients.length === 0) {
    console.log("notifyActiveMembers: no recipients", { type });
    return;
  }

  const rpcResults = await Promise.all(
    recipients.map(async (member) => {
      const result = await supabase.rpc("create_member_notification", {
        target_user_id: member.id,
        notification_type: type,
        notification_title: heading,
        notification_message: message,
        notification_link_url: buttonUrl || null,
      });

      if (result.error) {
        console.error("RPC FAILED", {
          memberId: member.id,
          error: result.error,
        });
      } else {
        console.log("RPC SUCCESS", {
          memberId: member.id,
        });
      }

      return result;
    })
  );

  const failedCount = rpcResults.filter((result) => result.error).length;

  console.log("notifyActiveMembers: portal notification RPC completed", {
    type,
    attempted: recipients.length,
    failed: failedCount,
    succeeded: recipients.length - failedCount,
  });
}
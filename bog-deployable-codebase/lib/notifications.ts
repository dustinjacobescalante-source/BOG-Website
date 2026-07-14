import { createClient } from "@/lib/supabase/server";

export async function notifyMembers(
  title: string,
  message: string,
  url: string = "/portal/notifications"
) {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_active", true);

  if (!members?.length) return;

  const notifications = members.map((member) => ({
    user_id: member.id,
    title,
    message,
    link: url,
    is_read: false,
    created_at: new Date().toISOString(),
  }));

  await supabase
    .from("member_notifications")
    .insert(notifications);
}

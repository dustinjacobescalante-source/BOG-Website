import "server-only";

import webpush from "web-push";

import { createAdminClient } from "@/lib/supabase/admin";

type NotifyMembersOptions = {
  title: string;
  message: string;
  url?: string;
  userIds?: string[];
};

type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function notifyMembers({
  title,
  message,
  url = "/portal/notifications",
  userIds,
}: NotifyMembersOptions) {
  const supabase = createAdminClient();

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  /*
   * Find the members who should receive the notification.
   * When userIds is provided, only those members are notified.
   * Otherwise, every active member is notified.
   */
  let memberQuery = supabase
    .from("profiles")
    .select("id")
    .eq("is_active", true);

  if (userIds?.length) {
    memberQuery = memberQuery.in("id", userIds);
  }

  const { data: members, error: memberError } = await memberQuery;

  if (memberError) {
    console.error("Unable to load notification recipients:", memberError);
    throw new Error("Unable to load notification recipients.");
  }

  if (!members?.length) {
    return {
      recipientCount: 0,
      inAppCount: 0,
      pushSentCount: 0,
      pushFailedCount: 0,
    };
  }

  const recipientIds = members.map((member) => member.id);
  const createdAt = new Date().toISOString();

  /*
   * Create the notification records used by the bell icon and
   * notification history page.
   */
  const inAppNotifications = recipientIds.map((userId) => ({
    user_id: userId,
    title,
    message,
    link: url,
    is_read: false,
    created_at: createdAt,
  }));

  const { error: notificationError } = await supabase
    .from("member_notifications")
    .insert(inAppNotifications);

  if (notificationError) {
    console.error(
      "Unable to create in-app notifications:",
      notificationError
    );

    throw new Error("Unable to create in-app notifications.");
  }

  /*
   * The in-app notification still succeeds when push has not been
   * configured or when a member has not enabled push notifications.
   */
  if (!publicKey || !privateKey || !subject) {
    console.warn(
      "Push delivery skipped because VAPID environment variables are missing."
    );

    return {
      recipientCount: recipientIds.length,
      inAppCount: recipientIds.length,
      pushSentCount: 0,
      pushFailedCount: 0,
    };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const { data: subscriptions, error: subscriptionError } = await supabase
    .from("member_push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth")
    .in("user_id", recipientIds);

  if (subscriptionError) {
    console.error(
      "Unable to load push subscriptions:",
      subscriptionError
    );

    return {
      recipientCount: recipientIds.length,
      inAppCount: recipientIds.length,
      pushSentCount: 0,
      pushFailedCount: 0,
    };
  }

  if (!subscriptions?.length) {
    return {
      recipientCount: recipientIds.length,
      inAppCount: recipientIds.length,
      pushSentCount: 0,
      pushFailedCount: 0,
    };
  }

  const payload = JSON.stringify({
    title: `BOG — ${title}`,
    body: message,
    url,
  });

  const pushResults = await Promise.allSettled(
    (subscriptions as PushSubscriptionRow[]).map(async (subscription) => {
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

        return {
          subscriptionId: subscription.id,
          success: true,
        };
      } catch (error: unknown) {
        const pushError = error as {
          statusCode?: number;
          message?: string;
        };

        /*
         * A 404 or 410 means the device subscription is no longer valid.
         * Remove it so future notification attempts do not keep failing.
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
          pushError.message || "Push notification delivery failed."
        );
      }
    })
  );

  const pushSentCount = pushResults.filter(
    (result) => result.status === "fulfilled"
  ).length;

  const pushFailedCount = pushResults.length - pushSentCount;

  return {
    recipientCount: recipientIds.length,
    inAppCount: recipientIds.length,
    pushSentCount,
    pushFailedCount,
  };
}

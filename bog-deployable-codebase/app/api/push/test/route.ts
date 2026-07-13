import { NextResponse } from "next/server";
import webpush from "web-push";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT;

    if (!publicKey || !privateKey || !subject) {
      return NextResponse.json(
        { error: "VAPID environment variables are missing." },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("member_push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", user.id);

    if (subscriptionError) {
      console.error("Unable to load push subscriptions:", subscriptionError);

      return NextResponse.json(
        { error: "Unable to load your push subscriptions." },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: "No push subscription was found for your account." },
        { status: 404 }
      );
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const payload = JSON.stringify({
      title: "BOG Test Notification",
      body: "Push notifications are working on this device.",
      url: "/portal/notifications",
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
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
            id: subscription.id,
            success: true,
          };
        } catch (error: unknown) {
          const pushError = error as {
            statusCode?: number;
            message?: string;
          };

          if (
            pushError.statusCode === 404 ||
            pushError.statusCode === 410
          ) {
            await supabase
              .from("member_push_subscriptions")
              .delete()
              .eq("id", subscription.id);
          }

          throw new Error(
            pushError.message || "Push notification delivery failed."
          );
        }
      })
    );

    const sentCount = results.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const failedCount = results.length - sentCount;

    return NextResponse.json({
      success: sentCount > 0,
      message: `${sentCount} test notification(s) sent. ${failedCount} failed.`,
      sentCount,
      failedCount,
    });
  } catch (error) {
    console.error("Test push notification failed:", error);

    return NextResponse.json(
      { error: "The test push notification could not be sent." },
      { status: 500 }
    );
  }
}

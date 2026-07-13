import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PushSubscriptionPayload = {
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = (await request.json()) as PushSubscriptionPayload;

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.p256dh ||
      !subscription?.keys?.auth
    ) {
      return NextResponse.json(
        { error: "Invalid push subscription" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || null;

    const { error } = await supabase.from("member_push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_agent: userAgent,
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: "endpoint",
      }
    );

    if (error) {
      console.error("Push subscription save failed:", error);

      return NextResponse.json(
        { error: "Failed to save push subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscription route error:", error);

    return NextResponse.json(
      { error: "Unexpected push subscription error" },
      { status: 500 }
    );
  }
}

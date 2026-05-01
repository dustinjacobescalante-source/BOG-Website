import { NextResponse } from "next/server";

import { notifyActiveMembers } from "@/lib/member-notifications";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    console.log("FEED NOTIFY: route started");

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("FEED NOTIFY: auth checked", {
      userId: user?.id ?? null,
      email: user?.email ?? null,
    });

    if (!user) {
      console.log("FEED NOTIFY: unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, is_active")
      .eq("id", user.id)
      .single();

    console.log("FEED NOTIFY: profile lookup", {
      profile,
      profileError,
    });

    if (!profile?.is_active) {
      console.log("FEED NOTIFY: inactive user");
      return NextResponse.json({ error: "Inactive user" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));

    console.log("FEED NOTIFY: request body", body);

    const caption =
      typeof body?.caption === "string" && body.caption.trim().length > 0
        ? body.caption.trim()
        : "A member posted new proof of action in the Brotherhood Feed.";

    const memberName = profile.full_name || user.email || "A BOG member";

    console.log("FEED NOTIFY: calling notifyActiveMembers");

    await notifyActiveMembers({
      type: "feed_posts",
      subject: "New BOG Brotherhood Feed Post",
      heading: "New Brotherhood Feed Post",
      message: `${memberName} posted in the Brotherhood Feed: ${caption}`,
      buttonLabel: "Open Brotherhood Feed",
      buttonUrl: "/portal/feed",
      excludeUserId: user.id,
    });

    console.log("FEED NOTIFY: notifyActiveMembers completed");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FEED NOTIFY ERROR:", error);

    return NextResponse.json(
      { error: "Failed to notify members" },
      { status: 500 }
    );
  }
}
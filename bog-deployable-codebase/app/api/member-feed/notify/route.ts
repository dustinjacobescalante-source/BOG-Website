import { NextResponse } from "next/server";

import { notifyActiveMembers } from "@/lib/member-notifications";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, is_active")
      .eq("id", user.id)
      .single();

    if (!profile?.is_active) {
      return NextResponse.json({ error: "Inactive user" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const caption =
      typeof body?.caption === "string" && body.caption.trim().length > 0
        ? body.caption.trim()
        : "A member posted new proof of action in the Brotherhood Feed.";

    const memberName = profile.full_name || user.email || "A BOG member";

    await notifyActiveMembers({
      type: "feed_posts",
      subject: "New BOG Brotherhood Feed Post",
      heading: "New Brotherhood Feed Post",
      message: `${memberName} posted in the Brotherhood Feed: ${caption}`,
      buttonLabel: "Open Brotherhood Feed",
      buttonUrl: "/portal/feed",
      excludeUserId: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("member feed notify error:", error);
    return NextResponse.json(
      { error: "Failed to notify members" },
      { status: 500 }
    );
  }
}

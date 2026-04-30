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

    const threadId =
      typeof body?.threadId === "string" ? body.threadId.trim() : "";

    const title =
      typeof body?.title === "string" && body.title.trim().length > 0
        ? body.title.trim()
        : "New Discussion Thread";

    if (!threadId) {
      return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
    }

    const memberName = profile.full_name || user.email || "A BOG member";

    await notifyActiveMembers({
      type: "discussions",
      subject: "New BOG Discussion Started",
      heading: "New Discussion Started",
      message: `${memberName} started a new discussion: ${title}`,
      buttonLabel: "Open Discussion",
      buttonUrl: `/portal/discussions/${threadId}`,
      excludeUserId: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("discussion thread notify error:", error);
    return NextResponse.json(
      { error: "Failed to notify members" },
      { status: 500 }
    );
  }
}
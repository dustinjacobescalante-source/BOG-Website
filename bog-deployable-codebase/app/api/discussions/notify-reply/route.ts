import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { notifyActiveMembers } from "@/lib/member-notifications";

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

    const preview =
      typeof body?.preview === "string" && body.preview.trim().length > 0
        ? body.preview.trim()
        : "A new reply was posted.";

    if (!threadId) {
      return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
    }

    const { data: thread } = await supabase
      .from("discussion_threads")
      .select("id, title")
      .eq("id", threadId)
      .single();

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const memberName = profile.full_name || user.email || "A BOG member";

    await notifyActiveMembers({
      type: "discussion_replies",
      subject: `New Reply: ${thread.title}`,
      heading: "New Discussion Reply",
      message: `${memberName} replied to "${thread.title}": ${preview}`,
      buttonLabel: "Open Discussion",
      buttonUrl: `/portal/discussions/${threadId}`,
      excludeUserId: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("discussion reply notify error:", error);
    return NextResponse.json(
      { error: "Failed to notify members" },
      { status: 500 }
    );
  }
}
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
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile?.is_active || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));

    const title = String(body?.title ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const linkUrl = String(body?.linkUrl ?? "").trim();

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required." },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from("admin_announcements")
      .insert({
        title,
        message,
        link_url: linkUrl || null,
        created_by: user.id,
      });

    if (insertError) {
      console.error("announcement insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save announcement." },
        { status: 500 }
      );
    }

    await notifyActiveMembers({
      type: "documents",
      subject: `BOG Announcement: ${title}`,
      heading: title,
      message,
      buttonLabel: linkUrl ? "Open Link" : "Open Portal",
      buttonUrl: linkUrl || "/portal",
      excludeUserId: undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("announcement route error:", error);
    return NextResponse.json(
      { error: "Failed to send announcement." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.is_active || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const keys = webpush.generateVAPIDKeys();

    return NextResponse.json({
      message:
        "Copy these keys into Vercel Environment Variables. After that, delete this route from GitHub.",
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: keys.publicKey,
      VAPID_PRIVATE_KEY: keys.privateKey,
      VAPID_SUBJECT: "mailto:admin@thebuffalodogs.com",
    });
  } catch (error) {
    console.error("VAPID key generation failed:", error);

    return NextResponse.json(
      { error: "Failed to generate VAPID keys" },
      { status: 500 }
    );
  }
}

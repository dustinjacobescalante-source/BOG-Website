import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { meetingId } = await req.json();

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      return NextResponse.json(
        { error: "LiveKit env vars missing" },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized user" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role, rank, is_active")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    if (!profile.is_active && profile.role !== "admin") {
      return NextResponse.json(
        { error: "User is not active" },
        { status: 403 }
      );
    }

    const participantRole = profile.role === "admin" ? "admin" : "member";
    const participantRank = profile.rank || "lone_wolf";

    const safeDisplayName =
      profile.full_name?.trim() ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      "BOG Member";

    const identity = `${participantRole}-${user.id}`;

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: safeDisplayName,
      metadata: JSON.stringify({
        user_id: user.id,
        role: participantRole,
        rank: participantRank,
        full_name: safeDisplayName,
        email: user.email ?? null,
      }),
    });

    at.addGrant({
      room: meetingId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: livekitUrl,
      roomName: meetingId,
      meetingTitle: "BOG Meeting",
      participantName: safeDisplayName,
      participantRank,
    });
  } catch (err) {
    console.error("TOKEN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

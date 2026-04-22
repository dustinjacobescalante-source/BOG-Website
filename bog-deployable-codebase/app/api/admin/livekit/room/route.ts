import { NextResponse } from "next/server";
import { RoomServiceClient } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";

type RequestBody = {
  action?: "kick" | "end";
  roomName?: string;
  participantIdentity?: string;
};

function getLiveKitHost() {
  const publicUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!publicUrl || !apiKey || !apiSecret) {
    throw new Error("Missing LiveKit environment variables.");
  }

  const host = publicUrl.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://");

  return {
    host,
    apiKey,
    apiSecret,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 403 });
    }

    if (!profile.is_active || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as RequestBody | null;

    const action = body?.action;
    const roomName = typeof body?.roomName === "string" ? body.roomName.trim() : "";
    const participantIdentity =
      typeof body?.participantIdentity === "string"
        ? body.participantIdentity.trim()
        : "";

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    const { host, apiKey, apiSecret } = getLiveKitHost();
    const roomService = new RoomServiceClient(host, apiKey, apiSecret);

    if (action === "kick") {
      if (!participantIdentity) {
        return NextResponse.json(
          { error: "Participant identity is required" },
          { status: 400 }
        );
      }

      await roomService.removeParticipant(roomName, participantIdentity);

      return NextResponse.json({
        ok: true,
        action,
        roomName,
        participantIdentity,
      });
    }

    if (action === "end") {
      await roomService.deleteRoom(roomName);

      return NextResponse.json({
        ok: true,
        action,
        roomName,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin LiveKit room route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to manage LiveKit room",
      },
      { status: 500 }
    );
  }
}

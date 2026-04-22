import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: Request) {
  try {
    const { meetingId } = await req.json();

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit env vars missing" },
        { status: 500 }
      );
    }

    const identity = `admin-${Math.random().toString(36).substring(7)}`;

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
    });

    at.addGrant({
      room: meetingId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (err) {
    console.error("TOKEN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

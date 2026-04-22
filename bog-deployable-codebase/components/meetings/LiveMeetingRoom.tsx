"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";

export default function LiveMeetingRoom({
  meetingId,
}: {
  meetingId: string;
}) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingId,
          }),
        });

        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.error("Failed to fetch token", err);
      }
    };

    fetchToken();
  }, [meetingId]);

  if (!token) {
    return (
      <div className="flex h-[500px] items-center justify-center text-white">
        Connecting to live room...
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
      connect
      video
      audio
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";

type TokenResponse = {
  token?: string;
  url?: string;
  roomName?: string;
  meetingTitle?: string;
  participantName?: string;
  error?: string;
};

export default function LiveMeetingRoom({
  meetingId,
}: {
  meetingId: string;
}) {
  const [tokenData, setTokenData] = useState<TokenResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchToken() {
      try {
        setErrorMessage(null);

        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingId,
          }),
        });

        const rawText = await res.text();

        let data: TokenResponse | null = null;
        try {
          data = rawText ? JSON.parse(rawText) : null;
        } catch {
          throw new Error(`Token route returned non-JSON response: ${rawText}`);
        }

        if (!res.ok) {
          throw new Error(
            data?.error
              ? `${res.status} ${data.error}`
              : `${res.status} Failed to fetch token`
          );
        }

        if (!data?.token) {
          throw new Error("Token route returned no token.");
        }

        if (!data?.url) {
          throw new Error("Token route returned no LiveKit URL.");
        }

        if (isMounted) {
          setTokenData(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unknown LiveKit error."
          );
        }
      }
    }

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [meetingId]);

  if (errorMessage) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-red-500/20 bg-black/30 p-6 text-center text-sm text-red-300">
        {errorMessage}
      </div>
    );
  }

  if (!tokenData?.token || !tokenData?.url) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white">
        Connecting to live room...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      <LiveKitRoom
        token={tokenData.token}
        serverUrl={tokenData.url}
        connect
        video
        audio
        data-lk-theme="default"
        className="h-[70vh] min-h-[560px] w-full"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

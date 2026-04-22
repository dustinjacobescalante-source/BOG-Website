"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

type TokenResponse = {
  token?: string;
  url?: string;
  roomName?: string;
  meetingTitle?: string;
  participantName?: string;
  error?: string;
};

function LiveRoomStage() {
  const trackRefs = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const participants = useParticipants();

  const participantCount = useMemo(() => participants.length, [participants]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/5 px-4 py-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Admin Controls
          </div>
          <div className="mt-1 text-sm text-slate-200">
            Use the controls below to mute, unmute, toggle camera, and leave the room.
          </div>
        </div>

        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white">
          Participants: {participantCount}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="h-[62vh] min-h-[520px] p-3">
          <GridLayout tracks={trackRefs} className="h-full">
            <ParticipantTile />
          </GridLayout>
        </div>

        <div className="border-t border-white/10 bg-black/80 p-3" data-lk-theme="default">
          <ControlBar
            variation="minimal"
            controls={{
              microphone: true,
              camera: true,
              screenShare: false,
              chat: false,
              leave: true,
            }}
          />
        </div>
      </div>

      <RoomAudioRenderer />
    </div>
  );
}

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
    <div data-lk-theme="default">
      <LiveKitRoom
        token={tokenData.token}
        serverUrl={tokenData.url}
        connect
        video
        audio
        className="w-full"
      >
        <LiveRoomStage />
      </LiveKitRoom>
    </div>
  );
}

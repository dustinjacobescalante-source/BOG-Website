"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
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

function AdminControls() {
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled } =
    useLocalParticipant();
  const participants = useParticipants();

  const participantCount = useMemo(() => participants.length, [participants]);

  async function toggleMic() {
    await localParticipant?.setMicrophoneEnabled(!isMicrophoneEnabled);
  }

  async function toggleCamera() {
    await localParticipant?.setCameraEnabled(!isCameraEnabled);
  }

  function leaveRoom() {
    window.location.href = "/admin/meetings";
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-500/5 px-4 py-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Admin Controls
          </div>
          <div className="mt-1 text-sm text-slate-200">
            Run the room from here.
          </div>
        </div>

        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white">
          Participants: {participantCount}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={toggleMic}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {isMicrophoneEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>

        <button
          type="button"
          onClick={toggleCamera}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {isCameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
        </button>

        <button
          type="button"
          onClick={leaveRoom}
          className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}

function VideoStage() {
  const cameraTracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
  ]);

  const mainTrack = cameraTracks[0];

  if (!mainTrack) {
    return (
      <div className="flex h-[62vh] min-h-[520px] items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm text-slate-300">
        Waiting for camera...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video
        ref={(el) => {
          if (el && mainTrack.publication?.track) {
            mainTrack.publication.track.attach(el);
          }
        }}
        className="h-[62vh] min-h-[520px] w-full object-cover"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
}

function ParticipantControls({ meetingId }: { meetingId: string }) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  const remoteParticipants = participants.filter(
    (participant) => participant.identity !== localParticipant.identity
  );

  async function kickParticipant(identity: string) {
    try {
      const res = await fetch("/api/admin/livekit/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "kick",
          roomName: meetingId,
          participantIdentity: identity,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
    } catch (err) {
      console.error("Kick failed:", err);
      alert("Failed to kick user");
    }
  }

  async function endMeeting() {
    try {
      const res = await fetch("/api/admin/livekit/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "end",
          roomName: meetingId,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      window.location.href = "/admin/meetings";
    } catch (err) {
      console.error("End meeting failed:", err);
      alert("Failed to end meeting");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Participant Controls
        </div>

        {remoteParticipants.length === 0 ? (
          <div className="text-sm text-slate-300">
            No other participants in the room yet.
          </div>
        ) : (
          <div className="space-y-3">
            {remoteParticipants.map((participant) => (
              <div
                key={participant.identity}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    {participant.name || participant.identity}
                  </div>
                  <div className="text-xs text-slate-400">
                    {participant.identity}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => kickParticipant(participant.identity)}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/15"
                >
                  Kick User
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={endMeeting}
        className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
      >
        End Meeting For Everyone
      </button>
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
    <div data-lk-theme="default" className="space-y-4">
      <LiveKitRoom
        token={tokenData.token}
        serverUrl={tokenData.url}
        connect
        video
        audio
        className="w-full"
      >
        <AdminControls />
        <VideoStage />
        <ParticipantControls meetingId={meetingId} />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

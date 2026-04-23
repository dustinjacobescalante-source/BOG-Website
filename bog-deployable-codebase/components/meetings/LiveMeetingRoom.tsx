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

function parseMetadata(metadata?: string): Record<string, unknown> | null {
  if (!metadata) return null;

  try {
    const parsed = JSON.parse(metadata);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function getParticipantRole(
  participant: {
    identity?: string;
    name?: string;
    metadata?: string;
  },
  fallbackIsAdmin = false
) {
  if (fallbackIsAdmin) {
    return "Admin";
  }

  const parsedMetadata = parseMetadata(participant.metadata);

  const metadataRole =
    typeof parsedMetadata?.role === "string"
      ? parsedMetadata.role.toLowerCase()
      : typeof parsedMetadata?.userRole === "string"
      ? parsedMetadata.userRole.toLowerCase()
      : typeof parsedMetadata?.participantRole === "string"
      ? parsedMetadata.participantRole.toLowerCase()
      : "";

  return metadataRole === "admin" ? "Admin" : "Member";
}

function getParticipantDisplayName(
  participant: {
    identity?: string;
    name?: string;
    metadata?: string;
    isLocal?: boolean;
  }
) {
  if (participant.name && participant.name.trim().length > 0) {
    return participant.name.trim();
  }

  const parsedMetadata = parseMetadata(participant.metadata);

  const metadataName =
    typeof parsedMetadata?.full_name === "string"
      ? parsedMetadata.full_name
      : typeof parsedMetadata?.fullName === "string"
      ? parsedMetadata.fullName
      : typeof parsedMetadata?.name === "string"
      ? parsedMetadata.name
      : typeof parsedMetadata?.participantName === "string"
      ? parsedMetadata.participantName
      : "";

  if (metadataName && metadataName.trim().length > 0) {
    return metadataName.trim();
  }

  if (participant.identity && participant.identity.trim().length > 0) {
    return participant.identity.trim();
  }

  return participant.isLocal ? "You" : "Participant";
}

function FloatingControls({ isAdmin }: { isAdmin: boolean }) {
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
    window.location.href = isAdmin ? "/admin/meetings" : "/portal/meetings";
  }

  return (
    <div className="sticky bottom-4 z-30 flex justify-center px-2 sm:px-4">
      <div className="flex w-full max-w-fit flex-wrap items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-black/75 px-3 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-4">
        <div className="hidden rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 sm:block">
          {isAdmin ? "Admin Room" : "Member Room"}
        </div>

        <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white sm:block">
          Participants: {participantCount}
        </div>

        <button
          type="button"
          onClick={toggleMic}
          className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
            isMicrophoneEnabled
              ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/20"
          }`}
        >
          {isMicrophoneEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>

        <button
          type="button"
          onClick={toggleCamera}
          className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
            isCameraEnabled
              ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border border-amber-500/30 bg-amber-500/15 text-amber-200 hover:bg-amber-500/20"
          }`}
        >
          {isCameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
        </button>

        <button
          type="button"
          onClick={leaveRoom}
          className="rounded-full border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}

function VideoTile({
  trackRef,
  isActiveSpeaker,
  localIsAdmin,
}: {
  trackRef: ReturnType<typeof useTracks>[number];
  isActiveSpeaker: boolean;
  localIsAdmin: boolean;
}) {
  const participant = trackRef.participant;
  const isLocal = participant.isLocal;
  const role = getParticipantRole(participant, isLocal ? localIsAdmin : false);
  const displayName = getParticipantDisplayName(participant);

  return (
    <div
      className={`overflow-hidden rounded-[24px] border bg-black transition ${
        isActiveSpeaker
          ? "border-cyan-400/60 ring-2 ring-cyan-400/40"
          : "border-white/10"
      }`}
    >
      <div className="relative">
        <video
          ref={(el) => {
            if (el && trackRef.publication?.track) {
              trackRef.publication.track.attach(el);
            }
          }}
          className="h-[32vh] min-h-[240px] w-full bg-black object-cover sm:h-[38vh] lg:h-[42vh]"
          autoPlay
          playsInline
          muted={isLocal}
        />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
              role === "Admin"
                ? "border border-cyan-400/30 bg-cyan-500/15 text-cyan-200"
                : "border border-white/10 bg-black/55 text-slate-200"
            }`}
          >
            {role}
          </span>

          {isActiveSpeaker ? (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Speaking
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs font-semibold text-white sm:text-sm">
            {displayName}
            {isLocal ? " (You)" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoStage({ isAdmin }: { isAdmin: boolean }) {
  const cameraTracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const participants = useParticipants();

  const activeSpeakerSid = useMemo(() => {
    const sorted = [...participants].sort((a, b) => b.audioLevel - a.audioLevel);
    return sorted[0]?.sid ?? null;
  }, [participants]);

  const orderedTracks = useMemo(() => {
    const tracks = [...cameraTracks];

    tracks.sort((a, b) => {
      const aIsActive = a.participant.sid === activeSpeakerSid;
      const bIsActive = b.participant.sid === activeSpeakerSid;

      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;

      if (a.participant.isLocal && !b.participant.isLocal) return -1;
      if (!a.participant.isLocal && b.participant.isLocal) return 1;

      return 0;
    });

    return tracks;
  }, [cameraTracks, activeSpeakerSid]);

  if (!orderedTracks.length) {
    return (
      <div className="flex h-[62vh] min-h-[420px] items-center justify-center rounded-[24px] border border-white/10 bg-black/40 px-6 text-center text-sm text-slate-300">
        Waiting for camera...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {orderedTracks.map((trackRef) => (
        <VideoTile
          key={`${trackRef.participant.identity}-${trackRef.source}`}
          trackRef={trackRef}
          isActiveSpeaker={trackRef.participant.sid === activeSpeakerSid}
          localIsAdmin={isAdmin}
        />
      ))}
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
      <div className="rounded-[24px] border border-white/10 bg-black/30 p-4">
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
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-white">
                      {getParticipantDisplayName(participant)}
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                      {getParticipantRole(participant)}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
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
        className="rounded-[20px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
      >
        End Meeting For Everyone
      </button>
    </div>
  );
}

export default function LiveMeetingRoom({
  meetingId,
  isAdmin = false,
}: {
  meetingId: string;
  isAdmin?: boolean;
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
      <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-red-500/20 bg-black/30 p-6 text-center text-sm text-red-300">
        {errorMessage}
      </div>
    );
  }

  if (!tokenData?.token || !tokenData?.url) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-white/10 bg-black/30 p-6 text-sm text-white">
        Connecting to live room...
      </div>
    );
  }

  return (
    <div data-lk-theme="default" className="space-y-4 pb-24">
      <LiveKitRoom
        token={tokenData.token}
        serverUrl={tokenData.url}
        connect
        video
        audio
        className="w-full space-y-4"
      >
        <VideoStage isAdmin={isAdmin} />
        <FloatingControls isAdmin={isAdmin} />
        {isAdmin ? <ParticipantControls meetingId={meetingId} /> : null}
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

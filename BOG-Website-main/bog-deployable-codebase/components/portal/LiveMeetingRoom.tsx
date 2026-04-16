'use client';

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  liveMeetingId: string;
};

type TokenResponse = {
  token: string;
  url: string;
  roomName: string;
  title: string;
};

export default function LiveMeetingRoom({ liveMeetingId }: Props) {
  const [meetingData, setMeetingData] = useState<TokenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [endingMeeting, setEndingMeeting] = useState(false);
  const [egressId, setEgressId] = useState<string | null>(null);
  const [recordingMessage, setRecordingMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadToken() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/live-meetings/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            liveMeetingId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to join live meeting.');
        }

        if (mounted) {
          setMeetingData(data);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to join live meeting.';

        if (mounted) {
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadToken();

    return () => {
      mounted = false;
    };
  }, [liveMeetingId]);

  const canRecord = useMemo(() => !!meetingData?.roomName, [meetingData?.roomName]);

  async function handleStartRecording() {
    if (!meetingData?.roomName) return;

    try {
      setRecordingLoading(true);
      setRecordingMessage(null);

      const response = await fetch('/api/live-meetings/start-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: meetingData.roomName,
          liveMeetingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to start recording.');
      }

      setRecording(true);
      setEgressId(data.egressId ?? null);
      setRecordingMessage('Recording started.');
    } catch (err) {
      setRecordingMessage(
        err instanceof Error ? err.message : 'Failed to start recording.'
      );
    } finally {
      setRecordingLoading(false);
    }
  }

  async function handleStopRecording() {
    if (!egressId) return;

    try {
      setRecordingLoading(true);
      setRecordingMessage(null);

      const response = await fetch('/api/live-meetings/stop-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          egressId,
          liveMeetingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to stop recording.');
      }

      setRecording(false);
      setEgressId(null);
      setRecordingMessage('Recording stopped. Replay will be available after the meeting is ended.');
    } catch (err) {
      setRecordingMessage(
        err instanceof Error ? err.message : 'Failed to stop recording.'
      );
    } finally {
      setRecordingLoading(false);
    }
  }

  async function handleEndMeeting() {
    try {
      setEndingMeeting(true);
      setRecordingMessage(null);

      if (recording && egressId) {
        const stopResponse = await fetch('/api/live-meetings/stop-recording', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            egressId,
            liveMeetingId,
          }),
        });

        const stopData = await stopResponse.json();

        if (!stopResponse.ok) {
          throw new Error(stopData?.error || 'Failed to stop recording before ending meeting.');
        }

        setRecording(false);
        setEgressId(null);
      }

      const response = await fetch('/api/live-meetings/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          liveMeetingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to end meeting.');
      }

      setRecordingMessage('Meeting ended. Refreshing...');
      window.location.reload();
    } catch (err) {
      setRecordingMessage(
        err instanceof Error ? err.message : 'Failed to end meeting.'
      );
    } finally {
      setEndingMeeting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/70">
        Connecting to live meeting...
      </div>
    );
  }

  if (error || !meetingData?.token || !meetingData?.url) {
    return (
      <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 px-6 py-10 text-center text-sm text-red-200">
        {error || 'Unable to join live meeting.'}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl">
      <div className="border-b border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-red-300/80">
              Live Meeting
            </div>
            <div className="mt-1 text-lg font-semibold text-white">
              {meetingData.title}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                recording
                  ? 'border-red-500/30 bg-red-500/15 text-red-200'
                  : 'border-white/10 bg-white/[0.04] text-white/60'
              }`}
            >
              {recording ? 'Recording' : 'Not recording'}
            </div>

            <button
              type="button"
              onClick={handleStartRecording}
              disabled={!canRecord || recording || recordingLoading || endingMeeting}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {recordingLoading && !recording ? 'Starting...' : 'Start Recording'}
            </button>

            <button
              type="button"
              onClick={handleStopRecording}
              disabled={!recording || !egressId || recordingLoading || endingMeeting}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {recordingLoading && recording ? 'Stopping...' : 'Stop Recording'}
            </button>

            <button
              type="button"
              onClick={handleEndMeeting}
              disabled={endingMeeting || recordingLoading}
              className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {endingMeeting ? 'Ending...' : 'End Meeting'}
            </button>
          </div>
        </div>

        {recordingMessage ? (
          <div className="mt-3 text-sm text-white/70">{recordingMessage}</div>
        ) : null}
      </div>

      <div className="h-[78vh] min-h-[620px] w-full bg-black">
        <LiveKitRoom
          token={meetingData.token}
          serverUrl={meetingData.url}
          connect={true}
          video={true}
          audio={true}
          className="h-full w-full"
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  );
}
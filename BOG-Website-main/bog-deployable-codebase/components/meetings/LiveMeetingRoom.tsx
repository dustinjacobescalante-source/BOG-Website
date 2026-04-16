'use client';

import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import { useRouter } from 'next/navigation';

export default function LiveMeetingRoom({ tokenData }: any) {
  const router = useRouter();

  if (!tokenData?.token || !tokenData?.url) {
    return (
      <div className="p-6 text-center text-red-400">
        Failed to load meeting connection.
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black">
        
        <LiveKitRoom
          token={tokenData.token}
          serverUrl={tokenData.url}
          connect={true}
          video
          audio
          data-lk-theme="default"
          className="h-[70vh] min-h-[560px] w-full"
          onDisconnected={() => {
            router.push('/portal/meetings');
          }}
        >
          {/* EVERYTHING must be inside here */}
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>

      </div>
    </div>
  );
}
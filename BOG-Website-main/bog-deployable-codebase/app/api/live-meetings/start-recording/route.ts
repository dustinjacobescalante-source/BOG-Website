import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createFileOutput,
  createPublicRecordingUrl,
  createRecordingFilepath,
  getEgressClient,
} from '@/lib/livekit-egress';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, is_active')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.is_active || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only active admins can start recording.' },
        { status: 403 }
      );
    }

    const { roomName, liveMeetingId } = await req.json();

    if (!roomName || !liveMeetingId) {
      return NextResponse.json(
        { error: 'Missing roomName or liveMeetingId' },
        { status: 400 }
      );
    }

    const filepath = createRecordingFilepath(roomName);
    const client = getEgressClient();

    const egress = await client.startRoomCompositeEgress(
      roomName,
      createFileOutput(roomName, filepath),
      {
        layout: 'grid',
      }
    );

    const publicUrl = createPublicRecordingUrl(filepath);

    const { error: updateError } = await supabase
      .from('live_meetings')
      .update({
        recording_status: 'recording',
        recording_egress_id: egress.egressId,
        recording_url: publicUrl,
        replay_ready: false,
      })
      .eq('id', liveMeetingId);

    if (updateError) {
      console.error('Failed to update live_meetings on recording start:', updateError);
    }

    return NextResponse.json({
      egressId: egress.egressId,
      status: egress.status,
      filepath,
      recordingUrl: publicUrl,
    });
  } catch (error) {
    console.error('Start recording error:', error);

    return NextResponse.json(
      { error: 'Failed to start recording.' },
      { status: 500 }
    );
  }
}
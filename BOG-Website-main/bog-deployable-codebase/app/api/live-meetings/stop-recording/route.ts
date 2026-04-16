import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEgressClient } from '@/lib/livekit-egress';

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
        { error: 'Only active admins can stop recording.' },
        { status: 403 }
      );
    }

    const { egressId, liveMeetingId } = await req.json();

    if (!egressId || !liveMeetingId) {
      return NextResponse.json(
        { error: 'Missing egressId or liveMeetingId' },
        { status: 400 }
      );
    }

    const client = getEgressClient();

    await client.stopEgress(egressId);

    const { error: updateError } = await supabase
      .from('live_meetings')
      .update({
        recording_status: 'stopped',
        replay_ready: true,
      })
      .eq('id', liveMeetingId);

    if (updateError) {
      console.error('Failed to update live_meetings on recording stop:', updateError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stop recording error:', error);

    return NextResponse.json(
      { error: 'Failed to stop recording.' },
      { status: 500 }
    );
  }
}
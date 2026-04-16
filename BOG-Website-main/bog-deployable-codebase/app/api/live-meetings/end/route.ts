import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
        { error: 'Only active admins can end meetings.' },
        { status: 403 }
      );
    }

    const { liveMeetingId } = await req.json();

    if (!liveMeetingId) {
      return NextResponse.json(
        { error: 'Missing liveMeetingId' },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from('live_meetings')
      .update({
        status: 'ended',
        recording_status: 'stopped',
        replay_ready: true,
      })
      .eq('id', liveMeetingId);

    if (updateError) {
      console.error('End meeting update error:', updateError);

      return NextResponse.json(
        { error: 'Failed to end meeting.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('End meeting route error:', error);

    return NextResponse.json(
      { error: 'Failed to end meeting.' },
      { status: 500 }
    );
  }
}
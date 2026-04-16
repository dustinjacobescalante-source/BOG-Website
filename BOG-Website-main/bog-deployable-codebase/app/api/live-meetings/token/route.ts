import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createLiveKitParticipantToken } from '@/lib/livekit';

export async function POST(request: Request) {
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
      .select('id, full_name, role, is_active')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 403 }
      );
    }

    if (!profile.is_active) {
      return NextResponse.json(
        { error: 'Only active members can join live meetings.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const liveMeetingId =
      typeof body?.liveMeetingId === 'string' ? body.liveMeetingId : '';

    if (!liveMeetingId) {
      return NextResponse.json(
        { error: 'Missing liveMeetingId' },
        { status: 400 }
      );
    }

    const { data: liveMeeting, error: liveMeetingError } = await supabase
      .from('live_meetings')
      .select('id, room_name, title, status')
      .eq('id', liveMeetingId)
      .single();

    if (liveMeetingError || !liveMeeting) {
      return NextResponse.json(
        { error: 'Live meeting not found' },
        { status: 404 }
      );
    }

    if (liveMeeting.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This live meeting has been cancelled.' },
        { status: 400 }
      );
    }

    const participantName =
      profile.full_name?.trim() || user.email?.trim() || 'BOG Member';

    const token = await createLiveKitParticipantToken({
      roomName: liveMeeting.room_name,
      participantName,
      participantIdentity: user.id,
      canPublish: true,
      canSubscribe: true,
    });

    console.log('LIVEKIT DEBUG', {
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      keyPrefix: process.env.LIVEKIT_API_KEY?.slice(0, 8),
      roomName: liveMeeting.room_name,
      liveMeetingId: liveMeeting.id,
      userId: user.id,
    });

    return NextResponse.json({
      token,
      url: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      roomName: liveMeeting.room_name,
      title: liveMeeting.title,
    });
  } catch (error) {
    console.error('Live meeting token error:', error);

    return NextResponse.json(
      { error: 'Failed to create live meeting token.' },
      { status: 500 }
    );
  }
}
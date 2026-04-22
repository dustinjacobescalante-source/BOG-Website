import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, is_active')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
    }

    if (!profile.is_active) {
      return NextResponse.json({ error: 'Inactive account' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const meetingId =
      typeof body?.meetingId === 'string' ? body.meetingId.trim() : '';

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
    }

    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id, title, status')
      .eq('id', meetingId)
      .eq('status', 'published')
      .single();

   // TEMP: allow any meeting for testing
if (!meetingId) {
  return NextResponse.json({ error: 'Meeting ID required' }, { status: 400 });
}

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'LiveKit environment variables are missing' },
        { status: 500 }
      );
    }

    const roomName = meetingId;
    const displayName =
      profile.full_name?.trim() || user.email?.trim() || 'BOG Member';

    const token = new AccessToken(apiKey, apiSecret, {
      identity: user.id,
      name: displayName,
      ttl: '2h',
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({
      token: await token.toJwt(),
      url: livekitUrl,
      roomName,
     meetingTitle: meeting?.title ?? "BOG Meeting",
      participantName: displayName,
    });
  } catch (error) {
    console.error('LiveKit token route error:', error);

    return NextResponse.json(
      { error: 'Failed to create LiveKit token' },
      { status: 500 }
    );
  }
}

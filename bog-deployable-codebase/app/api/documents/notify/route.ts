import { NextResponse } from 'next/server';

import { notifyActiveMembers } from '@/lib/member-notifications';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, is_active')
      .eq('id', user.id)
      .single();

    if (!profile?.is_active) {
      return NextResponse.json({ error: 'Inactive user' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));

    const title =
      typeof body?.title === 'string' && body.title.trim().length > 0
        ? body.title.trim()
        : 'New member resource uploaded';

    const memberName = profile.full_name || user.email || 'A BOG member';

    await notifyActiveMembers({
      type: 'documents',
      subject: 'New BOG Document Added',
      heading: 'New Document Added',
      message: `${memberName} uploaded a new document to the library: ${title}`,
      buttonLabel: 'Open Document Library',
      buttonUrl: '/portal/documents',
      excludeUserId: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('documents notify error:', error);

    return NextResponse.json(
      { error: 'Failed to notify members' },
      { status: 500 }
    );
  }
}
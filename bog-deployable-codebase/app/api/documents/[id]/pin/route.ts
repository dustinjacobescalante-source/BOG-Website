import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin';

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/portal/documents', request.url));
  }

  const { data: doc } = await supabase
    .from('documents')
    .select('id, is_pinned')
    .eq('id', id)
    .maybeSingle();

  if (!doc) {
    return NextResponse.redirect(new URL('/portal/documents', request.url));
  }

  await supabase
    .from('documents')
    .update({ is_pinned: !doc.is_pinned })
    .eq('id', id);

  return NextResponse.redirect(new URL('/portal/documents', request.url));
}
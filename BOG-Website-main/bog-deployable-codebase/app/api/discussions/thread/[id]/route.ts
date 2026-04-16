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

  const { data: thread } = await supabase
    .from('discussion_threads')
    .select('id, created_by')
    .eq('id', id)
    .maybeSingle();

  if (!thread) {
    return NextResponse.redirect(new URL('/portal/discussions', request.url));
  }

  const isOwner = thread.created_by === user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.redirect(new URL('/portal/discussions', request.url));
  }

  await supabase.from('discussion_posts').delete().eq('thread_id', id);
  await supabase.from('discussion_threads').delete().eq('id', id);

  return NextResponse.redirect(new URL('/portal/discussions', request.url));
}
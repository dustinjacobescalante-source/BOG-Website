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

  const { data: doc } = await supabase
    .from('documents')
    .select('id, uploaded_by, file_path')
    .eq('id', id)
    .maybeSingle();

  if (!doc) {
    return NextResponse.redirect(new URL('/portal/documents', request.url));
  }

  if (!isAdmin && doc.uploaded_by !== user.id) {
    return NextResponse.redirect(new URL('/portal/documents', request.url));
  }

  if (doc.file_path) {
    await supabase.storage.from('documents').remove([doc.file_path]);
  }

  await supabase.from('documents').delete().eq('id', id);

  return NextResponse.redirect(new URL('/portal/documents', request.url));
}
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!data && user.email) {
    const fallback = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    data = fallback.data;

    if (data && data.id !== user.id) {
      await supabase
        .from('profiles')
        .update({ id: user.id, updated_at: new Date().toISOString() })
        .eq('email', user.email);
    }
  }

  return data;
}

import { createClient } from '@/lib/supabase/server';
import DocumentsPage from '@/components/documents/DocumentsLibraryPage';

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin';

  const { data: documents } = await supabase
    .from('documents')
    .select(`
      *,
      profiles:uploaded_by (
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <DocumentsPage
      documents={documents || []}
      currentUserId={user?.id ?? null}
      isAdmin={isAdmin}
    />
  );
}

import { createClient } from '@/lib/supabase/server';
import DocumentsPage from './DocumentsPage';

export default async function Page() {
  const supabase = await createClient();

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  return <DocumentsPage documents={documents || []} />;
}
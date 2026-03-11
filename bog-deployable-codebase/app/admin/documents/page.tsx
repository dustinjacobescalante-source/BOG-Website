import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('documents').select('id, title, category, is_public, file_url').order('created_at', { ascending: false });
  return <Section label="Admin" title="Manage Documents" description="Upload and categorize printable member resources."><div className="space-y-3">{data?.map((doc) => <Card key={doc.id}><div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-white">{doc.title}</div><div className="text-sm text-zinc-500">{doc.category} • {doc.is_public ? 'public' : 'member only'}</div></div>{doc.file_url ? <Link href={doc.file_url} className="text-sm text-red-400">Open</Link> : <span className="text-sm text-zinc-500">No file</span>}</div></Card>)}</div></Section>;
}

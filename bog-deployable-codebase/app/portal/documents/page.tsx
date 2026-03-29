import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <Section label="Portal" title="Document Library" description="Printable brochure, checklist, agenda template, scholarship packet, and meeting files.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents?.length ? documents.map((doc) => (
          <Card key={doc.id}>
            <div className="text-base font-semibold text-white">{doc.title}</div>
            <div className="mt-2 text-sm text-zinc-500">{doc.category}</div>
            <p className="mt-3 text-sm text-zinc-400">{doc.description || 'Member resource'}</p>
            {doc.file_url && <Link href={doc.file_url} className="mt-4 inline-block text-sm text-red-400 hover:text-red-300">Open file</Link>}
          </Card>
        )) : <Card><div className="text-sm text-zinc-300">No documents found. Connect the member-docs bucket next.</div></Card>}
      </div>
    </Section>
  );
}

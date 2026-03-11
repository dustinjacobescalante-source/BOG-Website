import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: threads } = await supabase
    .from('discussion_threads')
    .select('id, title, category, created_at, discussion_posts(count)')
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(20);

  return (
    <Section label="Portal" title="Private Discussion Board" description="Leadership topics, scholarship updates, merch interest, and brotherhood support.">
      <div className="space-y-3">
        {threads?.length ? threads.map((thread) => (
          <Card key={thread.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-white">{thread.title}</div>
                <div className="text-sm text-zinc-500">{new Date(thread.created_at).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="rounded-full bg-red-600/15 px-3 py-1 text-xs font-bold text-red-400">{thread.category}</div>
                <div className="mt-2 text-xs text-zinc-500">{Array.isArray(thread.discussion_posts) ? thread.discussion_posts[0]?.count ?? 0 : 0} replies</div>
              </div>
            </div>
          </Card>
        )) : <Card><div className="text-sm text-zinc-300">No discussion threads yet.</div></Card>}
      </div>
    </Section>
  );
}

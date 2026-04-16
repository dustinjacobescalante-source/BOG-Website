import { Section } from '@/components/section';
import { createClient } from '@/lib/supabase/server';
import DiscussionsBoard from '@/components/discussions/DiscussionsBoard';

type ThreadRow = {
  id: string;
  title: string;
  category: string | null;
  created_at: string;
  is_pinned?: boolean | null;
  profiles?: {
    full_name?: string | null;
  } | null;
  discussion_posts?: { count?: number }[] | null;
};

export default async function Page() {
  const supabase = await createClient();

  const { data: threads } = await supabase
    .from('discussion_threads')
    .select(`
      id,
      title,
      category,
      created_at,
      is_pinned,
      profiles:created_by (
        full_name
      ),
      discussion_posts(count)
    `)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(20);

  const mappedThreads =
    (threads as ThreadRow[] | null)?.map((thread) => ({
      id: thread.id,
      title: thread.title,
      category: thread.category,
      created_at: thread.created_at,
      is_pinned: thread.is_pinned ?? false,
      author_name: thread.profiles?.full_name || 'Member',
      reply_count: Array.isArray(thread.discussion_posts)
        ? thread.discussion_posts[0]?.count ?? 0
        : 0,
    })) ?? [];

  return (
    <Section
      label="Portal"
      title="Private Discussion Board"
      description="Leadership topics, scholarship updates, merch interest, and brotherhood support."
    >
      <DiscussionsBoard threads={mappedThreads} />
    </Section>
  );
}
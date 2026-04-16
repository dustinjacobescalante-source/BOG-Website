import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import ReplyForm from '@/components/discussions/ReplyForm';
import CollapsibleEditPost from '@/components/discussions/CollapsibleEditPost';
import CollapsibleEditThread from '@/components/discussions/CollapsibleEditThread';
import Reactions from '@/components/discussions/Reactions';

type ThreadPageProps = {
  params: Promise<{ id: string }>;
};

type ProfileItem = {
  full_name?: string | null;
};

type ThreadRow = {
  id: string;
  title: string;
  category: string | null;
  created_at: string;
  is_pinned?: boolean | null;
  created_by?: string | null;
  profiles?: ProfileItem[] | ProfileItem | null;
};

type PostRow = {
  id: string;
  body: string;
  created_at: string;
  user_id?: string | null;
  profiles?: ProfileItem[] | ProfileItem | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getInitials(name?: string | null) {
  return (
    name
      ?.split(' ')
      .map((part: string) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'BD'
  );
}

function getProfileName(profile?: ProfileItem[] | ProfileItem | null) {
  if (Array.isArray(profile)) {
    return profile[0]?.full_name || null;
  }

  return profile?.full_name || null;
}

export default async function DiscussionThreadPage({
  params,
}: ThreadPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUserId = user?.id ?? null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', currentUserId)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin';

  const { data: thread } = await supabase
    .from('discussion_threads')
    .select(`
      id,
      title,
      category,
      created_at,
      is_pinned,
      created_by,
      profiles:created_by (
        full_name
      )
    `)
    .eq('id', id)
    .maybeSingle();

  const typedThread = thread as ThreadRow | null;

  if (!typedThread) {
    notFound();
  }

  const { data: posts } = await supabase
    .from('discussion_posts')
    .select(`
      id,
      body,
      created_at,
      user_id,
      profiles:user_id (
        full_name
      )
    `)
    .eq('thread_id', id)
    .order('created_at', { ascending: true });

  const typedPosts = (posts as PostRow[] | null) ?? [];

  const threadAuthor = getProfileName(typedThread.profiles) || 'Brother';
  const canManageThread = isAdmin || typedThread.created_by === currentUserId;

  const originalPost = typedPosts[0] ?? null;
  const replies = typedPosts.slice(1);

  return (
    <Section
      label="Portal"
      title="Discussion Thread"
      description="Brotherhood conversation"
    >
      <div className="space-y-6">
        <Link
          href="/portal/discussions"
          className="inline-flex items-center rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-red-500/30 hover:bg-black/40 hover:text-white"
        >
          ← Back to Discussions
        </Link>

        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-2xl font-bold tracking-tight text-white">
                {typedThread.title}
              </div>

              {typedThread.is_pinned ? (
                <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-yellow-300">
                  Pinned
                </span>
              ) : (
                <span className="rounded-full bg-red-600/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-400">
                  Open
                </span>
              )}

              {typedThread.category ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-300">
                  {typedThread.category}
                </span>
              ) : null}
            </div>

            <div className="text-sm text-zinc-300">
              Original thread created by {threadAuthor}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-800 to-black text-sm font-bold text-white">
                {getInitials(threadAuthor)}
              </div>

              <div>
                <div className="text-sm font-medium text-white">
                  {threadAuthor}
                </div>
                <div className="text-xs text-zinc-500">
                  {formatDate(typedThread.created_at)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {canManageThread ? (
                <CollapsibleEditThread
                  threadId={typedThread.id}
                  initialTitle={typedThread.title}
                />
              ) : null}

              {canManageThread ? (
                <form action={`/api/discussions/thread/${id}`} method="POST">
                  <button
                    type="submit"
                    className="rounded-2xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10"
                  >
                    Delete Thread
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>

        {originalPost ? (
          <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:border-white/15 hover:bg-black/35">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-800 to-black text-sm font-bold text-white">
                {getInitials(getProfileName(originalPost.profiles) || 'Brother')}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-white">
                      {getProfileName(originalPost.profiles) || 'Brother'}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {formatDate(originalPost.created_at)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-300">
                      Original Post
                    </span>

                    {isAdmin || originalPost.user_id === currentUserId ? (
                      <form
                        action={`/api/discussions/post/${originalPost.id}`}
                        method="POST"
                      >
                        <button
                          type="submit"
                          className="rounded-lg border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
                  {originalPost.body}
                </div>

                <div className="pt-2">
                  <Reactions postId={originalPost.id} />
                </div>

                {isAdmin || originalPost.user_id === currentUserId ? (
                  <CollapsibleEditPost
                    postId={originalPost.id}
                    initialBody={originalPost.body}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_rgba(0,0,0,0.28)]">
          <div className="mb-4">
            <div className="text-2xl font-bold text-white">
              Join the Conversation
            </div>
            <div className="text-sm text-zinc-400">
              Add your perspective to the discussion.
            </div>
          </div>

          <ReplyForm threadId={id} />
        </div>

        <div className="space-y-4">
          {replies.length ? (
            replies.map((post) => {
              const postAuthor = getProfileName(post.profiles) || 'Brother';
              const canManagePost = isAdmin || post.user_id === currentUserId;

              return (
                <div
                  key={post.id}
                  className="rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_rgba(0,0,0,0.28)] transition duration-300 hover:border-white/15 hover:bg-black/35"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-800 to-black text-sm font-bold text-white">
                      {getInitials(postAuthor)}
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-semibold text-white">
                            {postAuthor}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {formatDate(post.created_at)}
                          </div>
                        </div>

                        {canManagePost ? (
                          <form
                            action={`/api/discussions/post/${post.id}`}
                            method="POST"
                          >
                            <button
                              type="submit"
                              className="rounded-lg border border-red-500/40 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </form>
                        ) : null}
                      </div>

                      <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
                        {post.body}
                      </div>

                      <div className="pt-2">
                        <Reactions postId={post.id} />
                      </div>

                      {canManagePost ? (
                        <CollapsibleEditPost
                          postId={post.id}
                          initialBody={post.body}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Card>
              <div className="text-sm text-zinc-300">
                No replies yet. Be the first to add perspective.
              </div>
            </Card>
          )}
        </div>
      </div>
    </Section>
  );
}

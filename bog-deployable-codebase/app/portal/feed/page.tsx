import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  Camera,
  Film,
  ImageIcon,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";
import MemberFeedUploader from "@/components/feed/MemberFeedUploader";

type FeedPost = {
  id: string;
  user_id: string;
  caption: string | null;
  media_url: string;
  media_path: string;
  media_type: "image" | "video";
  created_at: string;
};

function formatDate(value?: string | null) {
  if (!value) return "Unknown";

  return new Date(value).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name?: string | null) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "BD"
  );
}

async function deleteFeedPost(postId: string, mediaPath: string) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active) {
    redirect("/pending");
  }

  const { data: post } = await supabase
    .from("member_feed_posts")
    .select("id, user_id, media_path")
    .eq("id", postId)
    .single();

  if (!post) return;

  const isOwner = post.user_id === user.id;
  const isAdmin = profile.role === "admin";

  if (!isOwner && !isAdmin) return;

  const { error: deletePostError } = await supabase
    .from("member_feed_posts")
    .delete()
    .eq("id", postId);

  if (deletePostError) {
    console.error("member feed delete post error:", deletePostError);
    return;
  }

  const pathToRemove = post.media_path || mediaPath;

  if (pathToRemove) {
    const { error: storageError } = await supabase.storage
      .from("member-feed")
      .remove([pathToRemove]);

    if (storageError) {
      console.error("member feed storage delete error:", storageError);
    }
  }

  revalidatePath("/portal/feed");
}

export default async function MemberFeedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role, is_active, full_name")
    .eq("id", user.id)
    .single();

  if (!currentProfile?.is_active) {
    redirect("/pending");
  }

  const isAdmin = currentProfile.role === "admin";

  const { data: posts } = await supabase
    .from("member_feed_posts")
    .select("id, user_id, caption, media_url, media_path, media_type, created_at")
    .order("created_at", { ascending: false });

  const feedPosts = (posts ?? []) as FeedPost[];

  const profileIds = Array.from(new Set(feedPosts.map((post) => post.user_id)));

  const { data: postProfiles } = profileIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("id", profileIds)
    : { data: [] };

  const profileMap = new Map(
    (postProfiles ?? []).map((profile) => [profile.id, profile])
  );

  const postsWithSignedUrls = await Promise.all(
    feedPosts.map(async (post) => {
      const { data } = await supabase.storage
        .from("member-feed")
        .createSignedUrl(post.media_path, 60 * 60);

      return {
        ...post,
        signedUrl: data?.signedUrl ?? "",
        profile: profileMap.get(post.user_id),
      };
    })
  );

  return (
    <div className="w-full space-y-6">
      <AdminHero
        eyebrow="Member Portal"
        title="Brotherhood Feed"
        description="Post photos and videos that build momentum, accountability, and brotherhood. No likes. No noise. Just proof of action."
        actions={[
          { href: "/portal", label: "Back to Dashboard" },
          { href: "/portal/discussions", label: "Open Discussions" },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminSection
          eyebrow="Post Proof"
          title="Share an Update"
          description="Post a photo or video that motivates the men around you. Training, discipline, service, faith, family leadership, or accountability work."
        >
          <MemberFeedUploader userId={user.id} />
        </AdminSection>

        <div className="rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_34%),linear-gradient(180deg,rgba(15,18,28,0.96),rgba(8,10,18,0.98))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
            <Camera className="h-3.5 w-3.5" />
            Feed Standard
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Post action.
            <br />
            Build momentum.
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-300">
            This feed is not for attention. It is for accountability. Post the
            work. Encourage the room. Show the standard.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <ImageIcon className="h-5 w-5 text-red-300" />
              <div className="mt-3 text-sm font-semibold text-white">
                Photos
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Workouts, meals, books, service, family leadership, or daily
                discipline.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <Film className="h-5 w-5 text-red-300" />
              <div className="mt-3 text-sm font-semibold text-white">
                Videos
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Training clips, encouragement, progress updates, or action
                moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdminSection
        eyebrow="Live Brotherhood Feed"
        title="Latest Posts"
        description="A clean feed of member photos and videos. No comments. No likes. Just accountability."
      >
        {postsWithSignedUrls.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-black/25 p-8 text-center">
            <Camera className="mx-auto h-8 w-8 text-zinc-500" />
            <h3 className="mt-4 text-xl font-bold text-white">No posts yet.</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Be the first to post proof of action.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {postsWithSignedUrls.map((post) => {
              const authorName = post.profile?.full_name || "BOG Member";
              const authorRole = post.profile?.role || "member";
              const canDelete = isAdmin || post.user_id === user.id;

              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,28,0.96),rgba(8,10,18,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.32)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-xs font-black text-white">
                        {getInitials(authorName)}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {authorName}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          {authorRole}
                          {authorRole === "admin" ? (
                            <ShieldCheck className="h-3 w-3 text-red-300" />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {canDelete ? (
                      <form
                        action={deleteFeedPost.bind(
                          null,
                          post.id,
                          post.media_path
                        )}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/15"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </form>
                    ) : null}
                  </div>

                  <div className="bg-black">
                    {post.media_type === "image" ? (
                      <img
                        src={post.signedUrl}
                        alt={post.caption || "Member feed post"}
                        className="max-h-[520px] w-full bg-black object-contain"
                      />
                    ) : (
                      <video
                        src={post.signedUrl}
                        controls
                        playsInline
                        className="max-h-[520px] w-full bg-black object-contain"
                      />
                    )}
                  </div>

                  <div className="space-y-3 px-4 py-4">
                    {post.caption ? (
                      <p className="text-sm leading-6 text-zinc-300">
                        {post.caption}
                      </p>
                    ) : (
                      <p className="text-sm italic text-zinc-500">
                        No caption added.
                      </p>
                    )}

                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      Posted {formatDate(post.created_at)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AdminSection>
    </div>
  );
}

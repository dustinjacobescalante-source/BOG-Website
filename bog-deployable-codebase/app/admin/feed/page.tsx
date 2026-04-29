import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  Camera,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  ImageIcon,
  Film,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import AdminPageShell from "@/components/admin/AdminPageShell";
import AdminHero from "@/components/admin/AdminHero";
import AdminSection from "@/components/admin/AdminSection";

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

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: post } = await supabase
    .from("member_feed_posts")
    .select("id, media_path")
    .eq("id", postId)
    .single();

  if (!post) return;

  const { error: deletePostError } = await supabase
    .from("member_feed_posts")
    .delete()
    .eq("id", postId);

  if (deletePostError) {
    console.error("admin feed delete post error:", deletePostError);
    return;
  }

  const pathToRemove = post.media_path || mediaPath;

  if (pathToRemove) {
    const { error: storageError } = await supabase.storage
      .from("member-feed")
      .remove([pathToRemove]);

    if (storageError) {
      console.error("admin feed storage delete error:", storageError);
    }
  }

  revalidatePath("/admin/feed");
  revalidatePath("/portal/feed");
}

export default async function AdminFeedPage() {
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

  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/portal");
  }

  const { data: posts } = await supabase
    .from("member_feed_posts")
    .select("id, user_id, caption, media_url, media_path, media_type, created_at")
    .order("created_at", { ascending: false });

  const feedPosts = (posts ?? []) as FeedPost[];
  const imageCount = feedPosts.filter((post) => post.media_type === "image").length;
  const videoCount = feedPosts.filter((post) => post.media_type === "video").length;

  const profileIds = Array.from(new Set(feedPosts.map((post) => post.user_id)));

  const { data: postProfiles } = profileIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .in("id", profileIds)
    : { data: [] };

  const profileMap = new Map(
    (postProfiles ?? []).map((postProfile) => [postProfile.id, postProfile])
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
    <AdminPageShell>
      <AdminHero
        eyebrow="BOG Admin Command"
        title="Brotherhood Feed Control"
        description="Review member feed posts, monitor media activity, and remove anything that does not meet the standard."
        actions={[
          { href: "/admin", label: "Back to Dashboard" },
          { href: "/portal/feed", label: "View Member Feed" },
        ]}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Total Posts
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {feedPosts.length}
              </div>
            </div>
            <Camera className="h-5 w-5 text-slate-300" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            All member feed posts currently stored.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Photos
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {imageCount}
              </div>
            </div>
            <ImageIcon className="h-5 w-5 text-slate-300" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Image posts in the Brotherhood Feed.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[rgba(15,18,28,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Videos
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {videoCount}
              </div>
            </div>
            <Film className="h-5 w-5 text-slate-300" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Video posts in the Brotherhood Feed.
          </p>
        </div>
      </section>

      <AdminSection
        eyebrow="Feed Moderation"
        title="Manage Brotherhood Feed"
        description="Remove posts when needed. This action deletes the database record and removes the uploaded media from storage."
      >
        {postsWithSignedUrls.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-black/25 p-8 text-center">
            <Camera className="mx-auto h-8 w-8 text-zinc-500" />
            <h3 className="mt-4 text-xl font-bold text-white">
              No feed posts yet.
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Member posts will appear here once the feed is used.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {postsWithSignedUrls.map((post) => {
              const authorName = post.profile?.full_name || "BOG Member";
              const authorEmail = post.profile?.email || "No email listed";
              const authorRole = post.profile?.role || "member";

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
                        <div className="mt-0.5 truncate text-xs text-zinc-500">
                          {authorEmail}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          {authorRole}
                          {authorRole === "admin" ? (
                            <ShieldCheck className="h-3 w-3 text-red-300" />
                          ) : null}
                        </div>
                      </div>
                    </div>
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

                    <form
                      action={deleteFeedPost.bind(
                        null,
                        post.id,
                        post.media_path
                      )}
                    >
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Post
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AdminSection>

      <div className="flex justify-start">
        <a
          href="/admin"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Admin Dashboard
        </a>
      </div>
    </AdminPageShell>
  );
}

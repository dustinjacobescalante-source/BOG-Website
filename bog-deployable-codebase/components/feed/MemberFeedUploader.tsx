"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  Link as LinkIcon,
  Video,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE_MB = 1000;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const LARGE_FILE_WARNING_MB = 150;
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

type PostMode = "upload" | "link";

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

function getFileSizeMb(file: File) {
  return file.size / 1024 / 1024;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(
        new Error(
          "Upload timed out. On mobile, try a shorter video, use Wi-Fi, keep the screen awake, or upload from desktop."
        )
      );
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

function getLinkProvider(url: string) {
  const lower = url.toLowerCase();

  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return "youtube";
  }

  if (lower.includes("facebook.com") || lower.includes("fb.watch")) {
    return "facebook";
  }

  return "link";
}

export default function MemberFeedUploader({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [postMode, setPostMode] = useState<PostMode>("upload");
  const [caption, setCaption] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function resetMessages() {
    setStatusMessage(null);
    setErrorMessage(null);
    setFileWarning(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    resetMessages();

    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setFile(null);
      setErrorMessage("Please select a photo or video file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setFile(null);
      setErrorMessage(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const sizeMb = getFileSizeMb(selectedFile);

    if (isVideo && sizeMb >= LARGE_FILE_WARNING_MB) {
      setFileWarning(
        "Large phone videos can take several minutes. Use Wi-Fi, keep this page open, and do not lock your screen during upload."
      );
    }

    setFile(selectedFile);
  }

  async function notifyMembers() {
    const notifyResponse = await fetch("/api/member-feed/notify", {
  method: "POST",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    caption: caption.trim(),
  }),
});

if (!notifyResponse.ok) {
  const text = await notifyResponse.text();
  console.error("Feed notify failed:", notifyResponse.status, text);
} else {
  console.log("Feed notify success");
}
  
  async function handleLinkPost(userIdValue: string) {
    const cleanUrl = linkUrl.trim();

    if (!cleanUrl) {
      throw new Error("Please paste a YouTube, Facebook, or video link.");
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(cleanUrl);
    } catch {
      throw new Error("Please enter a valid link starting with https://");
    }

    const provider = getLinkProvider(parsedUrl.toString());
    const embedUrl = getYouTubeEmbedUrl(parsedUrl.toString());

    setStatusMessage("Saving shared video link...");

    const { error } = await supabase.from("member_feed_posts").insert({
      user_id: userIdValue,
      caption: caption.trim() || null,
      media_url: null,
      media_path: null,
      media_type: null,
      link_url: parsedUrl.toString(),
      link_provider: provider,
      link_embed_url: embedUrl,
    });

    if (error) {
      throw error;
    }

    setStatusMessage("Link saved. Notifying members...");
    await notifyMembers();

    setCaption("");
    setLinkUrl("");
    setStatusMessage("Link posted successfully.");
  }

  async function handleMediaUpload(userIdValue: string) {
    if (!file) {
      throw new Error("Please choose a photo or video first.");
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      throw new Error("Only photos and videos can be uploaded.");
    }

    const mediaType = isImage ? "image" : "video";
    const safeFileName = sanitizeFileName(file.name);
    const filePath = `${userIdValue}/${Date.now()}-${safeFileName}`;
    const sizeMb = getFileSizeMb(file);

    setStatusMessage(
      isVideo
        ? `Uploading video (${sizeMb.toFixed(
            1
          )}MB). This may take several minutes on mobile...`
        : `Uploading photo (${sizeMb.toFixed(1)}MB)...`
    );

    const uploadResult = await withTimeout(
      supabase.storage.from("member-feed").upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      }),
      UPLOAD_TIMEOUT_MS
    );

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    setStatusMessage("Upload complete. Saving post...");

    const { error: insertError } = await supabase
      .from("member_feed_posts")
      .insert({
        user_id: userIdValue,
        caption: caption.trim() || null,
        media_url: filePath,
        media_path: filePath,
        media_type: mediaType,
        link_url: null,
        link_provider: null,
        link_embed_url: null,
      });

    if (insertError) {
      await supabase.storage.from("member-feed").remove([filePath]);
      throw insertError;
    }

    setStatusMessage("Post saved. Notifying members...");
    await notifyMembers();

    setCaption("");
    setFile(null);
    setFileWarning(null);
    setStatusMessage("Post uploaded successfully.");

    const fileInput = document.getElementById(
      "member-feed-media"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatusMessage(null);
    setErrorMessage(null);

    try {
      setIsUploading(true);
      setStatusMessage("Preparing post...");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be signed in to post.");
      }

      if (postMode === "link") {
        await handleLinkPost(user.id);
      } else {
        await handleMediaUpload(user.id);
      }

      router.refresh();
    } catch (error) {
      console.error("Member feed post failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Post failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }

  const canSubmit =
    !isUploading &&
    (postMode === "link" ? linkUrl.trim().length > 0 : Boolean(file));

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,18,28,0.96),rgba(8,10,18,0.98))] p-5">
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/25 p-1">
          <button
            type="button"
            onClick={() => {
              resetMessages();
              setPostMode("upload");
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              postMode === "upload"
                ? "bg-red-600 text-white"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>

          <button
            type="button"
            onClick={() => {
              resetMessages();
              setPostMode("link");
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              postMode === "link"
                ? "bg-red-600 text-white"
                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            Share Link
          </button>
        </div>

        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Caption
        </label>

        <textarea
          name="caption"
          rows={4}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="What are you posting? What standard are you keeping?"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20"
        />

        {postMode === "upload" ? (
          <>
            <label className="mb-2 mt-5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Photo or Video
            </label>

            <input
              id="member-feed-media"
              name="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/20 disabled:opacity-60"
            />

            {file ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-zinc-300">
                Selected:{" "}
                <span className="font-semibold text-white">{file.name}</span>
                <br />
                Size: {getFileSizeMb(file).toFixed(1)}MB
              </div>
            ) : null}

            {fileWarning ? (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{fileWarning}</span>
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-zinc-400">
              Max file size: {MAX_FILE_SIZE_MB}MB. For mobile videos, use
              Wi-Fi, keep the screen awake, and stay on this page until the
              upload finishes.
            </div>
          </>
        ) : (
          <>
            <label className="mb-2 mt-5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              YouTube or Facebook Video Link
            </label>

            <div className="relative">
              <Video className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="url"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://facebook.com/..."
                disabled={isUploading}
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 disabled:opacity-60"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-zinc-400">
              YouTube links will embed when possible. Facebook links may open as
              a clickable card depending on Facebook privacy settings.
            </div>
          </>
        )}

        {statusMessage ? (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {postMode === "link" ? (
            <LinkIcon className="h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading
            ? postMode === "link"
              ? "Posting Link..."
              : "Uploading..."
            : postMode === "link"
            ? "Post Link"
            : "Post to Feed"}
        </button>
      </div>
    </form>
  );
}
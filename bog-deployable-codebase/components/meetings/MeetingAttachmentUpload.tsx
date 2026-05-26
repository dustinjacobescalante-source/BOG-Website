"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Attachment = {
  id: string;
  file_name: string;
  file_path: string;
  created_at?: string | null;
  signedUrl?: string;
};

export default function MeetingAttachmentUpload({
  meetingId,
}: {
  meetingId: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  async function loadAttachments() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("meeting_attachments")
      .select("id, file_name, file_path, created_at")
      .eq("meeting_id", meetingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadAttachments error:", error);
      setMessage(`Could not load attachments: ${error.message}`);
      return;
    }

    const rows = (data ?? []) as Attachment[];

    const withSignedUrls = await Promise.all(
      rows.map(async (attachment) => {
        if (!attachment.file_path) {
          return {
            ...attachment,
            signedUrl: "",
          };
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from("meeting-attachments")
          .createSignedUrl(attachment.file_path, 60 * 60);

        if (signedError) {
          console.error("createSignedUrl error:", signedError);
          return {
            ...attachment,
            signedUrl: "",
          };
        }

        return {
          ...attachment,
          signedUrl: signedData?.signedUrl ?? "",
        };
      })
    );

    setAttachments(withSignedUrls);
  }

  useEffect(() => {
    loadAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/meetings/${meetingId}/attachments`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(`Upload failed: ${result.error || "Unknown error"}`);
        return;
      }

      setMessage("Attachment uploaded successfully.");
      await loadAttachments();
      event.target.value = "";
    } catch (error) {
      console.error("Meeting attachment upload failed:", error);
      setMessage("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <label className="mb-3 block text-sm font-medium text-white">
        Attachments
      </label>

      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-white"
      />

      {uploading ? (
        <p className="mt-2 text-sm text-zinc-400">Uploading...</p>
      ) : null}

      {message ? <p className="mt-2 text-sm text-zinc-300">{message}</p> : null}

      <div className="mt-4 space-y-2">
        {attachments.map((attachment) =>
          attachment.signedUrl ? (
            <a
              key={attachment.id}
              href={attachment.signedUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
            >
              {attachment.file_name}
            </a>
          ) : (
            <div
              key={attachment.id}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-400"
            >
              {attachment.file_name} — link unavailable
            </div>
          )
        )}

        {!attachments.length ? (
          <p className="text-sm text-zinc-500">No attachments uploaded yet.</p>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function TestAttachmentUpload({
  meetingId,
}: {
  meetingId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) {
      setMessage("Please choose a file first.");
      return;
    }

    try {
      setMessage("Uploading...");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/meetings/${meetingId}/attachments`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Upload failed.");
        return;
      }

      setMessage("Upload successful.");
      console.log("Upload response:", data);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-300 p-4 space-y-3">
      <h2 className="text-lg font-semibold">Test Attachment Upload</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        type="button"
        onClick={handleUpload}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Upload Test File
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}

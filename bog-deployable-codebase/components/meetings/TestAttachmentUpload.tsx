'use client';

import { useState, useCallback } from 'react';

export default function TestAttachmentUpload({ meetingId }: { meetingId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setMessage('');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('meetingId', meetingId);

    try {
      const res = await fetch(`/api/meetings/${meetingId}/attachments/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setMessage('Upload successful ✅');
      setFile(null);
      window.location.reload();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pt-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Upload Attachment
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-6 text-center hover:border-white/40"
      >
        {file ? (
          <p className="text-sm text-zinc-200">{file.name}</p>
        ) : (
          <p className="text-sm text-zinc-500">
            Drag & drop a file here or click below
          </p>
        )}

        <input
          type="file"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          className="mt-3 text-sm"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {/* Message */}
      {message && (
        <p className="mt-2 text-xs text-zinc-400">{message}</p>
      )}
    </div>
  );
}

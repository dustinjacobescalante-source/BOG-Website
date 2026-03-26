'use client';

import { useCallback, useState } from 'react';

export default function TestAttachmentUpload({
  meetingId,
}: {
  meetingId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFile = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setMessage('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please choose a file first.');
      return;
    }

    try {
      setUploading(true);
      setMessage('');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/meetings/${meetingId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Upload route returned an invalid response.');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed.');
      }

      setMessage('Upload successful.');
      setFile(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pt-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Upload Attachment
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-6 text-center hover:border-white/40"
      >
        {file ? (
          <p className="text-sm font-medium text-zinc-200">{file.name}</p>
        ) : (
          <p className="text-sm text-zinc-500">
            Drag and drop a file here or choose one below
          </p>
        )}

        <input
          type="file"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              handleFile(selectedFile);
            }
          }}
          className="mt-3 text-sm text-zinc-300"
        />
      </div>

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {message && <p className="mt-2 text-xs text-zinc-400">{message}</p>}
    </div>
  );
}

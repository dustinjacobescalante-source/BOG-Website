'use client';

import { useCallback, useMemo, useState } from 'react';

type SelectedFile = {
  id: string;
  file: File;
};

export default function TestAttachmentUpload({
  meetingId,
}: {
  meetingId: string;
}) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadResults, setUploadResults] = useState<string[]>([]);

  const hasFiles = selectedFiles.length > 0;

  const totalSizeText = useMemo(() => {
    const totalBytes = selectedFiles.reduce((sum, item) => sum + item.file.size, 0);
    const mb = totalBytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB total`;
  }, [selectedFiles]);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
    }));

    setSelectedFiles((prev) => {
      const existingKeys = new Set(
        prev.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`)
      );

      const dedupedIncoming = incoming.filter(
        (item) =>
          !existingKeys.has(
            `${item.file.name}-${item.file.size}-${item.file.lastModified}`
          )
      );

      return [...prev, ...dedupedIncoming];
    });

    setMessage('');
    setUploadResults([]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setUploadResults([]);
    setMessage('');
  }, []);

  const handleUpload = async () => {
    if (!hasFiles) {
      setMessage('Please choose at least one file first.');
      return;
    }

    try {
      setUploading(true);
      setMessage('');
      setUploadResults([]);

      const results: string[] = [];

      for (const item of selectedFiles) {
        const formData = new FormData();
        formData.append('file', item.file);

        const res = await fetch(`/api/meetings/${meetingId}/attachments`, {
          method: 'POST',
          body: formData,
        });

        const contentType = res.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Non-JSON response:', text);
          results.push(`❌ ${item.file.name}: invalid server response`);
          continue;
        }

        const data = await res.json();

        if (!res.ok) {
          results.push(`❌ ${item.file.name}: ${data.error || 'Upload failed.'}`);
          continue;
        }

        results.push(`✅ ${item.file.name}: uploaded`);
      }

      setUploadResults(results);

      const successCount = results.filter((line) => line.startsWith('✅')).length;
      const failCount = results.filter((line) => line.startsWith('❌')).length;

      if (successCount > 0 && failCount === 0) {
        setMessage(`All ${successCount} file(s) uploaded successfully.`);
        setSelectedFiles([]);
        window.location.reload();
        return;
      }

      if (successCount > 0 && failCount > 0) {
        setMessage(`${successCount} uploaded, ${failCount} failed.`);
        return;
      }

      setMessage('No files were uploaded.');
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
        Upload Attachments
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-3 rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-6 text-center hover:border-white/40"
      >
        <p className="text-sm text-zinc-300">
          Drag and drop files here or choose files below
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Use smaller files for now. Large files may fail.
        </p>

        <input
          type="file"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="mt-4 text-sm text-zinc-300"
        />
      </div>

      {hasFiles && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-zinc-200">
                {selectedFiles.length} file(s) selected
              </div>
              <div className="text-xs text-zinc-500">{totalSizeText}</div>
            </div>

            <button
              type="button"
              onClick={clearFiles}
              disabled={uploading}
              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:bg-white/5 disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-zinc-200">
                    {item.file.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  disabled={uploading}
                  className="ml-3 rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!hasFiles || uploading}
        className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>

      {message && <p className="mt-3 text-sm text-zinc-300">{message}</p>}

      {uploadResults.length > 0 && (
        <div className="mt-3 space-y-1 rounded-xl border border-white/10 bg-black/20 p-3">
          {uploadResults.map((result, index) => (
            <p key={index} className="text-xs text-zinc-400">
              {result}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

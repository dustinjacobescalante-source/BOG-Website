'use client';

import { useCallback, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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

  const supabase = createClient();

  const hasFiles = selectedFiles.length > 0;

  const totalSizeText = useMemo(() => {
    const totalBytes = selectedFiles.reduce((sum, item) => sum + item.file.size, 0);
    const mb = totalBytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB total`;
  }, [selectedFiles]);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
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

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setUploadResults([]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!hasFiles) return;

    setUploading(true);
    setMessage('');
    setUploadResults([]);

    const results: string[] = [];

    for (const item of selectedFiles) {
      try {
        const filePath = `${meetingId}/${Date.now()}-${item.file.name}`;

        // ✅ DIRECT UPLOAD TO SUPABASE
        const { error: uploadError } = await supabase.storage
          .from('meeting-attachments')
          .upload(filePath, item.file);

        if (uploadError) {
          results.push(`❌ ${item.file.name}: ${uploadError.message}`);
          continue;
        }

        // ✅ SAVE TO DATABASE
        const { error: dbError } = await supabase
          .from('meeting_attachments')
          .insert({
            meeting_id: meetingId,
            file_name: item.file.name,
            file_path: filePath,
          });

        if (dbError) {
          results.push(`❌ ${item.file.name}: DB error`);
          continue;
        }

        results.push(`✅ ${item.file.name}`);
      } catch (err) {
        results.push(`❌ ${item.file.name}: unexpected error`);
      }
    }

    setUploadResults(results);

    const successCount = results.filter((r) => r.startsWith('✅')).length;

    if (successCount > 0) {
      setMessage(`${successCount} file(s) uploaded successfully`);
      setSelectedFiles([]);
      window.location.reload();
    } else {
      setMessage('Upload failed');
    }

    setUploading(false);
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
          Drag files here or select below
        </p>

        <input
          type="file"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="mt-3 text-sm text-white"
        />
      </div>

      {hasFiles && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-zinc-300">
            {selectedFiles.length} file(s) • {totalSizeText}
          </div>

          {selectedFiles.map((item) => (
            <div
              key={item.id}
              className="flex justify-between rounded-xl border border-white/10 px-3 py-2"
            >
              <span className="text-sm text-zinc-200">{item.file.name}</span>
              <button
                onClick={() => removeFile(item.id)}
                className="text-xs text-red-400"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={clearFiles}
            className="text-xs text-zinc-400"
          >
            Clear All
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!hasFiles || uploading}
        className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>

      {message && <p className="mt-2 text-sm text-zinc-300">{message}</p>}

      {uploadResults.length > 0 && (
        <div className="mt-2 text-xs text-zinc-400">
          {uploadResults.map((r, i) => (
            <div key={i}>{r}</div>
          ))}
        </div>
      )}
    </div>
  );
}

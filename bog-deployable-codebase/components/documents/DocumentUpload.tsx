'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function DocumentUpload() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setMessage('Please choose a file.');
      setMessageType('error');
      return;
    }

    try {
      setUploading(true);

      const filePath = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        setMessage(uploadError.message);
        setMessageType('error');
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const finalTitle = title.trim() || file.name;

      const { error: insertError } = await supabase.from('documents').insert({
        title: finalTitle,
        category: 'other',
        description,
        file_url: publicUrlData.publicUrl,
        file_path: filePath,
        uploaded_by: user?.id ?? null,
      });

      if (insertError) {
        setMessage(insertError.message);
        setMessageType('error');
        return;
      }

      await fetch('/api/documents/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: finalTitle,
        }),
      });

      setTitle('');
      setDescription('');
      setFile(null);

      setMessage('Upload complete.');
      setMessageType('success');

      setTimeout(() => router.refresh(), 300);
    } catch {
      setMessage('Upload failed.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,14,24,0.96),rgba(6,8,14,1))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.12),transparent_30%)]" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          <Upload className="h-3.5 w-3.5" />
          Upload Document
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-red-500/40"
            />
          </div>

          <label className="group relative block cursor-pointer rounded-2xl border border-dashed border-white/20 bg-black/30 px-6 py-14 text-center text-sm text-zinc-400 transition-all duration-300 hover:border-red-500/50 hover:bg-black/40">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) setFile(droppedFile);
              }}
              className="flex flex-col items-center justify-center gap-4"
            >
              {file ? (
                <div className="flex items-center gap-2 text-base font-semibold text-white">
                  <FileUp className="h-5 w-5 text-red-400" />
                  {file.name}
                </div>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 transition group-hover:scale-110">
                    <Upload className="h-6 w-6 text-red-400" />
                  </div>

                  <div className="text-base font-semibold text-white">
                    Drag & drop your file here
                  </div>

                  <div className="text-xs text-zinc-500">
                    or{' '}
                    <span className="font-semibold text-red-400">
                      click to upload
                    </span>
                  </div>
                </>
              )}
            </div>
          </label>

          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading…' : 'Upload Document'}
            </button>

            {message && (
              <div
                className={`text-sm ${
                  messageType === 'success'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
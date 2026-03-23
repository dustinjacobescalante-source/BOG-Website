'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Attachment = {
  id: string;
  file_name: string;
  file_url: string;
};

export default function MeetingAttachmentUpload({
  meetingId,
}: {
  meetingId: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  async function loadAttachments() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('meeting_attachments')
      .select('id, file_name, file_url')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('loadAttachments error:', error);
      return;
    }

    setAttachments(data ?? []);
  }

  useEffect(() => {
    loadAttachments();
  }, [meetingId]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const supabase = createClient();
      const filePath = `${meetingId}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from('meeting-files')
        .upload(filePath, file);

      if (error) {
        setMessage(`Upload failed: ${error.message}`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('meeting-files')
        .getPublicUrl(filePath);

      const fileUrl = data.publicUrl;

      const insertResult = await supabase.from('meeting_attachments').insert({
        meeting_id: meetingId,
        file_name: file.name,
        file_url: fileUrl,
      });

      if (insertResult.error) {
        setMessage(`Saved file, but DB insert failed: ${insertResult.error.message}`);
        setUploading(false);
        return;
      }

      setMessage('Attachment uploaded successfully.');
      await loadAttachments();
      event.target.value = '';
    } catch (error) {
      setMessage('Something went wrong during upload.');
      console.error(error);
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

      {uploading && (
        <p className="mt-2 text-sm text-zinc-400">Uploading...</p>
      )}

      {message && (
        <p className="mt-2 text-sm text-zinc-300">{message}</p>
      )}

      <div className="mt-4 space-y-2">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.file_url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
          >
            {attachment.file_name}
          </a>
        ))}

        {!attachments.length && (
          <p className="text-sm text-zinc-500">No attachments uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

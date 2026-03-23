'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MeetingAttachmentUpload({
  meetingId,
}: {
  meetingId: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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
    } catch (error) {
      setMessage('Something went wrong during upload.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        Upload Attachment
      </label>

      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="w-full text-sm text-white"
      />

      {uploading && (
        <p className="mt-2 text-sm text-zinc-400">Uploading...</p>
      )}

      {message && (
        <p className="mt-2 text-sm text-zinc-300">{message}</p>
      )}
    </div>
  );
}

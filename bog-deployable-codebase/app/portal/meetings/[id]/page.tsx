'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/client';
import MeetingComments from '@/components/meetings/MeetingComments';
import TestAttachmentUpload from '@/components/meetings/TestAttachmentUpload';

function getFileType(fileName: string) {
  const lower = fileName.toLowerCase();

  if (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.webp')
  ) {
    return 'image';
  }

  if (lower.endsWith('.pdf')) {
    return 'pdf';
  }

  return 'other';
}

export default function MeetingPage() {
  const params = useParams();
  const meetingId = params?.id as string;

  const supabase = createClient();

  const [attachments, setAttachments] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadAttachments();
  }, []);

  async function loadAttachments() {
    const { data } = await supabase
      .from('meeting_attachments')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: false });

    if (!data) return;

    const withUrls = await Promise.all(
      data.map(async (a) => {
        const { data: urlData } = await supabase.storage
          .from('meeting-attachments')
          .createSignedUrl(a.file_path, 3600);

        return {
          ...a,
          signedUrl: urlData?.signedUrl,
          fileType: getFileType(a.file_name),
        };
      })
    );

    setAttachments(withUrls);
  }

  function toggle(id: string) {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <Section label="Portal" title="Meeting">
      <Card>
        <TestAttachmentUpload meetingId={meetingId} />

        <div className="mt-6 space-y-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-black/30"
            >
              {/* PDF PREVIEW (TOGGLE) */}
              {attachment.fileType === 'pdf' &&
                attachment.signedUrl &&
                expanded[attachment.id] && (
                  <iframe
                    src={attachment.signedUrl}
                    className="w-full"
                    style={{ height: '500px' }}
                  />
                )}

              {/* HEADER */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm text-zinc-200">
                    {attachment.file_name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Uploaded {new Date(attachment.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* TOGGLE BUTTON */}
                  {attachment.fileType === 'pdf' && (
                    <button
                      onClick={() => toggle(attachment.id)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white hover:bg-white/5"
                    >
                      {expanded[attachment.id] ? 'Hide' : 'Preview'}
                    </button>
                  )}

                  {/* OPEN BUTTON */}
                  {attachment.signedUrl && (
                    <a
                      href={attachment.signedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white hover:bg-white/5"
                    >
                      Open
                    </a>
                  )}

                  {/* DELETE */}
                  <form
                    action={`/api/meetings/${meetingId}/attachments/${attachment.id}`}
                    method="POST"
                  >
                    <button className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="pt-6">
        <MeetingComments meetingId={meetingId} />
      </div>
    </Section>
  );
}

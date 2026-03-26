import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import MeetingComments from '@/components/meetings/MeetingComments';
import TestAttachmentUpload from '@/components/meetings/TestAttachmentUpload';

function AgendaBlock({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) return null;

  return (
    <div className="pt-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {title}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{content}</p>
    </div>
  );
}

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

export default async function PortalMeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: meeting } = await supabase
    .from('meetings')
    .select(
      `
        id,
        title,
        meeting_date,
        next_meeting_date,
        status,
        arrival_silent_transition,
        opening_anchor,
        code_standard_reaffirmation,
        ownership_round,
        council_reflection,
        practical_alignment_block,
        open_business,
        commitment_declarations,
        closing_anchor,
        post_meeting_notes
      `
    )
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (!meeting) {
    notFound();
  }

  const { data: attachments } = await supabase
    .from('meeting_attachments')
    .select('id, file_name, file_path, created_at')
    .eq('meeting_id', id)
    .order('created_at', { ascending: false });

  const attachmentsWithUrls = await Promise.all(
    (attachments || []).map(async (attachment) => {
      const { data: signedUrlData } = await supabase.storage
        .from('meeting-attachments')
        .createSignedUrl(attachment.file_path, 60 * 60);

      return {
        ...attachment,
        signedUrl: signedUrlData?.signedUrl || null,
        fileType: getFileType(attachment.file_name),
      };
    })
  );

  return (
    <Section
      label="Portal"
      title={meeting.title}
      description="Meeting agenda and details."
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <Link
          href={`/print/meetings/${meeting.id}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
        >
          Print Agenda Page
        </Link>
      </div>

      <Card>
        <div className="space-y-2">
          <div className="text-sm text-zinc-400">
            {meeting.meeting_date
              ? new Date(meeting.meeting_date).toLocaleString()
              : 'No date set'}
          </div>

          {meeting.next_meeting_date && (
            <div className="text-sm text-zinc-500">
              Next Meeting: {new Date(meeting.next_meeting_date).toLocaleString()}
            </div>
          )}

          <AgendaBlock
            title="Arrival & Silent Transition"
            content={meeting.arrival_silent_transition}
          />
          <AgendaBlock title="Opening Anchor" content={meeting.opening_anchor} />
          <AgendaBlock
            title="Code & Standard Reaffirmation"
            content={meeting.code_standard_reaffirmation}
          />
          <AgendaBlock title="Ownership Round" content={meeting.ownership_round} />
          <AgendaBlock title="Council Reflection" content={meeting.council_reflection} />
          <AgendaBlock
            title="Practical Alignment Block"
            content={meeting.practical_alignment_block}
          />
          <AgendaBlock title="Open Business" content={meeting.open_business} />
          <AgendaBlock
            title="Commitment Declarations"
            content={meeting.commitment_declarations}
          />
          <AgendaBlock title="Closing Anchor" content={meeting.closing_anchor} />
          <AgendaBlock
            title="Post-Meeting Notes"
            content={meeting.post_meeting_notes}
          />

          <div className="pt-6">
            <TestAttachmentUpload meetingId={meeting.id} />
          </div>

          <div className="pt-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Attachments
            </div>

            <div className="mt-3 space-y-3">
              {attachmentsWithUrls.length ? (
                attachmentsWithUrls.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="overflow-hidden rounded-xl border border-white/10 bg-black/30"
                  >
                    {attachment.fileType === 'pdf' && attachment.signedUrl && (
                      <div className="border-b border-white/10 bg-black">
                        <iframe
                          src={attachment.signedUrl}
                          className="w-full"
                          style={{ height: '500px' }}
                        />
                      </div>
                    )}

                    {attachment.fileType === 'image' && attachment.signedUrl && (
                      <a
                        href={attachment.signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block border-b border-white/10"
                      >
                        <img
                          src={attachment.signedUrl}
                          alt={attachment.file_name}
                          className="max-h-72 w-full object-cover"
                        />
                      </a>
                    )}

                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-200">
                          {attachment.file_name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          Uploaded {new Date(attachment.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {attachment.fileType === 'pdf' && attachment.signedUrl && (
                          <a
                            href={attachment.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white hover:bg-white/5"
                          >
                            Preview
                          </a>
                        )}

                        {attachment.fileType !== 'pdf' && attachment.signedUrl && (
                          <a
                            href={attachment.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white hover:bg-white/5"
                          >
                            Open
                          </a>
                        )}

                        <form
                          action={`/api/meetings/${meeting.id}/attachments/${attachment.id}`}
                          method="POST"
                        >
                          <button
                            type="submit"
                            className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No attachments for this meeting.</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="pt-6">
        <MeetingComments meetingId={meeting.id} />
      </div>
    </Section>
  );
}

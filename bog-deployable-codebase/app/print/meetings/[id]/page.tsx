import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function PrintBlock({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) return null;

  return (
    <div className="mt-6">
      <div className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-600">
        {title}
      </div>
      <div className="whitespace-pre-wrap text-sm leading-6 text-black">
        {content}
      </div>
    </div>
  );
}

export default async function PrintMeetingPage({
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
    .select('id, file_name, file_url')
    .eq('meeting_id', id)
    .order('created_at', { ascending: false });

  return (
    <>
      <style>{`
        header,
        nav,
        [role="banner"] {
          display: none !important;
        }

        body > div:first-child > div:first-child {
          display: none !important;
        }

        main {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
      `}</style>

      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-4xl px-8 py-10">
          <div className="mb-8 flex justify-end print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-100"
            >
              Print
            </button>
          </div>

          <div className="border-b border-zinc-300 pb-4">
            <h1 className="text-3xl font-bold">{meeting.title}</h1>

            <div className="mt-3 text-sm text-zinc-700">
              {meeting.meeting_date
                ? new Date(meeting.meeting_date).toLocaleString()
                : 'No date set'}
            </div>

            {meeting.next_meeting_date && (
              <div className="mt-1 text-sm text-zinc-700">
                Next Meeting: {new Date(meeting.next_meeting_date).toLocaleString()}
              </div>
            )}
          </div>

          <PrintBlock
            title="Arrival & Silent Transition"
            content={meeting.arrival_silent_transition}
          />
          <PrintBlock title="Opening Anchor" content={meeting.opening_anchor} />
          <PrintBlock
            title="Code & Standard Reaffirmation"
            content={meeting.code_standard_reaffirmation}
          />
          <PrintBlock title="Ownership Round" content={meeting.ownership_round} />
          <PrintBlock title="Council Reflection" content={meeting.council_reflection} />
          <PrintBlock
            title="Practical Alignment Block"
            content={meeting.practical_alignment_block}
          />
          <PrintBlock title="Open Business" content={meeting.open_business} />
          <PrintBlock
            title="Commitment Declarations"
            content={meeting.commitment_declarations}
          />
          <PrintBlock title="Closing Anchor" content={meeting.closing_anchor} />
          <PrintBlock
            title="Post-Meeting Notes"
            content={meeting.post_meeting_notes}
          />

          <div className="mt-8">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-600">
              Attachments
            </div>

            {attachments?.length ? (
              <ul className="list-disc pl-5 text-sm text-black">
                {attachments.map((attachment) => (
                  <li key={attachment.id} className="mb-1">
                    {attachment.file_name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-700">No attachments for this meeting.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PrintMeetingButton from '@/components/meetings/PrintMeetingButton';

function formatMeetingDate(date?: string | null) {
  if (!date) return 'No date set';

  return new Date(date).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function PrintBlock({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) return null;

  return (
    <section className="mt-6 break-inside-avoid rounded-[20px] border border-zinc-200 bg-white p-6">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </div>
      <div className="whitespace-pre-wrap text-sm leading-7 text-black">
        {content}
      </div>
    </section>
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
    .select('id, file_name')
    .eq('meeting_id', id)
    .order('created_at', { ascending: false });

  const blocks = [
    {
      title: 'Arrival & Silent Transition',
      content: meeting.arrival_silent_transition,
    },
    {
      title: 'Opening Anchor',
      content: meeting.opening_anchor,
    },
    {
      title: 'Code & Standard Reaffirmation',
      content: meeting.code_standard_reaffirmation,
    },
    {
      title: 'Ownership Round',
      content: meeting.ownership_round,
    },
    {
      title: 'Council Reflection',
      content: meeting.council_reflection,
    },
    {
      title: 'Practical Alignment Block',
      content: meeting.practical_alignment_block,
    },
    {
      title: 'Open Business',
      content: meeting.open_business,
    },
    {
      title: 'Commitment Declarations',
      content: meeting.commitment_declarations,
    },
    {
      title: 'Closing Anchor',
      content: meeting.closing_anchor,
    },
    {
      title: 'Post-Meeting Notes',
      content: meeting.post_meeting_notes,
    },
  ].filter((block) => block.content);

  return (
    <>
      <div className="print-page min-h-screen bg-[#f4f4f5] text-black print:bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
          <div className="mb-6 flex items-center justify-between print:hidden">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                Print View
              </div>
              <div className="mt-1 text-2xl font-bold text-black">
                {meeting.title}
              </div>
            </div>

            <PrintMeetingButton />
          </div>

          <article className="mx-auto max-w-4xl rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_20px_70px_rgba(0,0,0,0.10)] print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
            <header className="border-b border-zinc-200 pb-5">
              <h1 className="text-3xl font-bold tracking-[-0.03em] text-black">
                {meeting.title}
              </h1>

              <div className="mt-4 space-y-1 text-sm text-zinc-700">
                <div>{formatMeetingDate(meeting.meeting_date)}</div>

                {meeting.next_meeting_date && (
                  <div>
                    Next Meeting: {formatMeetingDate(meeting.next_meeting_date)}
                  </div>
                )}
              </div>
            </header>

            <div className="mt-6">
              {blocks.length ? (
                blocks.map((block) => (
                  <PrintBlock
                    key={block.title}
                    title={block.title}
                    content={block.content}
                  />
                ))
              ) : (
                <div className="rounded-[20px] border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                  No agenda sections available for this meeting.
                </div>
              )}
            </div>

            <section className="mt-8 break-inside-avoid rounded-[20px] border border-zinc-200 bg-white p-6">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Attachments
              </div>

              {attachments?.length ? (
                <ul className="list-disc pl-5 text-sm leading-7 text-black">
                  {attachments.map((attachment) => (
                    <li key={attachment.id}>{attachment.file_name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-700">No attachments for this meeting.</p>
              )}
            </section>

            <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
              <div>Buffalo Dogs - BOG - Brotherhood of Growth</div>
              <div className="mt-1">
                BOGBuffaloDogs@gmail.com • BOGDustinE@gmail.com
              </div>
              <div className="mt-1">TheBuffaloDogs.com</div>
            </footer>
          </article>
        </div>
      </div>

      <style>{`
        html,
        body {
          background: #f4f4f5 !important;
        }

        header,
        nav,
        aside,
        [role='banner'],
        [data-hide-on-print='true'] {
          display: none !important;
        }

        main {
          padding-top: 0 !important;
          margin-top: 0 !important;
          min-height: 100vh !important;
          background: #f4f4f5 !important;
        }

        @page {
          size: auto;
          margin: 0.5in;
        }

        @media print {
          html,
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }

          header,
          nav,
          aside,
          [role='banner'],
          [data-hide-on-print='true'] {
            display: none !important;
          }

          * {
            box-shadow: none !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            min-height: auto !important;
          }

          .print-page {
            background: #ffffff !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          article {
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }

          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          a {
            color: #000000 !important;
            text-decoration: none !important;
          }
        }
      `}</style>
    </>
  );
}

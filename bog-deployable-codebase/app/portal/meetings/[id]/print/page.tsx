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
    <div style={{ marginTop: '16px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#555',
          marginBottom: '4px',
        }}
      >
        {title}
      </div>
      <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', color: '#111' }}>
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
    <html>
      <head>
        <title>{meeting.title} - Print</title>
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: 'Arial, sans-serif',
          background: '#fff',
          color: '#111',
        }}
      >
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            padding: '32px',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '28px' }}>{meeting.title}</h1>

            <div style={{ marginTop: '10px', fontSize: '14px', color: '#444' }}>
              {meeting.meeting_date
                ? new Date(meeting.meeting_date).toLocaleString()
                : 'No date set'}
            </div>

            {meeting.next_meeting_date && (
              <div style={{ marginTop: '6px', fontSize: '14px', color: '#444' }}>
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

          <div style={{ marginTop: '24px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#555',
                marginBottom: '8px',
              }}
            >
              Attachments
            </div>

            {attachments?.length ? (
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px' }}>
                {attachments.map((attachment) => (
                  <li key={attachment.id} style={{ marginBottom: '6px' }}>
                    {attachment.file_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '14px', color: '#444' }}>
                No attachments for this meeting.
              </div>
            )}
          </div>

          <div style={{ marginTop: '32px' }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                background: '#111',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Print Meeting
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

import { notFound, redirect } from 'next/navigation';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import MeetingAttachmentUpload from '@/components/meetings/MeetingAttachmentUpload';

async function updateMeeting(id: string, formData: FormData) {
  'use server';

  const supabase = await createClient();

  const title = String(formData.get('title') ?? '').trim();
  const meeting_date = String(formData.get('meeting_date') ?? '');
  const next_meeting_date = String(formData.get('next_meeting_date') ?? '');
  const status = String(formData.get('status') ?? 'draft');

  const arrival_silent_transition = String(
    formData.get('arrival_silent_transition') ?? ''
  ).trim();
  const opening_anchor = String(formData.get('opening_anchor') ?? '').trim();
  const code_standard_reaffirmation = String(
    formData.get('code_standard_reaffirmation') ?? ''
  ).trim();
  const ownership_round = String(formData.get('ownership_round') ?? '').trim();
  const council_reflection = String(formData.get('council_reflection') ?? '').trim();
  const practical_alignment_block = String(
    formData.get('practical_alignment_block') ?? ''
  ).trim();
  const open_business = String(formData.get('open_business') ?? '').trim();
  const commitment_declarations = String(
    formData.get('commitment_declarations') ?? ''
  ).trim();
  const closing_anchor = String(formData.get('closing_anchor') ?? '').trim();
  const post_meeting_notes = String(formData.get('post_meeting_notes') ?? '').trim();

  const { error } = await supabase
    .from('meetings')
    .update({
      title,
      meeting_date: meeting_date || null,
      next_meeting_date: next_meeting_date || null,
      status,
      arrival_silent_transition: arrival_silent_transition || null,
      opening_anchor: opening_anchor || null,
      code_standard_reaffirmation: code_standard_reaffirmation || null,
      ownership_round: ownership_round || null,
      council_reflection: council_reflection || null,
      practical_alignment_block: practical_alignment_block || null,
      open_business: open_business || null,
      commitment_declarations: commitment_declarations || null,
      closing_anchor: closing_anchor || null,
      post_meeting_notes: post_meeting_notes || null,
    })
    .eq('id', id);

  if (error) {
    console.error('updateMeeting error:', error);
    return;
  }

  revalidatePath('/admin/meetings');
  revalidatePath('/portal/meetings');
  revalidatePath(`/portal/meetings/${id}`);

  redirect('/admin/meetings');
}

export default async function AdminMeetingEditPage({
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
    .single();

  if (!meeting) {
    notFound();
  }

  return (
    <Section
      label="Admin"
      title="Edit Meeting"
      description="Update meeting details."
    >
      <Card>
        <form action={updateMeeting.bind(null, id)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Title</label>
            <input
              name="title"
              defaultValue={meeting.title ?? ''}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Arrival &amp; Silent Transition
            </label>
            <textarea
              name="arrival_silent_transition"
              defaultValue={meeting.arrival_silent_transition ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Opening Anchor
            </label>
            <textarea
              name="opening_anchor"
              defaultValue={meeting.opening_anchor ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Code &amp; Standard Reaffirmation
            </label>
            <textarea
              name="code_standard_reaffirmation"
              defaultValue={meeting.code_standard_reaffirmation ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Ownership Round
            </label>
            <textarea
              name="ownership_round"
              defaultValue={meeting.ownership_round ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Council Reflection
            </label>
            <textarea
              name="council_reflection"
              defaultValue={meeting.council_reflection ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Practical Alignment Block
            </label>
            <textarea
              name="practical_alignment_block"
              defaultValue={meeting.practical_alignment_block ?? ''}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Open Business
            </label>
            <textarea
              name="open_business"
              defaultValue={meeting.open_business ?? ''}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Commitment Declarations
            </label>
            <textarea
              name="commitment_declarations"
              defaultValue={meeting.commitment_declarations ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Closing Anchor
            </label>
            <textarea
              name="closing_anchor"
              defaultValue={meeting.closing_anchor ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Post-Meeting Notes
            </label>
            <textarea
              name="post_meeting_notes"
              defaultValue={meeting.post_meeting_notes ?? ''}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Meeting Date &amp; Time
            </label>
            <input
              type="datetime-local"
              name="meeting_date"
              defaultValue={meeting.meeting_date ? meeting.meeting_date.slice(0, 16) : ''}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Next Meeting Date
            </label>
            <input
              type="datetime-local"
              name="next_meeting_date"
              defaultValue={
                meeting.next_meeting_date ? meeting.next_meeting_date.slice(0, 16) : ''
              }
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Status</label>
            <select
              name="status"
              defaultValue={meeting.status ?? 'draft'}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>

<div className="space-y-4 pt-2">
  <MeetingAttachmentUpload meetingId={meeting.id} />

  <button
    type="submit"
    className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
  >
    Update Meeting
  </button>
</div>
        </form>
      </Card>
    </Section>
  );
}

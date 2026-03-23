import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function EditMeetingPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: meeting } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', params.id)
    .single();

  async function updateMeeting(formData: FormData) {
    'use server';

    const supabase = await createClient();

    const id = String(formData.get('id') ?? '');
    const title = String(formData.get('title') ?? '');
    const description = String(formData.get('description') ?? '');
    const location = String(formData.get('location') ?? '');
    const meeting_date = String(formData.get('meeting_date') ?? '');
    const status = String(formData.get('status') ?? 'draft');

    const arrival_silent_transition = String(formData.get('arrival_silent_transition') ?? '');
    const opening_anchor = String(formData.get('opening_anchor') ?? '');
    const code_standard_reaffirmation = String(formData.get('code_standard_reaffirmation') ?? '');
    const ownership = String(formData.get('ownership') ?? '');
    const council_reflection = String(formData.get('council_reflection') ?? '');
    const practical_alignment_block = String(formData.get('practical_alignment_block') ?? '');
    const open_business = String(formData.get('open_business') ?? '');
    const commitment_declarations = String(formData.get('commitment_declarations') ?? '');
    const closing_anchor = String(formData.get('closing_anchor') ?? '');
    const post_meeting_notes = String(formData.get('post_meeting_notes') ?? '');

    const { error } = await supabase
      .from('meetings')
      .update({
        title,
        description,
        location,
        meeting_date,
        status,

        arrival_silent_transition,
        opening_anchor,
        code_standard_reaffirmation,
        ownership,
        council_reflection,
        practical_alignment_block,
        open_business,
        commitment_declarations,
        closing_anchor,
        post_meeting_notes,
      })
      .eq('id', id);

    if (error) {
      console.error('UPDATE ERROR:', error);
      throw new Error(error.message);
    }

    revalidatePath('/admin/meetings');
    revalidatePath('/portal/meetings');

    redirect('/admin/meetings');
  }

  if (!meeting) {
    return <div className="text-white">Meeting not found</div>;
  }

  return (
    <Section label="Admin" title="Edit Meeting" description="Update meeting details">
      <Card>
        <form action={updateMeeting} className="space-y-4">
          <input type="hidden" name="id" value={meeting.id} />

          <input name="title" defaultValue={meeting.title} className="input" />
          <textarea name="description" defaultValue={meeting.description} className="input" />

          <textarea name="arrival_silent_transition" defaultValue={meeting.arrival_silent_transition} className="input" />
          <textarea name="opening_anchor" defaultValue={meeting.opening_anchor} className="input" />
          <textarea name="code_standard_reaffirmation" defaultValue={meeting.code_standard_reaffirmation} className="input" />
          <textarea name="ownership" defaultValue={meeting.ownership} className="input" />
          <textarea name="council_reflection" defaultValue={meeting.council_reflection} className="input" />
          <textarea name="practical_alignment_block" defaultValue={meeting.practical_alignment_block} className="input" />
          <textarea name="open_business" defaultValue={meeting.open_business} className="input" />
          <textarea name="commitment_declarations" defaultValue={meeting.commitment_declarations} className="input" />
          <textarea name="closing_anchor" defaultValue={meeting.closing_anchor} className="input" />
          <textarea name="post_meeting_notes" defaultValue={meeting.post_meeting_notes} className="input" />

          <input name="location" defaultValue={meeting.location} className="input" />

          <input
            type="datetime-local"
            name="meeting_date"
            defaultValue={meeting.meeting_date?.slice(0, 16)}
            className="input"
          />

          <select name="status" defaultValue={meeting.status} className="input">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>

          <button type="submit" className="btn">
            Update Meeting
          </button>
        </form>
      </Card>
    </Section>
  );
}

import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/cards';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function saveMeeting(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const title = String(formData.get('title') ?? '').trim();
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

  const meeting_date = String(formData.get('meeting_date') ?? '');
  const next_meeting_date = String(formData.get('next_meeting_date') ?? '');
  const status = String(formData.get('status') ?? 'draft');

  const result = await supabase.from('meetings').insert({
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
  });

  if (result.error) {
    console.error('saveMeeting error:', result.error);
    return;
  }

  revalidatePath('/admin/meetings');
  revalidatePath('/portal/meetings');
}

async function deleteMeeting(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const id = String(formData.get('id') ?? '');

  if (!id) return;

  const result = await supabase.from('meetings').delete().eq('id', id);

  if (result.error) {
    console.error('deleteMeeting error:', result.error);
    return;
  }

  revalidatePath('/admin/meetings');
  revalidatePath('/portal/meetings');
}

function AgendaBlock({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  if (!content) return null;

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {title}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{content}</p>
    </div>
  );
}

export default async function AdminMeetingsPage() {
  const supabase = await createClient();

  const { data: meetings } = await supabase
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
    .order('meeting_date', { ascending: true });

  return (
    <Section
      label="Admin"
      title="Manage Meetings"
      description="Create and publish meetings for members."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="mb-4 text-lg font-bold text-white">Create New Meeting</div>

          <form action={saveMeeting} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Title</label>
              <input
                name="title"
                placeholder="Brotherhood Meeting"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Arrival &amp; Silent Transition
              </label>
              <textarea
                name="arrival_silent_transition"
                placeholder="Describe how members should arrive and transition..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Opening Anchor
              </label>
              <textarea
                name="opening_anchor"
                placeholder="Opening message, intention, or grounding..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Code &amp; Standard Reaffirmation
              </label>
              <textarea
                name="code_standard_reaffirmation"
                placeholder="Reaffirm the code, standard, and expectations..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Ownership Round
              </label>
              <textarea
                name="ownership_round"
                placeholder="Ownership check-in topics..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Council Reflection
              </label>
              <textarea
                name="council_reflection"
                placeholder="Reflection prompts or discussion..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Practical Alignment Block
              </label>
              <textarea
                name="practical_alignment_block"
                placeholder="Action items, alignment topics, planning..."
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Open Business
              </label>
              <textarea
                name="open_business"
                placeholder="Anything raised by members or leadership..."
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Commitment Declarations
              </label>
              <textarea
                name="commitment_declarations"
                placeholder="Commitments declared by members..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Closing Anchor
              </label>
              <textarea
                name="closing_anchor"
                placeholder="Closing message or final grounding..."
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Post-Meeting Notes
              </label>
              <textarea
                name="post_meeting_notes"
                placeholder="Notes added after the meeting..."
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Meeting Date &amp; Time
              </label>
              <input
                type="datetime-local"
                name="meeting_date"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Next Meeting Date
              </label>
              <input
                type="datetime-local"
                name="next_meeting_date"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Status</label>
              <select
                name="status"
                defaultValue="draft"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Save Meeting
            </button>
          </form>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-bold text-white">Existing Meetings</div>

          <div className="space-y-4">
            {meetings?.map((meeting) => (
              <div key={meeting.id} className="rounded-2xl border border-white/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{meeting.title}</div>

                    <div className="mt-1 text-sm text-zinc-400">
                      {meeting.meeting_date
                        ? new Date(meeting.meeting_date).toLocaleString()
                        : 'No date'}
                    </div>

                    {meeting.next_meeting_date && (
                      <div className="mt-1 text-sm text-zinc-500">
                        Next Meeting: {new Date(meeting.next_meeting_date).toLocaleString()}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-zinc-400">Status: {meeting.status}</div>
                  </div>

                  <Link
                    href={`/admin/meetings/${meeting.id}`}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/5"
                  >
                    Edit
                  </Link>
                </div>

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

                <form action={deleteMeeting} className="mt-4">
                  <input type="hidden" name="id" value={meeting.id} />
                  <button
                    type="submit"
                    className="rounded-xl border border-red-500/40 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete Meeting
                  </button>
                </form>
              </div>
            ))}

            {!meetings?.length && (
              <div className="text-sm text-zinc-400">No meetings created yet.</div>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  context: {
    params: Promise<{ meetingId: string; attachmentId: string }>;
  }
) {
  try {
    const { meetingId, attachmentId } = await context.params;
    const supabase = await createClient();

    const { data: attachment, error: fetchError } = await supabase
      .from('meeting_attachments')
      .select('id, file_path')
      .eq('id', attachmentId)
      .eq('meeting_id', meetingId)
      .single();

    if (fetchError || !attachment) {
      return NextResponse.json({ error: 'Attachment not found.' }, { status: 404 });
    }

    const { error: storageError } = await supabase.storage
      .from('meeting-attachments')
      .remove([attachment.file_path]);

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('meeting_attachments')
      .delete()
      .eq('id', attachmentId)
      .eq('meeting_id', meetingId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.redirect(
      new URL(`/portal/meetings/${meetingId}`, request.url),
      { status: 303 }
    );
  } catch (error) {
    console.error('DELETE ATTACHMENT ERROR:', error);

    return NextResponse.json(
      { error: 'Something went wrong while deleting the attachment.' },
      { status: 500 }
    );
  }
}

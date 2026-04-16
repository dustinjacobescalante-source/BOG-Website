import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const supabase = await createClient();

    const application = {
      student_name: String(payload.student_name ?? '').trim(),
      email: String(payload.email ?? '').trim(),
      phone: String(payload.phone ?? '').trim(),
      school_name: String(payload.school_name ?? '').trim(),
      gpa: Number(payload.gpa ?? 0),
      intended_path: String(payload.intended_path ?? '').trim(),
      activities: String(payload.activities ?? '').trim(),
      essay_prompt: String(payload.essay_prompt ?? '').trim(),
      essay_file_url: String(payload.essay_file_url ?? '').trim(),
      recommendation_file_url: String(payload.recommendation_file_url ?? '').trim(),
      transcript_file_url: String(payload.transcript_file_url ?? '').trim(),
      review_notes: null,
    };

    if (!application.student_name) {
      return NextResponse.json(
        { error: 'Student name is required.' },
        { status: 400 }
      );
    }

    if (!application.email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!application.essay_prompt) {
      return NextResponse.json(
        { error: 'Essay prompt is required.' },
        { status: 400 }
      );
    }

    if (!application.essay_file_url) {
      return NextResponse.json(
        { error: 'Essay file is required.' },
        { status: 400 }
      );
    }

    if (!application.recommendation_file_url) {
      return NextResponse.json(
        { error: 'Recommendation letter is required.' },
        { status: 400 }
      );
    }

    if (!application.transcript_file_url) {
      return NextResponse.json(
        { error: 'Transcript file is required.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('scholarship_applications')
      .insert(application);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to submit scholarship application.' },
      { status: 500 }
    );
  }
}

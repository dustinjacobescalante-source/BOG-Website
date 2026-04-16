import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const supabase = await createClient();

    // Save to database
    const { error } = await supabase.from('join_requests').insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    
    }

    // Send email notification
    await resend.emails.send({
      from: 'BOG <onboarding@resend.dev>',
      to: 'dustinjacobescalante@gmail.com', // <-- your email
      subject: 'New BOG Join Request',
      html: `
        <h2>New Join Request</h2>
        <p><strong>Name:</strong> ${payload.full_name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        <p><strong>Message:</strong> ${payload.message}</p>
        <p><strong>Wants to Visit:</strong> ${payload.interested_in_visiting ? 'Yes' : 'No'}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

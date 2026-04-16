import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing RESEND_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: 'BOG <onboarding@resend.dev>',
      to: 'dustinjacobescalante@gmail.com',
      subject: 'New BOG Account Signup',
      html: `
        <h2>New Account Signup</h2>
        <p><strong>Name:</strong> ${payload.full_name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p>This account is pending admin approval.</p>
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

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function POST(req: Request) { const payload = await req.json(); const supabase = await createClient(); const { error } = await supabase.from('scholarship_applications').insert(payload); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ ok: true }); }

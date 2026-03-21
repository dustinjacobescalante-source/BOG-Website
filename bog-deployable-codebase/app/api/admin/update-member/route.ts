import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const userId = String(formData.get("userId") ?? "");
    const role = String(formData.get("role") ?? "member");
    const rank = String(formData.get("rank") ?? "omega");
    const status = String(formData.get("status") ?? "pending");

    if (!userId) {
      return NextResponse.redirect(new URL("/admin/members", req.url));
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.redirect(new URL("/admin/members", req.url));
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const is_active = status === "approved";

    await admin
      .from("profiles")
      .update({
        role,
        rank,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return NextResponse.redirect(new URL("/admin/members", req.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/members", req.url));
  }
}

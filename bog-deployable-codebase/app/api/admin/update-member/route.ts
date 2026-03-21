import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = String(formData.get("userId"));
  const role = String(formData.get("role"));
  const rank = String(formData.get("rank"));
  const status = String(formData.get("status"));

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await admin
    .from("profiles")
    .update({
      role,
      rank,
      is_active: status === "approved",
    })
    .eq("id", userId);

  return NextResponse.redirect(new URL("/admin/members", req.url));
}

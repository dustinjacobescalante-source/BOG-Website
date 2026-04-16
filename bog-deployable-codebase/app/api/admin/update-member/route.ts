import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = String(formData.get("userId"));
  const role = String(formData.get("role"));
  const rank = String(formData.get("rank"));
  const status = String(formData.get("status"));
  const email = String(formData.get("email"));

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Update user
  await admin
    .from("profiles")
    .update({
      role,
      rank,
      is_active: status === "approved",
    })
    .eq("id", userId);

  // 🚀 SEND EMAIL IF APPROVED
  if (status === "approved" && email) {
    await resend.emails.send({
      from: "BOG <noreply@thebuffalodogs.com>",
      to: email,
      subject: "You're Approved – Welcome to BOG",
      html: `
        <div style="font-family: Arial; background:#0a0a0a; color:white; padding:20px;">
          <h1 style="color:#e11d48;">Buffalo Dogs</h1>
          <p>Your account has been approved.</p>
          <p>You now have full access to the portal.</p>
          <br />
          <a href="https://www.thebuffalodogs.com/portal"
             style="background:#e11d48; padding:10px 15px; color:white; text-decoration:none;">
             Enter Portal
          </a>
        </div>
      `,
    });
  }

  return NextResponse.redirect(new URL("/admin/members", req.url));
}

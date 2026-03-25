import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await context.params;
    const supabase = await createClient();

    // ✅ Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get file from form
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ✅ Optional: file size limit
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    // ✅ Clean file name
    const safeFileName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^\w.-]/g, "");

    // ✅ Build file path (organized + unique)
    const filePath = `${meetingId}/${user.id}/${Date.now()}-${safeFileName}`;

    // ✅ Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("meeting-attachments")
      .upload(filePath, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 400 }
      );
    }

    // ✅ Insert DB record
    const { data: row, error: insertError } = await supabase
      .from("meeting_attachments")
      .insert({
        meeting_id: meetingId,
        uploaded_by: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type || null,
      })
      .select()
      .single();

    if (insertError) {
      // rollback file if DB fails
      await supabase.storage.from("meeting-attachments").remove([filePath]);

      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      attachment: row,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Server error during upload" },
      { status: 500 }
    );
  }
}

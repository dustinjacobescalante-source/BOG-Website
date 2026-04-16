import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_STATUSES = new Set([
  "pending",
  "processing",
  "fulfilled",
  "cancelled",
  "archived",
]);

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 as const, supabase: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || profile.role !== "admin") {
    return { error: "Forbidden", status: 403 as const, supabase: null };
  }

  return { supabase, error: null, status: 200 as const };
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.supabase) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await context.params;
    const body = await req.json();
    const status = String(body.status ?? "").trim().toLowerCase();

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const { error } = await auth.supabase
      .from("merch_orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("admin merch order PATCH error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update order." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin merch order PATCH route error:", error);
    return NextResponse.json(
      { error: "Unexpected error while updating order." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.supabase) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await context.params;

    const { error } = await auth.supabase
      .from("merch_orders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("admin merch order DELETE error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete order." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin merch order DELETE route error:", error);
    return NextResponse.json(
      { error: "Unexpected error while deleting order." },
      { status: 500 }
    );
  }
}

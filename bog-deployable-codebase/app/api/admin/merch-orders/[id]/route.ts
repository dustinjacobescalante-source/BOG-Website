import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_STATUSES = new Set([
  "new",
  "contacted",
  "paid",
  "fulfilled",
  "cancelled",
  "archived",
]);

function getCustomerStatusLabel(status: string) {
  switch (status) {
    case "contacted":
      return "Processing";
    case "paid":
      return "Paid";
    case "fulfilled":
      return "Fulfilled";
    case "cancelled":
      return "Cancelled";
    case "new":
      return "Pending";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}

function getCustomerEmailContent(status: string, customerName: string, productName: string) {
  switch (status) {
    case "contacted":
      return {
        subject: "Your BOG merch order is being processed",
        html: `
          <h2>BOG Merch Update</h2>
          <p>Hey ${customerName},</p>
          <p>Your order for <strong>${productName}</strong> is now being processed.</p>
          <p>Leadership has started working your request and will follow up with you if anything else is needed.</p>
          <p>— BOG</p>
        `,
      };

    case "paid":
      return {
        subject: "Your BOG merch order has been marked paid",
        html: `
          <h2>BOG Merch Update</h2>
          <p>Hey ${customerName},</p>
          <p>Your order for <strong>${productName}</strong> has been marked as paid.</p>
          <p>We’ll continue moving it through fulfillment.</p>
          <p>— BOG</p>
        `,
      };

    case "fulfilled":
      return {
        subject: "Your BOG merch order is fulfilled",
        html: `
          <h2>BOG Merch Update</h2>
          <p>Hey ${customerName},</p>
          <p>Your order for <strong>${productName}</strong> has been fulfilled.</p>
          <p>If pickup or handoff details still need to be coordinated, leadership will follow up.</p>
          <p>— BOG</p>
        `,
      };

    case "cancelled":
      return {
        subject: "Your BOG merch order has been cancelled",
        html: `
          <h2>BOG Merch Update</h2>
          <p>Hey ${customerName},</p>
          <p>Your order for <strong>${productName}</strong> has been marked as cancelled.</p>
          <p>If you believe this was done in error, reply back and leadership can review it.</p>
          <p>— BOG</p>
        `,
      };

    default:
      return null;
  }
}

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

    const { data: existingOrder, error: existingOrderError } = await auth.supabase
      .from("merch_orders")
      .select("id, customer_name, email, product_id, status")
      .eq("id", id)
      .single();

    if (existingOrderError || !existingOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
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

    // Only send customer emails for actual customer-facing workflow changes
    if (["contacted", "paid", "fulfilled", "cancelled"].includes(status)) {
      const apiKey = process.env.RESEND_API_KEY;

      if (apiKey && existingOrder.email) {
        const resend = new Resend(apiKey);

        let productName = "your BOG merch item";

        if (existingOrder.product_id) {
          const { data: product } = await auth.supabase
            .from("merch_products")
            .select("name")
            .eq("id", existingOrder.product_id)
            .maybeSingle();

          if (product?.name) {
            productName = product.name;
          }
        }

        const emailContent = getCustomerEmailContent(
          status,
          existingOrder.customer_name || "Brother",
          productName
        );

        if (emailContent) {
          try {
            await resend.emails.send({
              from: "BOG <onboarding@resend.dev>",
              to: existingOrder.email,
              subject: emailContent.subject,
              html: emailContent.html,
            });
          } catch (emailError) {
            console.error("merch customer status email error:", emailError);
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      status,
      statusLabel: getCustomerStatusLabel(status),
    });
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

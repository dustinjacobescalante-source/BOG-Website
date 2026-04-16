import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

type MerchOrderPayload = {
  product_id?: string | null;
  customer_name?: string;
  email?: string;
  phone?: string;
  size?: string;
  quantity?: number;
  notes?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as MerchOrderPayload;

    const customer_name = String(payload.customer_name ?? "").trim();
    const email = String(payload.email ?? "").trim();
    const phone = String(payload.phone ?? "").trim();
    const size = String(payload.size ?? "").trim();
    const quantity = Number(payload.quantity ?? 1);
    const notes = String(payload.notes ?? "").trim();
    const product_id =
      typeof payload.product_id === "string" && payload.product_id.trim().length
        ? payload.product_id.trim()
        : null;

    if (!customer_name) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let productName = "BOG Merch Item";

    if (product_id) {
      const { data: product } = await supabase
        .from("merch_products")
        .select("name")
        .eq("id", product_id)
        .maybeSingle();

      if (product?.name) {
        productName = product.name;
      }
    }

    const insertPayload = {
      product_id,
      customer_name,
      email,
      phone: phone || null,
      size: size || null,
      quantity,
      notes: notes || null,
      status: "new",
    };

    const { data, error } = await supabase
      .from("merch_orders")
      .insert(insertPayload)
      .select("id, customer_name, email, product_id, status, created_at")
      .single();

    if (error) {
      console.error("merch order insert error:", error);
      return NextResponse.json(
        { error: error.message || "Unable to place order request." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      const resend = new Resend(apiKey);

      try {
        await resend.emails.send({
          from: "BOG <onboarding@resend.dev>",
          to: "dustinjacobescalante@gmail.com",
          subject: "New BOG Merch Order Request",
          html: `
            <h2>New Merch Order Request</h2>
            <p><strong>Name:</strong> ${customer_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Size:</strong> ${size || "Not provided"}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Notes:</strong> ${notes || "No notes provided"}</p>
            <p><strong>Status:</strong> new</p>
          `,
        });
      } catch (emailError) {
        console.error("merch admin notification email error:", emailError);
      }
    } else {
      console.error("Missing RESEND_API_KEY for merch order admin email.");
    }

    return NextResponse.json({
      ok: true,
      order: data,
    });
  } catch (error) {
    console.error("merch order route error:", error);
    return NextResponse.json(
      { error: "Unexpected error while placing merch order request." },
      { status: 500 }
    );
  }
}

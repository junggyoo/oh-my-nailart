import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";
import { createClient } from "@/lib/supabase/server";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "production",
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    const productIdMap: Record<string, string | undefined> = {
      pro: process.env.POLAR_PRO_PRODUCT_ID,
      ultra: process.env.POLAR_ULTRA_PRODUCT_ID,
    };

    const productId = productIdMap[plan];

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: user.id,
      customerEmail: user.email,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

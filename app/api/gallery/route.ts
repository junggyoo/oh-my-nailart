import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("thumbnails")
      .select("id, prompt, image_url, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ images: data });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "갤러리를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

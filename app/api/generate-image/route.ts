import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { THUMBNAIL_SYSTEM_PROMPT } from "@/lib/prompts/thumbnail-system";
import { createClient } from "@/lib/supabase/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Gemini image generation can take 30-60s
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageData } = await req.json();

    if (!prompt && !imageData) {
      return NextResponse.json(
        { error: "프롬프트 또는 이미지를 입력해주세요." },
        { status: 400 }
      );
    }

    // Credit deduction logic
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // Check credits and deduct 1
    const { data: userData } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!userData || userData.credits <= 0) {
      return NextResponse.json(
        { error: "크레딧이 부족합니다. 플랜을 업그레이드해주세요." },
        { status: 403 }
      );
    }

    // Deduct 1 credit before generation
    await supabase
      .from("users")
      .update({ credits: userData.credits - 1 })
      .eq("id", user.id);

    // Build contents array with system prompt prepended
    const contents: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [];

    const PHOTO_REMINDER = "\n\nREMINDER: Output a photorealistic DSLR photograph. No cartoon/illustration/webtoon styles.";

    const fullPrompt = prompt
      ? `${THUMBNAIL_SYSTEM_PROMPT}\n\n---\nUser Request: ${prompt}${PHOTO_REMINDER}`
      : `${THUMBNAIL_SYSTEM_PROMPT}${PHOTO_REMINDER}`;

    contents.push({ text: fullPrompt });

    if (imageData) {
      const matches = imageData.match(/^data:(.+?);base64,(.+)$/);
      if (matches) {
        contents.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3-pro-image-preview",
      contents: contents,
      config: {
        temperature: 0.5,
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
      },
    });

    const result: { text?: string; image?: string } = {};

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          result.text = (result.text || "") + part.text;
        } else if (part.inlineData) {
          result.image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (!result.text && !result.image) {
      // Refund 1 credit on generation failure
      await supabase
        .from("users")
        .update({ credits: userData.credits })
        .eq("id", user.id);

      return NextResponse.json(
        { error: "이미지를 생성하지 못했습니다. 다른 프롬프트를 시도해주세요." },
        { status: 500 }
      );
    }

    // Save generated image to Supabase
    if (result.image) {
        const base64Match = result.image.match(/^data:(.+?);base64,(.+)$/);
        if (base64Match) {
          const mimeType = base64Match[1];
          const ext = mimeType === "image/png" ? "png" : "jpg";
          const buffer = Buffer.from(base64Match[2], "base64");
          const fileName = `${user.id}/${Date.now()}.${ext}`;
          const promptToSave = prompt || "No prompt";

          // Fire-and-forget: upload + insert using already-created client
          supabase.storage
            .from("images")
            .upload(fileName, buffer, { contentType: mimeType })
            .then(({ error: uploadError }) => {
              if (uploadError) {
                console.error("Storage upload error:", uploadError);
                return;
              }
              const { data: urlData } = supabase.storage
                .from("images")
                .getPublicUrl(fileName);

              return supabase.from("thumbnails").insert({
                user_id: user.id,
                prompt: promptToSave,
                image_url: urlData.publicUrl,
                storage_path: fileName,
              });
            })
            .catch((err) => console.error("Failed to save image:", err));
        }
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Image generation error:", error);

    // Refund 1 credit on error
    try {
      const supabaseForRefund = await createClient();
      const { data: { user: refundUser } } = await supabaseForRefund.auth.getUser();
      if (refundUser) {
        const { data: current } = await supabaseForRefund
          .from("users")
          .select("credits")
          .eq("id", refundUser.id)
          .single();
        if (current) {
          await supabaseForRefund
            .from("users")
            .update({ credits: current.credits + 1 })
            .eq("id", refundUser.id);
        }
      }
    } catch (refundErr) {
      console.error("Failed to refund credit:", refundErr);
    }

    const message =
      error instanceof Error
        ? error.message
        : "이미지 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

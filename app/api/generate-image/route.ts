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

    // Build contents array with system prompt prepended
    const contents: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [];

    const fullPrompt = prompt
      ? `${THUMBNAIL_SYSTEM_PROMPT}\n\n---\nUser Request: ${prompt}`
      : THUMBNAIL_SYSTEM_PROMPT;

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
      model: "gemini-3-pro-image-preview",
      contents: contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: "16:9",
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
      return NextResponse.json(
        { error: "이미지를 생성하지 못했습니다. 다른 프롬프트를 시도해주세요." },
        { status: 500 }
      );
    }

    // Save generated image to Supabase
    // Prepare supabase client & user within request context (cookies available here)
    if (result.image) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
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
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Image generation error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "이미지 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

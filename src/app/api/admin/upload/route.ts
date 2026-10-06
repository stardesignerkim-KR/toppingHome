import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * 이미지 업로드 → Supabase Storage
 *
 * Vercel Blob 대신 Supabase Storage 를 쓴다.
 * - 이미 쓰고 있는 서비스라 토큰을 따로 발급받을 필요가 없다
 * - 버킷이 없으면 자동 생성한다 (public)
 */

const BUCKET = "media";

async function ensureBucket() {
  const { data } = await supabaseAdmin.storage.getBucket(BUCKET);
  if (data) return;
  const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/x-icon",
    ],
  });
  // 동시 요청으로 이미 만들어진 경우는 무시
  if (error && !/already exists/i.test(error.message)) throw error;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "10MB 이하 파일만 올릴 수 있습니다." },
        { status: 400 }
      );
    }

    await ensureBucket();

    // 한글·공백 파일명이 URL 을 깨뜨리므로 안전한 이름으로 바꾼다
    const ext = (file.name.split(".").pop() || "png").toLowerCase().slice(0, 8);
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const folder = (formData.get("folder") as string | null) ?? "uploads";
    const path = `${folder}/${safe}`;

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({
      url: data.publicUrl,
      filename: path,
      size: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

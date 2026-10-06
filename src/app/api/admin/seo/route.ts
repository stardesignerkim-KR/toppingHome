import { supabaseAdmin } from "@/lib/supabase";
import { SEO_PAGE_IDS } from "@/lib/seo-pages";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("page_headers")
    .select("page_id, seo_title, seo_description, og_image_url");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  if (!Array.isArray(body?.items)) {
    return NextResponse.json({ error: "items 가 배열이 아닙니다." }, { status: 400 });
  }

  const rows = (body.items as Record<string, unknown>[])
    .filter((r) => SEO_PAGE_IDS.includes(String(r.page_id)))
    .map((r) => ({
      page_id: String(r.page_id),
      seo_title: String(r.seo_title ?? "").trim() || null,
      seo_description: String(r.seo_description ?? "").trim() || null,
      og_image_url: String(r.og_image_url ?? "").trim() || null,
      updated_at: new Date().toISOString(),
    }));

  if (rows.length === 0) {
    return NextResponse.json({ error: "저장할 항목이 없습니다." }, { status: 400 });
  }

  // page_headers 에 아직 없는 페이지(약관 등)도 있으므로 upsert 한다
  const { data, error } = await supabaseAdmin
    .from("page_headers")
    .upsert(rows, { onConflict: "page_id" })
    .select("page_id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ saved: data?.length ?? 0 });
}

import { supabaseAdmin } from "@/lib/supabase";
import { LIST_FALLBACK, LIST_SPEC_MAP, type ListKey } from "@/lib/lists";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const isKey = (k: string | null): k is ListKey => !!k && k in LIST_SPEC_MAP;

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

const NO_TABLE_MSG =
  "content_lists 테이블이 아직 없습니다. 관리자 → 대시보드의 『설치 SQL 보기』 내용을 Supabase SQL Editor 에 붙여넣고 실행해 주세요.";

/**
 * 테이블이 없을 때의 오류를 알아본다.
 *
 * ⚠️ 실제로 오는 문구가 여러 가지다:
 *   - Postgres 직접: code 42P01 ("relation ... does not exist")
 *   - PostgREST 경유: code PGRST205, message "Could not find the table 'public.x' in the schema cache"
 * 둘 다 잡아야 한다. 예전에 message 에 "exist" 가 들어간다고 가정했다가 놓쳤다.
 */
function isMissingTable(e: { code?: string; message?: string } | null) {
  if (!e) return false;
  if (e.code === "42P01" || e.code === "PGRST205") return true;
  const m = e.message ?? "";
  return /does not exist/i.test(m) || /could not find the table/i.test(m);
}

/** GET /api/admin/lists?key=stats — 한 목록 전체를 순서대로 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!isKey(key)) return bad("알 수 없는 목록입니다.");
  const { data, error } = await supabaseAdmin
    .from("content_lists")
    .select("*")
    .eq("list_key", key)
    .order("sort", { ascending: true });
  if (error) {
    // 테이블이 없어도 화면은 떠야 한다. 빈 목록으로 돌려주면
    // 화면이 『기본값 불러오기』를 안내한다.
    if (isMissingTable(error)) return NextResponse.json([]);
    return bad(error.message, 500);
  }
  return NextResponse.json(data ?? []);
}

/**
 * PUT — 한 목록을 통째로 저장한다.
 *
 * 줄 단위 저장이 아니라 통째 교체인 이유: 순서 바꾸기·중간 삭제가 섞이면
 * 줄마다 따로 저장할 때 순서가 어긋난다. 한 번에 지우고 다시 넣는 편이
 * 이 규모(최대 90줄)에서는 훨씬 안전하다.
 */
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const key = body?.key as string;
  if (!isKey(key)) return bad("알 수 없는 목록입니다.");
  if (!Array.isArray(body?.rows)) return bad("rows 가 배열이 아닙니다.");

  const rows = (body.rows as Record<string, unknown>[])
    .map((r, i) => ({
      list_key: key,
      sort: i,
      f1: String(r.f1 ?? "").trim(),
      f2: String(r.f2 ?? "").trim(),
      f3: String(r.f3 ?? "").trim(),
      items: Array.isArray(r.items)
        ? (r.items as unknown[]).map((x) => String(x).trim()).filter(Boolean)
        : [],
      updated_at: new Date().toISOString(),
    }))
    // 첫 칸이 비면 빈 줄로 보고 버린다
    .filter((r) => r.f1 !== "");

  if (rows.length === 0) return bad("최소 한 줄은 있어야 합니다.");

  // 메뉴는 잘못 저장하면 사이트 이동이 막힌다. 주소 형식을 검사한다.
  if (key === "nav") {
    const badHref = rows.find((r) => !/^\/[a-z0-9\-/]*$/i.test(r.f2));
    if (badHref) {
      return bad(`주소는 / 로 시작해야 합니다 — "${badHref.f1}" 의 주소를 확인하세요.`);
    }
  }

  const del = await supabaseAdmin.from("content_lists").delete().eq("list_key", key);
  if (del.error) {
    if (isMissingTable(del.error)) return bad(NO_TABLE_MSG, 500);
    return bad(del.error.message, 500);
  }

  const ins = await supabaseAdmin.from("content_lists").insert(rows).select();
  if (ins.error) {
    // 지우고 넣다가 실패하면 목록이 비어 버린다. 파일 기본값으로 되살린다.
    await supabaseAdmin.from("content_lists").insert(
      LIST_FALLBACK[key].map((r) => ({ ...r, updated_at: new Date().toISOString() }))
    );
    return bad(`저장 실패 — 기본값으로 되돌렸습니다: ${ins.error.message}`, 500);
  }
  return NextResponse.json(ins.data);
}

/** POST /api/admin/lists — 한 목록을 파일 기본값으로 초기화 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const key = body?.key as string;
  if (!isKey(key)) return bad("알 수 없는 목록입니다.");

  const wipe = await supabaseAdmin.from("content_lists").delete().eq("list_key", key);
  if (wipe.error && isMissingTable(wipe.error)) return bad(NO_TABLE_MSG, 500);

  const { data, error } = await supabaseAdmin
    .from("content_lists")
    .insert(
      LIST_FALLBACK[key].map((r) => ({ ...r, updated_at: new Date().toISOString() }))
    )
    .select();
  if (error) {
    if (isMissingTable(error)) return bad(NO_TABLE_MSG, 500);
    return bad(error.message, 500);
  }
  return NextResponse.json(data);
}

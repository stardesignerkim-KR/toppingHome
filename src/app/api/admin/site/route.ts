import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/** site_info(config_key text unique, config_value jsonb, updated_at) */

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_info')
      .select('config_key, config_value');

    if (error) throw error;

    // [{config_key, config_value}] → { key: value } 형태로 변환
    const map: Record<string, unknown> = {};
    (data ?? []).forEach((row) => {
      map[row.config_key] = row.config_value;
    });

    return NextResponse.json(map);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 단건 { key, value } 또는 다건 { items: [{key, value}] } 모두 허용
    const items: { key: string; value: unknown }[] = Array.isArray(body?.items)
      ? body.items
      : [{ key: body?.key, value: body?.value }];

    const rows = items
      .filter((it) => typeof it?.key === 'string' && it.key.length > 0)
      .map((it) => ({
        config_key: it.key,
        config_value: it.value ?? null,
        updated_at: new Date().toISOString(),
      }));

    if (rows.length === 0) {
      return NextResponse.json(
        { error: '저장할 항목이 없습니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('site_info')
      .upsert(rows, { onConflict: 'config_key' }) // 없으면 insert, 있으면 update
      .select();

    if (error) throw error;

    return NextResponse.json({ ok: true, saved: data?.length ?? 0, data });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

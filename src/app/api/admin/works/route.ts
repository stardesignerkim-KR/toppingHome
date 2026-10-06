import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('works')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
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

    const { data, error } = await supabaseAdmin
      .from('works')
      .insert([body])
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // PK 는 수정 대상에서 제외한다.
    // id 가 `generated always as identity` 인 테이블에서는
    // PK 를 update 에 포함하면 Postgres 가 거부한다:
    //   column "id" can only be updated to DEFAULT
    const { id, ...fields } = body;

    if (id === undefined || id === null || id === '') {
      return NextResponse.json(
        { error: 'id 가 없습니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('works')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '수정할 항목을 찾지 못했습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('works')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

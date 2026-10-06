import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('solutions')
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
      .from('solutions')
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
    const { solution_id, ...fields } = body;

    if (solution_id === undefined || solution_id === null || solution_id === '') {
      return NextResponse.json(
        { error: 'solution_id 가 없습니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('solutions')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('solution_id', solution_id)
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
      .from('solutions')
      .delete()
      .eq('solution_id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/** 공개 문의 폼 → inquiries 테이블 저장 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, position, phone, type, message, agree } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '이름 · 이메일 · 문의 내용은 필수입니다.' },
        { status: 400 }
      );
    }
    if (agree !== true) {
      return NextResponse.json(
        { error: '개인정보 수집·이용에 동의해 주세요.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
    }
    // 간단한 스팸 방지 — 지나치게 긴 본문 차단
    if (String(message).length > 5000) {
      return NextResponse.json({ error: '문의 내용이 너무 깁니다.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('inquiries').insert([
      {
        name: String(name).slice(0, 100),
        email: String(email).slice(0, 200),
        company: company ? String(company).slice(0, 200) : null,
        position: position ? String(position).slice(0, 100) : null,
        phone: phone ? String(phone).slice(0, 50) : null,
        inquiry_type: type ? String(type).slice(0, 100) : null,
        message: String(message),
        status: 'new',
        agreed_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

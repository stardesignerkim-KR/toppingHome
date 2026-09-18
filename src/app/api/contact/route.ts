import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // 입력 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '필수 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    // TODO: 실제 이메일 발송 (예: SendGrid, Resend, Nodemailer)
    // 지금은 로그에만 출력
    console.log('Contact form submission:', {
      name,
      email,
      company,
      message,
      timestamp: new Date().toISOString(),
    });

    // 추후 이메일 발송 구현 예시:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{
    //       to: [{ email: process.env.CONTACT_EMAIL }],
    //     }],
    //     from: { email: 'noreply@topping.com' },
    //     subject: `새로운 문의: ${name}`,
    //     html: `<p>${message}</p><p>회신: ${email}</p>`,
    //   }),
    // });

    return NextResponse.json({
      success: true,
      message: '문의가 접수되었습니다. 곧 연락드리겠습니다.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: '문의 접수 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data, error } = await resend.emails.send({
      from: process.env.SEND_OTP_FROM || 'noreply@okuper.com',
      to: body.to,
      subject: body.subject,
      html: body.html,
    });

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
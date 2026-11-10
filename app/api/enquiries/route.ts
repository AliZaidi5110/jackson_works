import { NextResponse } from 'next/server';

type Enquiry = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  vehicle?: string;
  engine?: string;
  service?: string;
  registration?: string;
  turboBrand?: string;
  turboModel?: string;
  turboFlange?: string;
  wastegate?: string;
  message?: string;
  website?: string;
};

export async function POST(request: Request) {
  let enquiry: Enquiry;
  try {
    enquiry = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 });
  }

  const email = String(enquiry.email ?? '').trim();
  const name = String(enquiry.name ?? `${enquiry.firstName ?? ''} ${enquiry.lastName ?? ''}`).trim();
  const message = String(enquiry.message ?? '').trim();
  if (enquiry.website) return NextResponse.json({ ok: true });
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter your name, a valid email address and a message.' }, { status: 400 });
  }
  if (name.length > 160 || email.length > 254 || message.length > 5000) {
    return NextResponse.json({ error: 'Please shorten your message and try again.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ENQUIRY_TO_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) {
    return NextResponse.json({ error: 'The business email service is not configured yet. Please try again later.' }, { status: 503 });
  }

  const details = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${enquiry.phone || 'Not provided'}`,
    `Subject: ${enquiry.subject || enquiry.service || 'Website enquiry'}`,
    `Vehicle: ${enquiry.vehicle || 'Not provided'}`,
    `Engine: ${enquiry.engine || 'Not provided'}`,
    `Registration: ${enquiry.registration || 'Not provided'}`,
    ...[
      ['Turbo brand', enquiry.turboBrand],
      ['Turbo model', enquiry.turboModel],
      ['Turbo inlet flange', enquiry.turboFlange],
      ['Wastegate', enquiry.wastegate],
    ].flatMap(([label, value]) => typeof value === 'string' && value.trim() ? [`${label}: ${value.trim().slice(0, 160)}`] : []),
    '',
    message,
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: sender, to: [recipient], reply_to: email, subject: `Website enquiry: ${String(enquiry.subject || enquiry.service || 'New message').slice(0, 100)}`, text: details }),
    });
    if (!response.ok) return NextResponse.json({ error: 'We could not send your message right now. Please try again later.' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'We could not send your message right now. Please try again later.' }, { status: 502 });
  }
}

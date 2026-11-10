import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { createAdminSession, verifyTotp } from '@/lib/admin-session';

function equalSecret(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export async function POST(request: Request) {
  const { email, password, code } = await request.json().catch(() => ({}));
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const totpSecret = process.env.ADMIN_TOTP_SECRET;
  if (!expectedEmail || !expectedPassword || !totpSecret || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Owner sign-in is not configured. Set the admin credentials and authenticator secret in the server environment.' }, { status: 503 });
  }
  if (!equalSecret(String(email ?? '').trim().toLowerCase(), expectedEmail) || !equalSecret(String(password ?? ''), expectedPassword) || !(await verifyTotp(totpSecret, String(code ?? '')))) {
    return NextResponse.json({ error: 'Email, password or authenticator code is incorrect.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('jdm_admin_session', await createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: 8 * 60 * 60,
  });
  return response;
}

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url));
  response.cookies.set('jdm_admin_session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/admin', maxAge: 0 });
  return response;
}

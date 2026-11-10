import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-session';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next();
  const token = request.cookies.get('jdm_admin_session')?.value;
  if (await verifyAdminSession(token)) return NextResponse.next();
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ['/admin/:path*'] };

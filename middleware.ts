import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow login page
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // For admin routes, just pass through - we'll handle auth on client side
  // This avoids issues with server-side localStorage access
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};

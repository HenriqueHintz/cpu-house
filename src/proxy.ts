import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.length > 1 && pathname.endsWith('/')) {
    const stripped = pathname.replace(/\/+$/, '');
    const cleanPathname = stripped ? `/${stripped.replace(/^\/+/, '')}` : '/';
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = cleanPathname;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/|.*\\..*).*)',
  ],
};

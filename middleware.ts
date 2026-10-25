import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

// Next.js 16 runs proxy.ts on Node.js and rejects a build that also has
// middleware.ts. This file is the edge runtime, which is where the signed
// cookie has to be checked.
const STATIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?)$/iu;

function isPublic(pathname: string) {
  if (pathname === '/login' || pathname.startsWith('/login/')) return true;
  if (pathname.startsWith('/_next/') || pathname === '/favicon.ico' || pathname === '/robots.txt') return true;
  // /og serves generated note images, not files from public/.
  if (pathname.startsWith('/og/')) return false;
  return STATIC_FILE.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  const from = `${pathname}${request.nextUrl.search}`;
  if (from !== '/') loginUrl.searchParams.set('from', from);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)'],
};

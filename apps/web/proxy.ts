import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/api/webhooks(.*)',
  '/_next(.*)',
  '/static(.*)',
  '/favicon.ico',
  '/invite(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth();
  const path = req.nextUrl.pathname;
  if (!isAuthenticated && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (isAuthenticated && path === '/') {
    const redirect = req.nextUrl.searchParams.get('redirect');
    if (redirect) {
      return NextResponse.redirect(new URL(redirect, req.url));
    }
    return NextResponse.redirect(new URL('/home', req.url));
  } else if (!isAuthenticated && path.startsWith('/invite')) {
    const token = path.split('/invite/')[1];
    return NextResponse.redirect(new URL(`/?redirect=/invite/${token}`, req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

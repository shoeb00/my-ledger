import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about(.*)',
  '/api/webhooks(.*)',
  '/_next(.*)',
  '/static(.*)',
  '/favicon.ico',
]);

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  } else if (isAuthenticated && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

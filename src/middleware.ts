import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Specify protected and public paths
const protectedPaths = ['/dashboard']; // Add any other paths that need protection
const publicPaths = ['/login', '/register']; // Auth pages are public

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // 3. Get the token from cookies (middleware cannot access localStorage)
  const token = request.cookies.get('authToken')?.value;

  // 4. Redirect logic
  if (isProtectedPath && !token) {
    // If trying to access a protected path without a token, redirect to login
    // Include the original path as a query parameter for redirection after login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicPath) {
    // If user is authenticated (has a token) and tries to access login/register,
    // redirect them to the dashboard or a default authenticated page.
    // This prevents authenticated users from seeing auth pages unnecessarily.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. Allow request to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files in the public folder (e.g., /logo.png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*) ',
  ],
};
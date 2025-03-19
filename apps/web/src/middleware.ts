import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Define routes that require authentication
const protectedRoutes = [
  '/calendar',
  '/settings',
  '/account'
];

// Define public routes that shouldn't redirect when authenticated
const publicRoutes = [
  '/',
  '/features',
  '/pricing',
  '/about',
  '/contact',
  '/login',
  '/signup',
  '/auth/callback'
];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Use the shared updateSession function that handles auth and cookies
  return await updateSession(request);
}

/**
 * Check if the path matches a protected route pattern
 */
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
}

/**
 * Define paths that require the middleware
 */
export const config = {
  matcher: [
    // Apply to all routes except static files and specific system files
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 
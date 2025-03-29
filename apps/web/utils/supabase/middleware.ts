import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = ['/calendar', '/profile', '/account', '/tasks'];

export async function updateSession(request: NextRequest) {
  // Create initial response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie on request (for this middleware)
          request.cookies.set({
            name,
            value,
            ...options,
          })
          
          // Set cookie on response (for the browser)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Remove cookie from request
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          
          // Remove cookie from response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // This will refresh session cookies if needed
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get the requested URL path
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Handle authentication checks
  // If the route is protected and user isn't authenticated
  if (isProtectedRoute(path) && !user) {
    // Store the requested URL to redirect back after login
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If trying to access login/signup pages while already authenticated
  if ((path.startsWith('/login') || path.startsWith('/signup')) && user) {
    // Redirect to calendar
    return NextResponse.redirect(new URL('/calendar', request.url));
  }

  return response;
}

/**
 * Check if the path matches a protected route pattern
 */
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
} 
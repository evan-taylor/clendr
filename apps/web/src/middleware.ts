import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// No longer defining routes here, logic is handled in updateSession

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Use the shared updateSession function that handles auth and cookies
  return await updateSession(request);
}

// Removed unused isProtectedRoute function

/**
 * Define paths that require the middleware
 */
export const config = {
  matcher: [
    // Apply to all routes except static files and specific system files
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 
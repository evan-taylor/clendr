import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/auth/callback'];

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (Next.js data fetching)
     * - favicon.ico (favicon file)
     * - API routes
     * - Public static files
     */
    '/((?!_next/static|_next/image|_next/data|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
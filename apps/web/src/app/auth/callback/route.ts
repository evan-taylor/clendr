import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// This route must be dynamic as it handles authentication callbacks
export const dynamic = 'force-dynamic';

/**
 * Handle OAuth callbacks from providers like Google
 * This route is called after successful authentication with the provider
 */
export async function GET(request: NextRequest) {
  try {
    // Get the URL and code from the request
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/calendar';
    
    // Get the site URL for redirects
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
    
    // Create a Supabase server client
    const supabase = await createClient();
    
    if (code) {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to login with error message
        return NextResponse.redirect(
          new URL(`/login?error=Authentication%20failed:%20${encodeURIComponent(error.message)}`, siteUrl)
        );
      }
    }
    
    // Redirect to the requested page or calendar by default
    return NextResponse.redirect(new URL(next, siteUrl));
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    // Redirect to login with generic error message
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    return NextResponse.redirect(
      new URL('/login?error=Authentication%20failed', siteUrl)
    );
  }
} 
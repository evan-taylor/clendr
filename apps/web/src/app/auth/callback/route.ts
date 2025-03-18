import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Force dynamic to avoid caching issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the URL and code from the request
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    console.log('[AUTH_CALLBACK] Processing callback with code:', !!code);
    
    if (!code) {
      console.log('[AUTH_CALLBACK] No code provided, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Create a Supabase client
    const supabase = await createClient();
    
    // Exchange the code for a session
    console.log('[AUTH_CALLBACK] Exchanging code for session...');
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('[AUTH_CALLBACK] Auth error:', error.message);
      return NextResponse.redirect(new URL('/login?error=auth_error', request.url));
    }
    
    // Verify the session was created successfully
    console.log('[AUTH_CALLBACK] Verifying session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('[AUTH_CALLBACK] No session after code exchange');
      return NextResponse.redirect(new URL('/login?error=no_session', request.url));
    }
    
    console.log('[AUTH_CALLBACK] Session created successfully for user:', session.user.id);
    
    // Get the "next" parameter from the URL or default to the calendar page
    const redirectTo = requestUrl.searchParams.get('next') || '/calendar';
    console.log('[AUTH_CALLBACK] Redirecting to:', redirectTo);
    
    try {
      // Get the origin from the request URL
      const origin = requestUrl.origin;
      
      // Ensure the redirectTo path starts with a slash
      const path = redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`;
      
      // Construct the full URL string before creating URL object
      const fullRedirectUrl = `${origin}${path}`;
      console.log('[AUTH_CALLBACK] Full redirect URL:', fullRedirectUrl);
      
      // Create the URL object from the string
      const redirectUrl = new URL(fullRedirectUrl);
      
      return NextResponse.redirect(redirectUrl);
    } catch (urlError) {
      console.error('[AUTH_CALLBACK] URL construction error:', urlError);
      // Fallback to a direct redirect to calendar if URL construction fails
      return NextResponse.redirect(new URL('/calendar', requestUrl.origin));
    }
  } catch (error) {
    console.error('[AUTH_CALLBACK] Unexpected error:', error);
    return NextResponse.redirect(new URL('/login?error=unexpected', request.url));
  }
} 
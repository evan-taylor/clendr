import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  return createServerComponentClient({
    cookies: () => cookieStore,
    options: {
      cookieOptions: {
        name: 'sb-auth',
        lifetime: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        path: '/',
      },
    },
  });
};

// Helper function to get the authenticated user server-side
export const getAuthenticatedUser = async () => {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  return {
    user: session.user,
    session,
  };
}; 
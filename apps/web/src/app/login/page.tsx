'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const { signInWithGoogle, isAuthenticated, isLoading, user, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  
  // Get the next URL from search params (where to redirect after login)
  const next = searchParams.get('next') || '/calendar';
  
  // Check for error messages in the URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'auth_error':
          setError('Authentication failed. Please try again.');
          break;
        case 'no_session':
          setError('Unable to create session. Please try again.');
          break;
        case 'unexpected':
          setError('An unexpected error occurred. Please try again.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    }
  }, [searchParams]);
  
  // If the user is already authenticated, redirect them
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      console.log('User authenticated, redirecting to:', next);
      
      // Use replace instead of push for more reliable redirection
      router.replace(next);
      
      // Set up a forceful redirect if the router.replace doesn't work
      const forceRedirectTimer = setTimeout(() => {
        setRedirectAttempts(prev => prev + 1);
        window.location.href = next;
      }, 1000);
      
      return () => clearTimeout(forceRedirectTimer);
    }
  }, [isAuthenticated, isLoading, router, next, user, redirectAttempts]);
  
  // Handle sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      // The OAuth flow will redirect to the callback URL
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Login error:', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Clendr</h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to access your calendar
          </p>
        </div>
        
        {error && (
          <div className="p-4 border border-destructive bg-destructive/10 rounded-md text-destructive text-center">
            {error}
          </div>
        )}
        
        {isAuthenticated && (
          <div className="p-4 border border-green-500 bg-green-50 rounded-md text-green-700 text-center">
            You are already signed in. Redirecting...
            <div className="mt-2">
              <Link href={next} className="text-primary-600 hover:underline">
                Click here if you are not redirected automatically
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || isAuthenticated}
            className="group relative flex w-full justify-center items-center rounded-md border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-70"
          >
            <span className="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
            </span>
            Sign in with Google
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
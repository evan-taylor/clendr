'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/Auth/LoginButton';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to calendar if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/calendar');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              go back to the homepage
            </Link>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <LoginButton className="w-full" />
            </div>
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 flex-shrink text-sm text-gray-400">
                Clendr uses secure authentication
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="text-center text-sm text-gray-500">
              <p>
                By signing in, you agree to our{' '}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
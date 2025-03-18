import '@/styles/globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import Navbar from '@/components/Navigation/Navbar';
import { headers } from 'next/headers';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/auth';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Clendr - The Lightning-Fast AI-Powered Calendar App',
  description: 'Transform how you schedule your time with Clendr, the intelligent calendar app that helps you manage your schedule effortlessly.',
  keywords: ['calendar', 'scheduling', 'ai', 'productivity', 'time management'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current path to determine if we're in an app route
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Only show the navbar on the landing page (not in app routes)
  const isLandingPage = pathname === '/';
  
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <head>
        <Script id="navigation-debug" strategy="beforeInteractive">
          {`
            (function() {
              console.log('[NAVIGATION] Initial page load:', window.location.pathname + window.location.search);

              // Track navigation events
              const originalPushState = history.pushState;
              const originalReplaceState = history.replaceState;

              history.pushState = function() {
                console.log('[NAVIGATION] pushState to:', arguments[2]);
                return originalPushState.apply(this, arguments);
              };

              history.replaceState = function() {
                console.log('[NAVIGATION] replaceState to:', arguments[2]);
                return originalReplaceState.apply(this, arguments);
              };

              // Track page visibility changes
              document.addEventListener('visibilitychange', function() {
                console.log('[NAVIGATION] Visibility changed:', document.visibilityState);
              });

              // Monitor auth-related local storage
              window.addEventListener('storage', function(e) {
                if (e.key && e.key.includes('supabase')) {
                  console.log('[AUTH_STORAGE] Storage event:', e.key);
                }
              });
            })();
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {isLandingPage && <Navbar />}
            <main className={isLandingPage ? 'pt-16' : ''}>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
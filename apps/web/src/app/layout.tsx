import '@/styles/globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/Navigation/Navbar';
import { headers } from 'next/headers';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/auth';
import ReduxStoreProvider from '@/store/Provider';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const ServiceWorkerProvider = dynamic(
  () => import('@/components/ServiceWorkerProvider'),
  { ssr: false }
);

const Notifications = dynamic(
  () => import('@/components/ui/Notification'),
  { ssr: false }
);

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0ea5e9',
};

export const metadata: Metadata = {
  title: 'Clendr - The Lightning-Fast AI-Powered Calendar App',
  description: 'Transform how you schedule your time with Clendr, the intelligent calendar app that helps you manage your schedule effortlessly.',
  keywords: ['calendar', 'scheduling', 'ai', 'productivity', 'time management'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Clendr',
  },
  icons: {
    icon: [
      { url: '/images/favicon.ico', sizes: '32x32' },
      { url: '/images/icons/icon-192x192.png', sizes: '192x192' },
      { url: '/images/icons/icon-512x512.png', sizes: '512x512' },
    ],
    apple: [
      { url: '/images/icons/apple-icon-180x180.png', sizes: '180x180' },
    ],
  },
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
        <ReduxStoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ServiceWorkerProvider>
              <AuthProvider>
                {isLandingPage && <Navbar />}
                <main className={isLandingPage ? 'pt-16' : ''}>{children}</main>
                <Notifications />
              </AuthProvider>
            </ServiceWorkerProvider>
          </ThemeProvider>
        </ReduxStoreProvider>
      </body>
    </html>
  );
} 
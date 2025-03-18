import '@/styles/globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import Navbar from '@/components/Navigation/Navbar';
import { AuthProvider } from '@/lib/auth';

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
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
} 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CalendarRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the correct calendar page
    router.replace('/calendar');
  }, [router]);
  
  return null;
} 
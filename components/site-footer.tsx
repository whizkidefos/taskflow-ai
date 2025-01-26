'use client';

import { useEffect, useState } from 'react';
import { NewsTicker } from '@/components/news-ticker';

export function SiteFooter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the date after component has mounted to prevent hydration mismatch
  const currentDate = mounted 
    ? new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto py-4 space-y-4">
        <NewsTicker />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <p suppressHydrationWarning>{currentDate}</p>
          <p>TaskFlow AI &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { PWAProvider } from '@/components/pwa-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="taskflow-theme"
    >
      <PWAProvider>
        {children}
      </PWAProvider>
      <Toaster />
    </ThemeProvider>
  );
}

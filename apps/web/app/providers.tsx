'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { Toaster } from '@/components/ui/sonner';
import { shadcn, experimental__simple as simple } from '@clerk/themes';
import RolesProvider from './context';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    if (theme) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col">
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        appearance={{ baseTheme: theme ? shadcn : simple }}
      >
        <Toaster position="top-right" visibleToasts={5} />
        <Navbar theme={theme} setThemeAction={() => setTheme(!theme)} />
        <RolesProvider>
          <main
            className={cn('flex-1 w-full max-w-7xl mx-auto p-4 sm:px-6 lg:px-8', theme && 'dark')}
          >
            {children}
            <SpeedInsights />
          </main>
          <Footer />
        </RolesProvider>
      </ClerkProvider>
    </div>
  );
}

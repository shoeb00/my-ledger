'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Navbar from './components/navbar';
import { Toaster } from '@/components/ui/sonner';
import { shadcn, experimental__simple as simple } from '@clerk/themes';
import RolesProvider from './context';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const media = window?.matchMedia('(prefers-color-scheme: dark)');
    const [theme, setTheme] = useState(!media.matches || false);
    useEffect(() => {
        const html = document.documentElement;
        if (theme) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div>
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
                appearance={{ baseTheme: theme ? shadcn : simple }}>
                <Toaster position="top-right" visibleToasts={5} />
                <Navbar theme={theme} setThemeAction={() => setTheme(!theme)} />
                <RolesProvider>
                    <div className={"max-w-7xl mx-auto p-2 sm:px-6 lg:px-8 h-[92vh] overflow-auto rounded-md border shadow-md" + (theme && 'dark')}>
                        {children}
                        <SpeedInsights />
                    </div>
                </RolesProvider>
            </ClerkProvider>
        </div >
    );
}

'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Navbar from './components/navbar';
import { Toaster } from '@/components/ui/sonner';
import { shadcn, experimental__simple as simple } from '@clerk/themes';

export default function Providers({
    children,
    theme,
    setThemeAction
}: {
    children: React.ReactNode;
    theme: boolean;
    setThemeAction: () => void;
}) {

    return (
        <div>
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
                appearance={{ baseTheme: theme ? shadcn : simple }}>
                <Toaster position="top-right" visibleToasts={5} />
                <Navbar theme={theme} setThemeAction={setThemeAction} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </ClerkProvider>
        </div >
    );
}

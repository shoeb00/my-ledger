'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Navbar from './components/navbar';
import { Toaster } from '@/components/ui/sonner';
import { shadcn, experimental__simple as simple } from '@clerk/themes';
import RolesProvider from './context';

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
                <RolesProvider>
                    <div className="max-w-7xl mx-auto p-2 sm:px-6 lg:px-8 h-[92vh] overflow-auto rounded-md border shadow-md">
                        {children}
                    </div>
                </RolesProvider>
            </ClerkProvider>
        </div >
    );
}

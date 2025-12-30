'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Navbar from './components/navbar';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
                <Toaster position="top-right" visibleToasts={5} />
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </ClerkProvider>
        </div>
    );
}

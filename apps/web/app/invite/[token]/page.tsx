'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import LoaderCircle from '../../components/loader';
import { useUser } from '@clerk/nextjs';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
    const baseUrl = process.env.WEB_URL!;
    const { token } = params;

    return {
        openGraph: {
            title: 'My Ledger – Invitation',
            description: 'Join My Ledger and manage credits & debits seamlessly.',
            url: `${baseUrl}/invite/${token}`,
            images: [
                {
                    url: `${baseUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            images: [`${baseUrl}/og-image.png`],
        },
    };
}


export default function AcceptInvite() {
    const router = useRouter();
    const token = useParams().token as string;
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded) return;

        const uuidRegex = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

        if (!uuidRegex.test(token)) {
            toast.error("Invalid invite link");
            router.push("/home");
            return;
        }

        window.localStorage.setItem('inviteToken', token);
        const path = isSignedIn ? '/home' : '/';
        router.push(path);

    }, [token, isSignedIn, isLoaded, router]);

    return <LoaderCircle loading={true} />;
}

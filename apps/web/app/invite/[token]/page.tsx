'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import LoaderCircle from '../../components/loader';
import { useUser } from '@clerk/nextjs';

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

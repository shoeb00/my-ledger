'use client';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { MoonIcon, SunDimIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar({ theme, setThemeAction }: { theme: boolean, setThemeAction: () => void }) {
  const router = useRouter();
  return (
    <header className="flex flex-row justify-between items-center p-4 gap-4 h-16">
      <div>
        <Button variant='ghost' onClick={() => router.push('/home')} className='hover:bg-transparent h-25 p-0'>
          <Image
            src={theme ? "/logo-dark.svg" : "/logo.svg"}
            alt="My Ledger Logo"
            width={30}
            height={20}
          />
          <span>My Ledger</span>
        </Button>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Button variant="ghost" onClick={setThemeAction}> {theme ? <SunDimIcon /> : <MoonIcon />}</Button>
        <SignedIn>
          <UserButton showName appearance={{
            elements: {
              userButtonBox: {
                textTransform: 'capitalize',
              },
            },
          }} />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline"> Create Account </Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </header >
  );
}

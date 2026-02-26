'use client';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { LogIn, MoonIcon, SunDimIcon, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar({
  theme,
  setThemeAction,
}: {
  theme: boolean;
  setThemeAction: () => void;
}) {
  const router = useRouter();
  return (
    <header className="flex flex-row justify-between items-center p-4 gap-4 h-16">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/home')}
          className="hover:bg-transparent h-auto p-0 flex items-center gap-2"
        >
          <Image
            src={theme ? '/logo-dark.svg' : '/logo.svg'}
            alt="My Ledger Logo"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <h1 className="font-[family-name:var(--font-tangerine)] font-black text-4xl">my-ledger</h1>
        </Button>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Button variant="ghost" onClick={setThemeAction}>
          {' '}
          {theme ? <SunDimIcon /> : <MoonIcon />}
        </Button>
        <SignedIn>
          <UserButton
            showName
            appearance={{
              elements: {
                userButtonBox: {
                  textTransform: 'capitalize',
                },
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="icon" className="sm:hidden">
              <LogIn className="w-5 h-5" />
            </Button>
          </SignInButton>
          <SignInButton mode="modal">
            <Button className="hidden sm:inline-flex">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" size="icon" className="sm:hidden">
              <UserPlus className="w-5 h-5" />
            </Button>
          </SignUpButton>
          <SignUpButton mode="modal">
            <Button variant="outline" className="hidden sm:inline-flex">
              {' '}
              Create Account{' '}
            </Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}

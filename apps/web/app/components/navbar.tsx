'use client';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { MoonIcon, SunDimIcon } from 'lucide-react';

export default function Navbar({ theme, setThemeAction }: { theme: boolean, setThemeAction: () => void }) {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <Button variant="ghost" onClick={setThemeAction}> {theme ? <SunDimIcon /> : <MoonIcon />}</Button>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="outline"> Create Account </Button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <UserButton showName appearance={{
          elements: {
            userButtonBox: {
              textTransform: 'capitalize',
            },
          },
        }} />
      </SignedIn>
    </header>
  );
}

'use client';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="outline"> Create Account </Button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <UserButton showName={true} />
      </SignedIn>
    </header>
  );
}

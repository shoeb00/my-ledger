import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="h-full">
      <main className="grid max-w-6xl mx-auto items-center gap-10 px-4 py-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            A simpler, free alternative to cashbook.in
            <br />
            Move your ledger in minutes.
          </h1>

          <p className="mt-4 max-w-prose text-muted-foreground">
            my-ledger lets you migrate your existing cashbook.in data and
            continue tracking credits and debits without complexity.
            Clean UI, no ads, and no lock-in.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
              Quick migration from cashbook.in — no manual re-entry
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
              Sign in with Google, Facebook, or email — OAuth only
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
              Free to use, built for individuals and small teams
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button variant="outline"> Get started </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            We never access or post your personal data. OAuth is used only for authentication.
          </p>
        </div>

        <div className="w-full">
          <div className="relative flex aspect-video items-center justify-center rounded-2xl border border-border bg-card">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border">
                ▶
              </div>
              <p className="text-sm font-medium">Product walkthrough</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Short video showing how my-ledger works
              </p>
            </div>

            {/* 
              Future:
              <video
                className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                autoPlay
                muted
                loop
                playsInline
                src="/demo.mp4"
              />
            */}
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} my-ledger. Free, simple, and private.
      </footer>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="h-full">
      <main
        className="
          mx-auto max-w-6xl
          grid gap-10
          px-4 py-8
          md:grid-cols-2 md:gap-16 md:py-12
        "
      >
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            A simpler, free alternative to cashbook.in
            <br className="hidden sm:block" />
            Move your ledger in minutes.
          </h1>

          <p className="mt-4 max-w-prose text-sm sm:text-base text-muted-foreground">
            my-ledger lets you migrate your existing cashbook.in data and
            continue tracking credits and debits without complexity.
            Clean UI, no ads, and no lock-in.
          </p>

          <ul className="mt-5 space-y-2 sm:space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              Quick migration from cashbook.in — no manual re-entry
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              Sign in with Google, Facebook, or email — OAuth only
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              Free to use, built for individuals and small teams
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button className="w-full sm:w-auto" variant="outline">
                  Get started
                </Button>
              </SignUpButton>

              <SignInButton mode="modal">
                <Button className="w-full sm:w-auto">
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            We never access or post your personal data. OAuth is used only for authentication.
          </p>
        </div>

        <div className="w-full md:flex md:items-center">
          <div
            className="
              relative flex aspect-video items-center justify-center
              rounded-xl sm:rounded-2xl
              border border-border bg-card
              text-center
            "
          >
            <div className="px-4">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-border">
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

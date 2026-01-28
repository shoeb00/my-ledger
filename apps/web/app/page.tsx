import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="h-full">
      <main
        className="
          mx-auto max-w-6xl
          grid gap-10
          px-4 py-6
          md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-8
          md:items-center
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

        <div className="w-full self-center">
          <div className="relative w-full aspect-video rounded-2xl">
            <Image
              src="/demo.gif"
              alt="Product demo"
              fill
              className="rounded-md"
            />
          </div>
        </div>

      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} my-ledger. Free, simple, and private.
      </footer>
    </div>
  );
}

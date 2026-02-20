import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 mt-auto py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} My Ledger. All rights reserved.</p>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms & Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}

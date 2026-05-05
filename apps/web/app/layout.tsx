import localFont from 'next/font/local';
import { Tangerine } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { Metadata } from 'next';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});
const tangerine = Tangerine({
  weight: ['400', '700'],
  variable: '--font-tangerine',
  subsets: ['latin'],
  display: 'swap',
});

if(!process.env.NEXT_PUBLIC_WEB_URL){
  throw new Error('NEXT_PUBLIC_WEB_URL is not defined');
}

export const metadata: Metadata = {
  title: {
    default: 'My Ledger',
    template: '%s | My Ledger',
  },
  description:
    'My Ledger is a simple, free alternative to cashbook.in. Easily migrate your existing data and track credits and debits with a clean UI, no ads, and complete privacy.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL!),
  openGraph: {
    title: 'My Ledger – Simple, free ledger management',
    description:
      'Move your ledger from cashbook.in in minutes. Track credits and debits with a clean UI, no ads, no lock-in, and complete privacy.',
    url: process.env.NEXT_PUBLIC_WEB_URL!,
    siteName: 'My Ledger',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'My Ledger',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${tangerine.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

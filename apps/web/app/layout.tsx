import localFont from 'next/font/local';
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

export const metadata: Metadata = {
  title: {
    default: 'My Ledger',
    template: '%s | My Ledger',
  },
  description: 'A simpler, free alternative to cashbook.in',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://my-ledger.app'),
  openGraph: {
    title: 'My Ledger',
    description: 'Move your ledger in minutes. Clean, free, private.',
    url: 'https://my-ledger.app',
    siteName: 'My Ledger',
    images: [
      {
        url: 'https://my-ledger.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My Ledger',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

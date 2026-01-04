'use client';
import localFont from 'next/font/local';
import './globals.css';
import Providers from './providers';
import { useState } from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState(false);
  return (
    <html lang="en" className={theme ? 'dark' : ''}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers theme={theme} setThemeAction={() => setTheme(!theme)}>{children}</Providers>
      </body>
    </html>
  );
}

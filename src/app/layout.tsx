import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ThreatLens AI — Digital Risk Protection & URL Threat Defense Platform',
  description:
    'Modern, explainable Digital Risk Protection with verified Brand Baseline exclusions, Social Media & App Store monitoring, and intelligent URL threat detection.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7F9FC] text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-800 font-sans">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coincerto',
  description: 'AI-generated music tracks based on cryptocurrency market sentiment',
  robots: 'noindex, nofollow',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Coincerto',
    description: 'AI-generated music tracks based on cryptocurrency market sentiment',
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
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
} 
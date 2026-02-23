import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Caffeine Sleep Safety Calculator',
  description: 'Calculate how long caffeine stays in your system and optimize your sleep schedule.',
  openGraph: {
    title: 'Caffeine Sleep Safety Calculator',
    description: 'Calculate how long caffeine stays in your system and optimize your sleep schedule.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caffeine Sleep Safety Calculator',
    description: 'Calculate how long caffeine stays in your system and optimize your sleep schedule.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans overflow-x-hidden`}>
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Lumière Atelier — Haute Joaillerie',
    default: 'Lumière Atelier | Fine Jewellery & Bespoke Ornaments',
  },
  description:
    "Curated collection of handcrafted women's fine jewellery, royal necklaces, uncut polki diamonds, bridal heritage ornaments, and artisanal treasures.",
  keywords: [
    'luxury jewellery',
    'haute joaillerie',
    'polki choker',
    'diamond necklace',
    'bridal ornaments',
    'bespoke fine jewellery',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Lumière Atelier',
    title: 'Lumière Atelier | Fine Jewellery & Bespoke Ornaments',
    description: "Curated collection of handcrafted women's fine jewellery and ornaments.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumière Atelier | Fine Jewellery & Bespoke Ornaments',
    description: "Curated collection of handcrafted women's fine jewellery and ornaments.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-ivory-warm text-charcoal-900 selection:bg-burgundy-primary selection:text-ivory-warm">
        {children}
      </body>
    </html>
  );
}


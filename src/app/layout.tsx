import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Manrope } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { MotionLenisProvider } from '@/components/providers/MotionLenisProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { COMPANY } from '@/lib/data/company';
import { getSiteUrl } from '@/lib/site-config';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: COMPANY.fullName,
    template: '%s | CPU House',
  },
  description: COMPANY.shortDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: COMPANY.fullName,
    title: COMPANY.fullName,
    description: COMPANY.shortDescription,
    images: [
      {
        url: COMPANY.logo.src,
        width: COMPANY.logo.width,
        height: COMPANY.logo.height,
        alt: COMPANY.logo.alt,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: COMPANY.fullName,
    description: COMPANY.shortDescription,
    images: [COMPANY.logo.src],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground"
        >
          Pular para o conteúdo principal
        </a>
        <JsonLd />
        <MotionLenisProvider>
          <Navbar />
          <main id="main-content" className="min-h-[calc(100vh-72px)] pt-[72px]">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
        </MotionLenisProvider>
      </body>
    </html>
  );
}

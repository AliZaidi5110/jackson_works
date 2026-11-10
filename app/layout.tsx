import type { Metadata } from 'next';
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/jdm-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';

const headingFont = Barlow_Condensed({
  weight: ['600', '700', '800'], subsets: ['latin'], display: 'swap', variable: '--font-heading-next',
  fallback: ['Arial Narrow', 'Helvetica Neue', 'Arial', 'sans-serif'], adjustFontFallback: true,
});
const bodyFont = Inter({
  subsets: ['latin'], display: 'swap', variable: '--font-body-next',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'], adjustFontFallback: true,
});
const monoFont = JetBrains_Mono({
  subsets: ['latin'], display: 'swap', variable: '--font-mono-next', preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'], adjustFontFallback: true,
});

// TODO: Update title, description and keywords once client confirms business name and domain.
export const metadata: Metadata = {
  title: {
    default: 'Jackson Works | Japanese Engine Parts & Workshop',
    template: '%s | Jackson Works',
  },
  description:
    'Preview a UK Japanese-engine parts and workshop storefront concept. Product, pricing and business details are sample content awaiting confirmation.',
  openGraph: {
    type: 'website',
    // TODO: Replace with real domain
    siteName: 'Jackson Works',
    locale: 'en_GB',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: false, follow: false },
  // TODO: Add verification meta tags for Google Search Console
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <head>
        {/* TODO: Add schema.org LocalBusiness JSON-LD once client confirms details */}
      </head>
      <body className="bg-zinc-50 text-zinc-950 font-sans antialiased">
        <AppProvider>
          {/* Skip-to-content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
          >
            Skip to main content
          </a>

          <Header />

          <main id="main-content" className="min-h-screen pb-20 lg:pb-0">
            {children}
          </main>

          <Footer />
          <ToastContainer />

          {/* Cookie consent placeholder */}
          {/* TODO: Implement UK GDPR-compliant cookie consent banner */}
        </AppProvider>
      </body>
    </html>
  );
}

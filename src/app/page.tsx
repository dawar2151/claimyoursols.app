import AnimatedPage from '@/app/utils/AnimatedPage';
import { NextPage } from 'next';
import Referral from './components/claimyoursol/Referal';
import ReferralMessage from './components/claimyoursol/ReferralMessage';
import { Suspense } from 'react';
import RefundSol from './components/claimyoursol/RefundSol';
import { Metadata } from 'next';
import Image from 'next/image';
import { colors } from './utils/colors';
import GitHubButton from './components/claimyoursol/GithubButton';

export const metadata: Metadata = {
  title: 'Claim Your SOLs',
  description: 'Close unused SPL token accounts and reclaim your SOL rent fees safely and securely. Recover locked SOL from inactive token accounts on Solana blockchain.',
  keywords: 'Solana, SOL, token accounts, rent recovery, blockchain, cryptocurrency, SPL tokens, account cleaner, récupération SOL, comptes jetons, blockchain Solana, cryptomonnaie, nettoyeur comptes, fermer comptes SPL, récupérer SOL, frais location, portefeuille Solana, DeFi, Web3',
  authors: [{ name: 'Claim Your SOLs' }],
  creator: 'Claim Your SOLs',
  publisher: 'Claim Your SOLs',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://claimyoursols.app',
    title: 'Claim Your SOLs | Récupérer vos SOL',
    description: 'Close unused SPL token accounts and reclaim your SOL rent fees safely and securely on Solana blockchain. Fermez les comptes de jetons SPL inutilisés et récupérez vos frais de location SOL.',
    siteName: 'Claim Your SOLs',
    images: [
      {
        url: 'https://claimyoursols.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Claim Your SOLs - Reclaim Your SOL | Récupérer vos SOL',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claim Your SOLs | Récupérer vos SOL',
    description: 'Close unused SPL token accounts and reclaim your SOL rent fees safely and securely. Fermez les comptes de jetons SPL inutilisés.',
    images: ['https://claimyoursols.app/og-image.png'],
    creator: '@your-twitter-handle',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ]
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#9945FF' },
    { media: '(prefers-color-scheme: dark)', color: '#9945FF' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://claimyoursols.app',
    languages: {
      'en-US': 'https://claimyoursols.app',
      'fr-FR': 'https://claimyoursols.app/fr',
    },
  },
  category: 'technology',
  classification: 'Finance Application',
  metadataBase: new URL('https://claimyoursols.app'),
};

const ReferralWrapper: React.FC = () => {
  return (
    <div>
      <Referral />
    </div>
  );
};

const ClaimYourSOLs: NextPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Claim Your SOLs",
    "alternateName": "Nettoyeur de Comptes Solana",
    "description": "Close unused SPL token accounts and reclaim your SOL rent fees safely and securely on Solana blockchain.",
    "url": "https://claimyoursols.app",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": ["en", "fr"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Claim Your SOLs"
    },
    "keywords": [
      "Solana", "SOL", "Token Accounts", "Rent Recovery", "Blockchain", "Cryptocurrency",
      "récupération SOL", "comptes jetons", "blockchain Solana", "cryptomonnaie",
      "nettoyeur comptes", "fermer comptes SPL", "DeFi", "Web3"
    ],
    "screenshot": "https://claimyoursols.app/og-image.png"
  };

  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script src="https://analytics.ahrefs.com/analytics.js" data-key="/Dc1fonqZVBe9hCEuAiUfg" async></script>
      <AnimatedPage>
        <div className="w-full max-w-4xl mx-auto">
          <ReferralMessage />

          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 animate-pulse">
                  <Image
                    src="/logo.png"
                    alt="Claim Your SOLs Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain rounded-full shadow-lg"
                    priority
                  />
                </div>
              </div>

              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: colors.text.primary }}
              >
                Solana Blockchain holds your SOL
              </h1>
              <h2
                className="text-5xl font-bold mb-4"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Claim it Back!
              </h2>

              <p
                className="max-w-2xl mx-auto text-lg mb-4"
                style={{ color: colors.text.secondary }}
              >
                The Solana Blockchain charges rent for unused SPL token accounts, even after you&apos;ve sold your tokens.
                Close those unused token accounts and Claim your sol rent fees safely and securely.
              </p>
            </div>

            <Suspense fallback={<div>Loading referral...</div>}>
              <RefundSol />
            </Suspense>
            {/* Wrap Referral in Suspense */}
            <ReferralWrapper />
          </div>
        </div>
        {/* Open Source Section */}
        <div
          className="max-w-2xl mx-auto p-4 rounded-lg border mb-8 text-center"
          style={{
            backgroundColor: `${colors.background.light}/10`,
            borderColor: `${colors.border}/50`
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ color: colors.primary }}
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Open Source & Transparent
            </h3>
          </div>
          <p
            className="text-sm mb-3"
            style={{ color: colors.text.secondary }}
          >
            This tool is completely open source. You can review the code, contribute, or run it yourself.
          </p>
          <div className="flex justify-center">
            <GitHubButton />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
};

export default ClaimYourSOLs;
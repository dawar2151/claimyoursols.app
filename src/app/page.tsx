import AnimatedPage from '@/app/utils/AnimatedPage';
import { NextPage } from 'next';
import Referral from './components/claimyoursol/Referal';
import ReferralMessage from './components/claimyoursol/ReferralMessage';
import { Suspense } from 'react';
import RefundSol from './components/claimyoursol/RefundSol';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Claim Your SOLs | Récupérer vos SOL',
  description: 'Close unused SPL token accounts and reclaim your SOL rent fees safely and securely. Recover locked SOL from inactive token accounts on Solana blockchain. Fermez les comptes de jetons SPL inutilisés et récupérez vos frais de location SOL en toute sécurité.',
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

const Accounts: NextPage = () => {
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

      <AnimatedPage>
        <div className="w-full max-w-4xl mx-auto">
          <ReferralMessage />

          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-2xl">◎</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Solana Blockchain holds your SOL
              </h1>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Claim it Back!
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
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
      </AnimatedPage>
    </>
  );
};

export default Accounts;
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - ClaimYourSols',
    description: 'Read the Terms of Service for ClaimYourSols token account management platform. Legal terms and conditions for using our SOL recovery tools.',
    alternates: {
        canonical: 'https://claimyoursols.app/terms/',
    },
    keywords: 'terms, of service, legal, bulk sender terms, solana terms, spl token terms',
    openGraph: {
        title: 'Terms of Service - ClaimYourSols',
        description: 'Read the Terms of Service for ClaimYourSols platform.',
        url: 'https://claimyoursols.app/terms/',
        type: 'website',
    },
};

export default function TermsOfService() {
    return (
        <div className="py-16 px-4 text-white">
            <h1 className="sr-only">Terms of Service - ClaimYourSols</h1>
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Terms of Service</h2>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Introduction</h2>
                    <p className="text-gray-300">Welcome to ClaimYourSols. By accessing or using our service, you agree to these Terms of Service. Please read them carefully.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
                    <p className="text-gray-300">By using ClaimYourSols, you acknowledge that you have read, understood, and agree to be bound by these terms and all applicable laws and regulations.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
                    <p className="text-gray-300">You are responsible for maintaining the security of your wallet and private keys. You agree not to use the service for any unlawful or malicious activities.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Prohibited Activities</h2>
                    <p className="text-gray-300">You may not use ClaimYourSols to violate any laws, infringe on intellectual property, or engage in fraudulent or harmful behavior.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
                    <p className="text-gray-300">ClaimYourSols is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages or losses resulting from your use of the service.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
                    <p className="text-gray-300">We reserve the right to update or modify these terms at any time. Continued use of the service constitutes acceptance of the revised terms.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
                    <p className="text-gray-300">If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@BulkSendTokens.xyz." className="text-blue-400 underline">support@BulkSendTokens.xyz.</a>.</p>
                </section>
            </div>
        </div>
    );
} 
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - ClaimYourSols',
    description: 'Read the Privacy Policy for ClaimYourSols platform.',
    alternates: {
        canonical: 'https://ClaimYourSols.app/privacy',
    },
    keywords: 'privacy policy, data protection, bulk sender privacy, solana privacy, spl token privacy',
    openGraph: {
        title: 'Privacy Policy - ClaimYourSols',
        description: 'Read the Privacy Policy for ClaimYourSols platform.',
        url: 'https://ClaimYourSols.app/privacy',
        type: 'website',
    },
};

export default function PrivacyPolicy() {
    return (
        <div className="py-16 px-4 text-white">
            <h1 className="sr-only">Privacy Policy - ClaimYourSols</h1>
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Privacy Policy</h2>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Introduction</h2>
                    <p className="text-gray-300">Welcome to ClaimYourSols. We are committed to protecting your privacy and ensuring transparency about how your information is handled.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Data Collection</h2>
                    <p className="text-gray-300">We do not collect personal information unless you voluntarily provide it (e.g., by contacting support or subscribing to our newsletter). Usage data may be collected for analytics and service improvement.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Data Usage</h2>
                    <p className="text-gray-300">Any data collected is used solely to improve our services, respond to inquiries, and communicate important updates. We do not sell or share your data with third parties for marketing purposes.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
                    <p className="text-gray-300">We may use third-party services (such as analytics providers) that collect, monitor, and analyze usage to help us improve our service. These providers have their own privacy policies.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">User Rights</h2>
                    <p className="text-gray-300">You have the right to access, update, or delete your personal information. To exercise these rights, please contact us using the information below.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
                    <p className="text-gray-300">If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@ClaimYourSols.xyz" className="text-blue-400 underline">support@ClaimYourSols.xyz</a>.</p>
                </section>
            </div>
        </div>
    );
} 
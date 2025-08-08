import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support - ClaimYourSols',
    description: 'Get help and support for ClaimYourSols. Contact our team for assistance.',
    alternates: {
        canonical: 'https://ClaimYourSols.app/support',
    },
    keywords: 'support, help, contact, bulk sender support, solana support, spl token support',
    openGraph: {
        title: 'Support - ClaimYourSols',
        description: 'Get help and support for ClaimYourSols. Contact our team for assistance.',
        url: 'https://ClaimYourSols.app/support',
        type: 'website',
    },
};

export default function Support() {
    return (
        <div className="py-16 px-4 text-white">
            <h1 className="sr-only">Support - ClaimYourSols</h1>
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Support</h2>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Getting Help</h2>
                    <p className="text-gray-300">If you need assistance with ClaimYourSols, we are here to help. Please review the options below to find the best way to reach us.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Contact Methods</h2>
                    <ul className="mb-2 text-gray-300 list-disc list-inside">
                        <li>Email: <a href="mailto:support@BulkSendTokens.xyz." className="text-blue-400 underline">support@BulkSendTokens.xyz.</a></li>
                        <li>Telegram: <a href="https://t.me/+Vwyn1CmtJhA5OTg8" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">@ClaimYourSols</a></li>
                    </ul>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Community Support</h2>
                    <p className="text-gray-300">Join our community channels for peer-to-peer support, updates, and discussions about new features.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Response Times</h2>
                    <p className="text-gray-300">We strive to respond to all inquiries within 24-48 hours. For urgent issues, please use Telegram for a faster response.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Feedback</h2>
                    <p className="text-gray-300">Your feedback helps us improve. Please let us know if you have suggestions or encounter any issues.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Security</h2>
                    <p className="text-gray-300">If you discover a security vulnerability, please report it directly to our team. We take security seriously and appreciate your help in keeping our platform safe.</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Thank You</h2>
                    <p className="text-gray-300">Thank you for using ClaimYourSols. We are dedicated to providing the best experience possible.</p>
                </section>
            </div>
        </div>
    );
} 
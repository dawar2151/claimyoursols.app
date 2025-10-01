import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how ClaimYourSols protects your data and ensures privacy while using our token account management tools. Read our Privacy Policy for more details.",
  keywords:
    "privacy policy, data protection, bulk sender privacy, solana privacy, spl token privacy",
  alternates: {
    canonical: "https:/claimyoursols.app/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Claim Your SOLs",
    description:
      "Learn how ClaimYourSols protects your data and ensures privacy while using our token account management tools. Read our Privacy Policy for more details.",
    url: "https:/claimyoursols.app/privacy",
    images: [
      {
        url: "https:/claimyoursols.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy | Claim Your SOLs",
      },
    ],
    type: "website",
  },
  twitter: {
    title: "Privacy Policy | Claim Your SOLs",
    description:
      "Learn how ClaimYourSols protects your data and ensures privacy while using our token account management tools. Read our Privacy Policy for more details.",
    card: "summary_large_image",
    images: ["https:/claimyoursols.app/og-image.png"],
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="py-16 px-4 text-white">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">Privacy Policy | Claim Your SOLs</h1>

      <div className="max-w-2xl mx-auto">
        {/* Visible H2 Title */}
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Privacy Policy
        </h2>

        {/* Sections */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Introduction</h3>
          <p className="text-gray-300">
            Welcome to ClaimYourSols. We are committed to protecting your
            privacy and ensuring transparency about how your information is
            handled.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
          <p className="text-gray-300">
            We do not collect personal information unless you voluntarily
            provide it (e.g., by contacting support or subscribing to our
            newsletter). Usage data may be collected for analytics and service
            improvement.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Data Usage</h3>
          <p className="text-gray-300">
            Any data collected is used solely to improve our services, respond
            to inquiries, and communicate important updates. We do not sell or
            share your data with third parties for marketing purposes.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Third-Party Services</h3>
          <p className="text-gray-300">
            We may use third-party services (such as analytics providers) that
            collect, monitor, and analyze usage to help us improve our service.
            These providers have their own privacy policies.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">User Rights</h3>
          <p className="text-gray-300">
            You have the right to access, update, or delete your personal
            information. To exercise these rights, please contact us using the
            information below.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
          <p className="text-gray-300">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at{" "}
            <a
              href="mailto:support@BulkSendTokens.xyz"
              className="text-blue-400 underline"
            >
              support@BulkSendTokens.xyz
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

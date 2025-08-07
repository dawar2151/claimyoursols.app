import Link from 'next/link';
import Image from 'next/image';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
            <div className="flex flex-col items-center space-y-6 max-w-md w-full">
                <div className="flex flex-col items-center space-y-2">
                    <FaExclamationTriangle className="w-16 h-16 text-yellow-500 animate-bounce" aria-hidden="true" />
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">404</h1>
                    <h2 className="text-2xl font-semibold">Page Not Found</h2>
                </div>
                <p className="text-center text-lg text-gray-600">
                    Oops! The page you are looking for doesn&apos;t exist or has been moved.<br />
                    Let&apos;s get you back to the right place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105 text-center"
                    >
                        Go Home
                    </Link>

                    <Link
                        href="/claimyoursol"
                        className="inline-block px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-200 hover:scale-105 text-center"
                    >
                        Claim Your SOL
                    </Link>
                </div>

                <div className="pt-6">
                    <Image src="/claimyoursols-logo.png" alt="ClaimYourSols Logo" width={64} height={64} className="rounded-full mx-auto" />
                </div>
            </div>
        </div>
    );
}

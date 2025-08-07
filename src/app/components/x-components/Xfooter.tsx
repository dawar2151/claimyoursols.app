'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaHeart
} from 'react-icons/fa';

export const XFooter = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} ClaimYourSols. All rights reserved.</span>
              <span>•</span>
              <span>Built with</span>
              <FaHeart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>for the crypto community</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                FAQ
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors duration-200">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

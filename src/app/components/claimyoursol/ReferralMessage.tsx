'use client'
import React from "react";
import { colors } from "@/app/utils/colors";

interface ReferralMessageProps { }

const ReferralMessage: React.FC<ReferralMessageProps> = () => {
    const handleScrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    return (
        <p className={`text-center text-sm md:text-base mt-8 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-90 animate-pulse px-8`}>
            Share your unique referral link with friends and earn a massive 50% more SOL on every referral!{' '}
            <a
                href="#bottom"
                onClick={handleScrollToBottom}
                className={`inline-block text-[${colors.primary}] px-4 py-2 rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-lg`}
            >
                Get Your Link
            </a>
        </p>
    );
};

export default ReferralMessage;
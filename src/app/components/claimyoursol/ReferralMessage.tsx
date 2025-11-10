'use client'
import React from "react";

interface ReferralMessageProps { }

const ReferralMessage: React.FC<ReferralMessageProps> = () => {
    const handleScrollToBottom = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleScrollToBottom();
        }
    };

    return (
        <p
            role="button"
            tabIndex={0}
            onClick={handleScrollToBottom}
            onKeyDown={handleKeyDown}
            className="text-center text-sm md:text-base mt-8 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-90 animate-pulse px-8 cursor-pointer"
            aria-label="Get your referral link"
        >
            Share your referral link — earn 50% bonus on each successful referral. Click to get your link.
        </p>
    );
};

export default ReferralMessage;
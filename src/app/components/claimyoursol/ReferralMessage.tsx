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
            className="text-center text-sm md:text-base mt-6 mb-4 text-gray-700 px-4 cursor-pointer hover:underline"
            aria-label="Get your referral link"
        >
            Share your referral link — earn 50% bonus on each successful referral. Click to get your link.
        </p>
    );
};

export default ReferralMessage;
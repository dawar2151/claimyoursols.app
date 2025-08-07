'use client';
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPageProps {
    children: ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={"router.route"}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    );
};

export default AnimatedPage;
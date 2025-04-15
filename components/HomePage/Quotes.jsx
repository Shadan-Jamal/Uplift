'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import quotesData from "../data/quotes.json";

export default function Quotes() {
    const [currentQuote, setCurrentQuote] = useState(null);

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotesData.length);
        return quotesData[randomIndex];
    };

    useEffect(() => {
        // Set initial quote
        setCurrentQuote(getRandomQuote());

        // Change quote every 7 minutes
        const interval = setInterval(() => {
            setCurrentQuote(getRandomQuote());
        }, 10 * 1000); 

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    if (!currentQuote) {
        return (
            <div className="min-h-[120px] flex items-center justify-center">
                <p className="text-white/50">Loading...</p>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentQuote.quote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4 min-h-[60px] max-w-full lg:max-h-[120px] lg:max-w-[70dvw]"
            >
                <motion.blockquote 
                    className="text-lg lg:text-xl italic text-wrap whitespace-pre-wrap text-black"
                >
                    "{currentQuote.quote}"
                </motion.blockquote>
                <motion.cite 
                    className="text-sm not-italic text-wrap whitespace-pre-wrap text-black"
                >
                    — {currentQuote.author}
                </motion.cite>
            </motion.div>
        </AnimatePresence>
    );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Affirmation() {

    const [affirmation, setAffirmation] = useState("");

    useEffect(() => {
        const getAffirmations = async () => {
            try {
                const response = await fetch("/api/affirmations");
                if (!response.ok) {
                    throw new Error('Failed to fetch affirmations');
                }
                const data = await response.json();
                console.log(data)
                if (data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    setAffirmation(data[randomIndex].text);
                } else {
                    setAffirmation("You are capable of amazing things.");
                }
            } catch (error) {
                console.error('Error fetching affirmations:', error);
            }
        }
        getAffirmations();
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border-2 border-indigo-200 shadow-lg"
            >
                <p className="text-md font-bold text-indigo-900 tracking-wide">
                    "{affirmation}"
                </p>
            </motion.div>
        </AnimatePresence>
    );
}
